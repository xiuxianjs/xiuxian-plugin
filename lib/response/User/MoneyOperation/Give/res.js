import { useSend, useMention, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { keys, getRedisKey } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import { parseUnitNumber } from '../../../../model/utils/utilsx.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import 'dayjs';
import { existplayer, readNajie } from '../../../../model/xiuxiandata.js';
import { addCoin } from '../../../../model/economy.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
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
import 'crypto';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?赠送[\u4e00-\u9fa5a-zA-Z\d]+(\*[\u4e00-\u9fa5]+)?(\*\d+(k|w|e)?)?/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const A_qq = e.UserId;
    if (!(await existplayer(A_qq))) {
        return false;
    }
    const [mention] = useMention(e);
    const res = await mention.findOne();
    const target = res?.data;
    if (!target || res.code !== 2000) {
        return false;
    }
    const B_qq = target.UserId;
    if (!(await existplayer(B_qq))) {
        void Send(Text('此人尚未踏入仙途'));
        return false;
    }
    const playerA = await getDataJSONParseByKey(keys.player(A_qq));
    if (!playerA) {
        return;
    }
    const playerB = await getDataJSONParseByKey(keys.player(B_qq));
    if (!playerB) {
        return;
    }
    const cf = await config.getConfig('xiuxian', 'xiuxian');
    const msg = e.MessageText.replace(/^(#|＃|\/)?赠送/, '').trim();
    if (msg.startsWith('灵石')) {
        const value = msg.replace(/([\u4e00-\u9fa5])|(\*)/g, '');
        const lingshi = parseUnitNumber(value);
        if (lingshi <= 0) {
            void Send(Text('数量需为正'));
            return false;
        }
        const cost = cf.percentage.cost;
        const lastlingshi = lingshi + Math.trunc(lingshi * cost);
        if (playerA.灵石 < lastlingshi) {
            void Send(Text(`你身上似乎没有${lastlingshi}灵石`));
            return false;
        }
        const nowTime = Date.now();
        const lastgetbungStr = await redis.get(getRedisKey(A_qq, 'last_getbung_time'));
        const lastgetbung_time = lastgetbungStr ? parseInt(lastgetbungStr, 10) : 0;
        const transferTimeout = Math.floor(cf.CD.transfer * 60000);
        if (nowTime < lastgetbung_time + transferTimeout) {
            const remain = lastgetbung_time + transferTimeout - nowTime;
            const waittime_m = Math.trunc(remain / 60000);
            const waittime_s = Math.trunc((remain % 60000) / 1000);
            void Send(Text(`每${transferTimeout / 60000}分钟赠送灵石一次，正在CD中，剩余cd: ${waittime_m}分${waittime_s}秒`));
            return false;
        }
        await addCoin(A_qq, -lastlingshi);
        await addCoin(B_qq, lingshi);
        void Send(Text(`${playerB.名号} 获得了由 ${playerA.名号}赠送的${lingshi}灵石`));
        await redis.set(getRedisKey(A_qq, 'last_getbung_time'), String(nowTime));
        return;
    }
    const code = msg.split('*');
    const thingName = code[0];
    if (!thingName) {
        void Send(Text('未识别名称'));
        return false;
    }
    const pinjiStr = code.length === 3 ? code[1] : code.length === 2 && /[\u4e00-\u9fa5]/.test(code[1]) ? code[1] : undefined;
    const quantityStr = code.length === 3 ? code[2] : code.length === 2 ? (/[\u4e00-\u9fa5]/.test(code[1]) ? undefined : code[1]) : undefined;
    const quantity = quantityStr ? parseUnitNumber(quantityStr) : 1;
    if (quantity <= 0) {
        void Send(Text('数量需为正'));
        return false;
    }
    const najie = await readNajie(A_qq);
    const thingExist = await foundthing(thingName);
    if (!thingExist) {
        void Send(Text(`这方世界没有[${thingName}]`));
        return false;
    }
    const pj = {
        劣: 0,
        普: 1,
        优: 2,
        精: 3,
        极: 4,
        绝: 5,
        顶: 6
    };
    let thing_piji = pinjiStr ? pj[pinjiStr] : undefined;
    let equ;
    const cls = thingExist.class;
    if (cls === '装备') {
        if (thing_piji !== undefined) {
            equ = najie.装备.find(item => item.name === thingName && item.pinji === thing_piji);
        }
        else {
            const sorted = najie.装备.filter(item => item.name === thingName).sort((a, b) => b.pinji - a.pinji);
            equ = sorted[0];
            thing_piji = equ?.pinji;
        }
    }
    else if (cls === '仙宠') {
        equ = najie.仙宠.find(item => item.name === thingName);
    }
    if (!cls) {
        void Send(Text('不支持赠送此类型物品'));
        return false;
    }
    const own = await existNajieThing(A_qq, thingName, cls, thing_piji);
    if (own === false || own < quantity) {
        void Send(Text(`你还没有这么多[${thingName}]`));
        return false;
    }
    await addNajieThing(A_qq, thingName, cls, -quantity, thing_piji);
    if (cls === '装备' || cls === '仙宠') {
        if (!equ) {
            void Send(Text('未找到可赠送的实例'));
            return false;
        }
        await addNajieThing(B_qq, equ, cls, quantity, thing_piji);
    }
    else {
        await addNajieThing(B_qq, thingName, cls, quantity, thing_piji);
    }
    void Send(Text(`${playerB.名号} 获得了由 ${playerA.名号}赠送的[${thingName}]×${quantity}`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
