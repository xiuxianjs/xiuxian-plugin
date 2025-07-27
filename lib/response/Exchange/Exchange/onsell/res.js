import { useSend, Text } from 'alemonjs';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/namelist.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/version.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '../../../../model/XiuxianData.js';
import '../../../../api/api.js';
import { existplayer, readNajie, foundthing, convert2integer, existNajieThing, readExchange, writeExchange, readPlayer, addCoin, addNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?上架.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let najie = await readNajie(usr_qq);
    let thing = e.MessageText.replace(/^(#|＃|\/)?上架/, '');
    let code = thing.split('*');
    let thing_name = code[0];
    code[0] = parseInt(code[0]);
    let thing_value = code[1];
    let thing_amount = code[2];
    let thing_piji;
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
            thing_value = code[2];
            thing_amount = code[3];
            equ = najie.装备.find(item => item.name == thing_name && item.pinji == thing_piji);
        }
        else {
            let najie = await readNajie(usr_qq);
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
    thing_value = await convert2integer(thing_value);
    thing_amount = await convert2integer(thing_amount);
    let x = await existNajieThing(usr_qq, thing_name, thing_exist.class, thing_piji);
    if (!x || x < thing_amount) {
        Send(Text(`你没有那么多[${thing_name}]`));
        return false;
    }
    let Exchange = [];
    try {
        Exchange = await readExchange();
    }
    catch {
        await writeExchange([]);
    }
    let now_time = new Date().getTime();
    let whole = Math.trunc(thing_value * thing_amount);
    let off = Math.trunc(whole * 0.03);
    if (off < 100000)
        off = 100000;
    let player = await readPlayer(usr_qq);
    if (player.灵石 < off) {
        Send(Text('就这点灵石还想上架'));
        return false;
    }
    await addCoin(usr_qq, -off);
    let wupin;
    if (thing_exist.class == '装备' || thing_exist.class == '仙宠') {
        let pinji2 = ['劣', '普', '优', '精', '极', '绝', '顶'];
        let pj = pinji2[thing_piji];
        wupin = {
            qq: usr_qq,
            name: equ,
            price: thing_value,
            pinji2: thing_piji,
            pinji: pj,
            aconut: thing_amount,
            whole: whole,
            now_time: now_time
        };
        await addNajieThing(usr_qq, equ.name, thing_exist.class, -thing_amount, thing_piji);
    }
    else {
        wupin = {
            qq: usr_qq,
            name: thing_exist,
            price: thing_value,
            aconut: thing_amount,
            whole: whole,
            now_time: now_time
        };
        await addNajieThing(usr_qq, thing_name, thing_exist.class, -thing_amount);
    }
    Exchange.push(wupin);
    await writeExchange(Exchange);
    Send(Text('上架成功！'));
});

export { res as default, regular };
