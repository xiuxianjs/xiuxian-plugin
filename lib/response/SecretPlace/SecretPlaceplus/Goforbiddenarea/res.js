import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey } from '../../../../model/keys.js';
import { startAction } from '../../../../model/actionHelper.js';
import { convert2integer } from '../../../../model/utils/number.js';
import '@alemonjs/db';
import { getDataList } from '../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'dayjs';
import 'buffer';
import { Go, notUndAndNull } from '../../../../model/common.js';
import { readPlayer } from '../../../../model/xiuxiandata.js';
import { addCoin, addExp } from '../../../../model/economy.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?沉迷禁地.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const flag = await Go(e);
    if (!flag) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('请先#踏入仙途'));
        return false;
    }
    if (!notUndAndNull(player.level_id)) {
        void Send(Text('请先#同步信息'));
        return false;
    }
    if (!notUndAndNull(player.power_place)) {
        void Send(Text('请#同步信息'));
        return false;
    }
    const levelList = await getDataList('Level1');
    const now_level_id = levelList.find(item => item.level_id === player.level_id).level_id;
    if (now_level_id < 22) {
        void Send(Text('没有达到化神之前还是不要去了'));
        return false;
    }
    let didian = e.MessageText.replace(/^(#|＃|\/)?沉迷禁地/, '');
    const code = didian.split('*');
    didian = code[0];
    const i = convert2integer(code[1]);
    if (i > 12) {
        return false;
    }
    const forbiddenareaList = await getDataList('ForbiddenArea');
    const weizhiRaw = forbiddenareaList.find(item => item.name === didian);
    if (!notUndAndNull(weizhiRaw)) {
        return false;
    }
    const weizhiUnknown = weizhiRaw;
    const guardWeizhi = (v) => {
        if (!v || typeof v !== 'object') {
            return false;
        }
        const r = v;
        return typeof r.Price === 'number' && typeof r.experience === 'number' && typeof r.name === 'string';
    };
    if (!guardWeizhi(weizhiUnknown)) {
        return false;
    }
    const weizhi = weizhiUnknown;
    if (player.灵石 < weizhi.Price * 10 * i) {
        void Send(Text('没有灵石寸步难行,攒到' + weizhi.Price * 10 * i + '灵石才够哦~'));
        return false;
    }
    if (player.修为 < weizhi.experience * 10 * i) {
        void Send(Text('你需要积累' + weizhi.experience * 10 * i + '修为，才能抵抗禁地魔气！'));
        return false;
    }
    const number = await existNajieThing(userId, '秘境之匙', '道具');
    if (typeof number === 'number' && number >= i) {
        await addNajieThing(userId, '秘境之匙', '道具', -i);
    }
    else {
        void Send(Text('你没有足够数量的秘境之匙'));
        return false;
    }
    const Price = weizhi.Price * 10 * i;
    const Exp = weizhi.experience * 10 * i;
    await addCoin(userId, -Price);
    await addExp(userId, -Exp);
    const time = i * 10 * 5 + 10;
    const action_time = 60000 * time;
    const arr = await startAction(userId, '禁地', action_time, {
        shutup: '1',
        working: '1',
        Place_action: '1',
        Place_actionplus: '0',
        power_up: '1',
        mojie: '1',
        xijie: '1',
        plant: '1',
        mine: '1',
        cishu: 10 * i,
        Place_address: weizhi,
        group_id: e.name === 'message.create' ? e.ChannelId : undefined
    });
    await redis.set(getRedisKey(String(userId), 'action'), JSON.stringify(arr));
    void Send(Text('正在前往' + weizhi.name + ',' + time + '分钟后归来!'));
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
