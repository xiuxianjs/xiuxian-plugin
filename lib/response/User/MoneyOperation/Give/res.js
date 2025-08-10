import { useSend, useMention, Text } from 'alemonjs';
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
import { existplayer, addCoin, readNajie, foundthing, existNajieThing, addNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import { parseUnitNumber } from '../../../../model/utils.js';

const regular = /^(#|＃|\/)?赠送[\u4e00-\u9fa5a-zA-Z\d]+(\*[\u4e00-\u9fa5]+)?(\*\d+(k|w|e)?)?/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const A_qq = e.UserId;
    if (!(await existplayer(A_qq)))
        return false;
    const [mention] = useMention(e);
    const User = (await mention.findOne()).data;
    if (!User)
        return;
    const B_qq = User.UserId;
    if (!(await existplayer(B_qq))) {
        Send(Text(`此人尚未踏入仙途`));
        return false;
    }
    const A_player = await data.getData('player', A_qq);
    const B_player = await data.getData('player', B_qq);
    const cf = config.getConfig('xiuxian', 'xiuxian');
    let msg = e.MessageText.replace(/^(#|＃|\/)?赠送/, '').trim();
    if (msg.startsWith('灵石')) {
        const value = msg.replace(/([\u4e00-\u9fa5])|(\*)/g, '');
        const lingshi = parseUnitNumber(value);
        const cost = cf.percentage.cost;
        let lastlingshi = lingshi + Math.trunc(lingshi * cost);
        if (A_player.灵石 < lastlingshi) {
            Send(Text(`你身上似乎没有${lastlingshi}灵石`));
            return false;
        }
        let nowTime = Date.now();
        let lastgetbung_time = await redis.get('xiuxian@1.3.0:' + A_qq + ':last_getbung_time');
        lastgetbung_time = parseInt(lastgetbung_time);
        let transferTimeout = Math.floor(cf.CD.transfer * 60000);
        if (nowTime < lastgetbung_time + transferTimeout) {
            let waittime_m = Math.trunc((lastgetbung_time + transferTimeout - nowTime) / 60 / 1000);
            let waittime_s = Math.trunc(((lastgetbung_time + transferTimeout - nowTime) % 60000) / 1000);
            Send(Text(`每${transferTimeout / 1000 / 60}分钟赠送灵石一次，正在CD中，` +
                `剩余cd: ${waittime_m}分${waittime_s}秒`));
            return;
        }
        await addCoin(A_qq, -lastlingshi);
        await addCoin(B_qq, lingshi);
        Send(Text(`${B_player.名号} 获得了由 ${A_player.名号}赠送的${lingshi}灵石`));
        await redis.set('xiuxian@1.3.0:' + A_qq + ':last_getbung_time', nowTime);
        return;
    }
    const code = msg.split('*');
    const thing_name = code[0];
    const pinjiStr = code.length === 3
        ? code[1]
        : code.length === 2 && /[\u4e00-\u9fa5]/.test(code[1])
            ? code[1]
            : undefined;
    const quantityStr = code.length === 3
        ? code[2]
        : code.length === 2
            ? /[\u4e00-\u9fa5]/.test(code[1])
                ? undefined
                : code[1]
            : undefined;
    const quantity = quantityStr ? parseUnitNumber(quantityStr) : 1;
    let najie = await readNajie(A_qq);
    let thing_exist = await foundthing(thing_name);
    if (!thing_exist) {
        Send(Text(`这方世界没有[${thing_name}]`));
        return false;
    }
    let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 };
    let thing_piji = pinjiStr ? pj[pinjiStr] : undefined;
    let equ;
    if (thing_exist.class == '装备') {
        if (thing_piji !== undefined) {
            equ = najie.装备.find(item => item.name == thing_name && item.pinji == thing_piji);
        }
        else {
            equ = najie.装备
                .filter(item => item.name == thing_name)
                .sort((a, b) => b.pinji - a.pinji)[0];
            thing_piji = equ?.pinji;
        }
    }
    else if (thing_exist.class == '仙宠') {
        equ = najie.仙宠.find(item => item.name == thing_name);
    }
    let x = await existNajieThing(A_qq, thing_name, thing_exist.class, thing_piji);
    if (x < quantity || !x) {
        Send(Text(`你还没有这么多[${thing_name}]`));
        return false;
    }
    await addNajieThing(A_qq, thing_name, thing_exist.class, -quantity, thing_piji);
    if (thing_exist.class == '装备' || thing_exist.class == '仙宠') {
        await addNajieThing(B_qq, equ, thing_exist.class, quantity, thing_piji);
    }
    else {
        await addNajieThing(B_qq, thing_name, thing_exist.class, quantity, thing_piji);
    }
    Send(Text(`${B_player.名号} 获得了由 ${A_player.名号}赠送的[${thing_name}]×${quantity}`));
});

export { res as default, regular };
