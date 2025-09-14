import { useSend, Text } from 'alemonjs';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { looktripod, readMytripod, readTripod, writeDuanlu } from '../../../../model/duanzaofu.js';
import 'crypto';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?熔炼.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const A = await looktripod(userId);
    if (A !== 1) {
        void Send(Text('请先去#炼器师能力评测,再来煅炉吧'));
        return false;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    if (player.occupation !== '炼器师') {
        void Send(Text('切换到炼器师后再来吧,宝贝'));
        return false;
    }
    const thing = e.MessageText.replace(/^(#|＃|\/)?熔炼/, '');
    const code = thing.split('*');
    const thingName = code[0];
    const account = code[1];
    const parsedCount = convert2integer(account);
    const thing_acount = typeof parsedCount === 'number' && !Number.isNaN(parsedCount) ? parsedCount : 1;
    const wupintype = await foundthing(thingName);
    if (!wupintype || wupintype.type !== '锻造') {
        void Send(Text('凡界物品无法放入煅炉'));
        return false;
    }
    const mynumRaw = await existNajieThing(userId, thingName, '材料');
    const mynum = typeof mynumRaw === 'number' ? mynumRaw : 0;
    if (mynum < thing_acount) {
        void Send(Text('材料不足,无法放入'));
        return false;
    }
    const tripod = await readMytripod(userId);
    if (tripod.状态 === 1) {
        void Send(Text('正在炼制中,无法熔炼更多材料'));
        return false;
    }
    let num1 = 0;
    if (player.仙宠.type === '炼器') {
        num1 = Math.trunc(player.仙宠.等级 / 33);
    }
    let num = 0;
    for (const item in tripod.数量) {
        num += Number(tripod.数量[item]);
    }
    const shengyu = tripod.容纳量 + num1 + Math.floor(player.occupation_level / 2) - num - Number(thing_acount);
    if (num + Number(thing_acount) > tripod.容纳量 + num1 + Math.floor(player.occupation_level / 2)) {
        void Send(Text(`该煅炉当前只能容纳[${shengyu + Number(thing_acount)}]物品`));
        return false;
    }
    const newtripod = await readTripod();
    for (const item of newtripod) {
        if (userId === item.qq) {
            item.材料.push(thingName);
            item.数量.push(thing_acount);
            await writeDuanlu(newtripod);
            await addNajieThing(userId, thingName, '材料', -thing_acount);
            const yongyou = num + Number(thing_acount);
            void Send(Text(`熔炼成功,当前煅炉内拥有[${yongyou}]个材料,根据您现有等级,您还可以放入[${shengyu}]个材料`));
            return false;
        }
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
