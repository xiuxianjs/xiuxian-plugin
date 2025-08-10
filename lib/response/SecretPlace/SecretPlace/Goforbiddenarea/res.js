import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../api/api.js';
import config from '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import { Go, readPlayer, notUndAndNull, addCoin, addExp } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?前往禁地.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let flag = await Go(e);
    if (!flag) {
        return false;
    }
    let player = await readPlayer(usr_qq);
    let now_level_id;
    if (!notUndAndNull(player.level_id)) {
        Send(Text('请先#同步信息'));
        return false;
    }
    if (!notUndAndNull(player.power_place)) {
        Send(Text('请#同步信息'));
        return false;
    }
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 22) {
        Send(Text('没有达到化神之前还是不要去了'));
        return false;
    }
    let didian = await e.MessageText.replace(/^(#|＃|\/)?前往禁地/, '');
    didian = didian.trim();
    let weizhi = await data.forbiddenarea_list.find(item => item.name == didian);
    if (!notUndAndNull(weizhi)) {
        return false;
    }
    if (player.灵石 < weizhi.Price) {
        Send(Text('没有灵石寸步难行,攒到' + weizhi.Price + '灵石才够哦~'));
        return false;
    }
    if (player.修为 < weizhi.experience) {
        Send(Text('你需要积累' + weizhi.experience + '修为，才能抵抗禁地魔气！'));
        return false;
    }
    let Price = weizhi.Price;
    await addCoin(usr_qq, -Price);
    await addExp(usr_qq, -weizhi.experience);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    const time = cf.CD.forbiddenarea;
    let action_time = 60000 * time;
    let arr = {
        action: '禁地',
        end_time: new Date().getTime() + action_time,
        time: action_time,
        shutup: '1',
        working: '1',
        Place_action: '0',
        Place_actionplus: '1',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        Place_address: weizhi
    };
    if (e.name == 'message.create') {
        arr.group_id = e.ChannelId;
    }
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':action', JSON.stringify(arr));
    Send(Text('正在前往' + weizhi.name + ',' + time + '分钟后归来!'));
});

export { res as default, regular };
