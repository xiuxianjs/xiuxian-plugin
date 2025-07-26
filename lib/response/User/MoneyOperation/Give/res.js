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
import { existplayer, convert2integer, Add_灵石 as Add___, readNajie, foundthing, existNajieThing, addNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?赠送.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let A_qq = e.UserId;
    let ifexistplay = await existplayer(A_qq);
    if (!ifexistplay)
        return false;
    const Mentions = (await useMention(e)[0].find({ IsBot: false })).data;
    if (!Mentions || Mentions.length === 0) {
        return;
    }
    const User = Mentions.find(item => !item.IsBot);
    if (!User) {
        return;
    }
    let B_qq = User.UserId;
    ifexistplay = await existplayer(B_qq);
    if (!ifexistplay) {
        Send(Text(`此人尚未踏入仙途`));
        return false;
    }
    let A_player = await await data.getData('player', A_qq);
    let B_player = await await data.getData('player', B_qq);
    let msg = e.MessageText.replace(/^(#|＃|\/)?赠送/, '');
    const cf = config.getConfig('xiuxian', 'xiuxian');
    if (msg.startsWith('灵石')) {
        let lingshi = msg.replace('灵石*', '');
        lingshi = await convert2integer(lingshi);
        const cost = cf.percentage.cost;
        let lastlingshi = lingshi + Math.trunc(lingshi * cost);
        if (A_player.灵石 < lastlingshi) {
            Send(Text(`你身上似乎没有${lastlingshi}灵石`));
            return false;
        }
        let now = new Date();
        let nowTime = now.getTime();
        let lastgetbung_time = await redis.get('xiuxian@1.3.0:' + A_qq + ':last_getbung_time');
        lastgetbung_time = parseInt(lastgetbung_time);
        let transferTimeout = Math.floor(cf.CD.transfer * 60000);
        if (nowTime < lastgetbung_time + transferTimeout) {
            let waittime_m = Math.trunc((lastgetbung_time + transferTimeout - nowTime) / 60 / 1000);
            let waittime_s = Math.trunc(((lastgetbung_time + transferTimeout - nowTime) % 60000) / 1000);
            Send(Text(`每${transferTimeout / 1000 / 60}分钟赠送灵石一次，正在CD中，` +
                `剩余cd: ${waittime_m}分${waittime_s}秒`));
            return false;
        }
        await Add___(A_qq, -lastlingshi);
        await Add___(B_qq, lingshi);
        Send(Text(`${B_player.名号} 获得了由 ${A_player.名号}赠送的${lingshi}灵石`));
        await redis.set('xiuxian@1.3.0:' + A_qq + ':last_getbung_time', nowTime);
        return false;
    }
    else {
        let code = msg.split('*');
        let thing_name = code[0];
        code[0] = parseInt(code[0]);
        let quantity = code[1];
        let thing_piji;
        let najie = await readNajie(A_qq);
        if (code[0]) {
            if (code[0] > 1000) {
                try {
                    thing_name = najie.仙宠[code[0] - 1001].name;
                }
                catch {
                    Send(Text('仙宠代号输入有误!'));
                    return false;
                }
            }
            else if (code[0] > 100) {
                try {
                    thing_name = najie.装备[code[0] - 101].name;
                    code[1] = najie.装备[code[0] - 101].pinji;
                }
                catch {
                    Send(Text('装备代号输入有误!'));
                    return false;
                }
            }
        }
        let thing_exist = await foundthing(thing_name);
        if (!thing_exist) {
            Send(Text(`这方世界没有[${thing_name}]`));
            return false;
        }
        let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 };
        let equ;
        thing_piji = pj[code[1]];
        if (thing_exist.class == '装备') {
            if (thing_piji) {
                quantity = code[2];
                equ = najie.装备.find(item => item.name == thing_name && item.pinji == thing_piji);
            }
            else {
                equ = najie.装备.find(item => item.name == thing_name);
                for (let i of najie.装备) {
                    if (i.name == thing_name && i.pinji < equ.pinji) {
                        equ = i;
                    }
                }
                thing_piji = equ.pinji;
            }
        }
        else if (thing_exist.class == '仙宠') {
            equ = najie.仙宠.find(item => item.name == thing_name);
        }
        quantity = await convert2integer(quantity);
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
    }
});

export { res as default, regular };
