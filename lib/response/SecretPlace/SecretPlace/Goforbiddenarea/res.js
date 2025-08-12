import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { startAction } from '../../../actionHelper.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readPlayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { addCoin, addExp } from '../../../../model/economy.js';
import 'lodash-es';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import 'classnames';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?前往禁地.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const player = await readPlayer(usr_qq);
    if (!notUndAndNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    if (!notUndAndNull(player.power_place)) {
        Send(Text('请#同步信息'));
        return false;
    }
    const now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 22) {
        Send(Text('没有达到化神之前还是不要去了'));
        return false;
    }
    let didian = await e.MessageText.replace(/^(#|＃|\/)?前往禁地/, '');
    didian = didian.trim();
    const weizhiRaw = await data.forbiddenarea_list.find(item => item.name == didian);
    if (!notUndAndNull(weizhiRaw)) {
        return false;
    }
    const weizhiUnknown = weizhiRaw;
    const guardWeizhi = (v) => {
        if (!v || typeof v !== 'object')
            return false;
        const r = v;
        return (typeof r.Price === 'number' &&
            typeof r.experience === 'number' &&
            typeof r.name === 'string');
    };
    if (!guardWeizhi(weizhiUnknown)) {
        return false;
    }
    const weizhi = weizhiUnknown;
    if (player.灵石 < weizhi.Price) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'));
        return false;
    }
    if (player.修为 < weizhi.experience) {
        Send(Text('你需要积累' + weizhi.experience + '修为，才能抵抗禁地魔气！'));
        return false;
    }
    const Price = weizhi.Price;
    await addCoin(usr_qq, -Price);
    await addExp(usr_qq, -weizhi.experience);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.forbiddenarea;
    const action_time = 60000 * time;
    const arr = await startAction(usr_qq, '禁地', action_time, {
        shutup: '1',
        working: '1',
        Place_action: '0',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        Place_address: weizhi,
        group_id: e.name == 'message.create' ? e.ChannelId : undefined
    });
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('正在前往' + weizhi.name + ',' + time + '分钟后归来!'));
});

export { res as default, regular };
