import { useSend, useMention, Text } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer, Add_灵石 as Add___, Add_修为 as Add___$1, Add_血气 as Add___$2, foundthing, addNajieThing } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?发.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
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
    let ifexistplay = await existplayer(B_qq);
    if (!ifexistplay) {
        Send(Text('对方无存档'));
        return false;
    }
    let thing_name = e.MessageText.replace(/^(#|＃|\/)?发/, '');
    let code = thing_name.split('*');
    thing_name = code[0];
    let thing_amount = code[1];
    let thing_piji;
    thing_amount = Number(thing_amount);
    if (isNaN(thing_amount)) {
        thing_amount = 1;
    }
    if (thing_name == '灵石') {
        await Add___(B_qq, thing_amount);
    }
    else if (thing_name == '修为') {
        await Add___$1(B_qq, thing_amount);
    }
    else if (thing_name == '血气') {
        await Add___$2(B_qq, thing_amount);
    }
    else {
        let thing_exist = await foundthing(thing_name);
        if (!thing_exist) {
            Send(Text(`这方世界没有[${thing_name}]`));
            return false;
        }
        let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 };
        thing_piji = pj[code[1]];
        if (thing_exist.class == '装备') {
            if (thing_piji) {
                thing_amount = code[2];
            }
            else {
                thing_piji = 0;
            }
        }
        thing_amount = Number(thing_amount);
        if (isNaN(thing_amount)) {
            thing_amount = 1;
        }
        await addNajieThing(B_qq, thing_name, thing_exist.class, thing_amount, thing_piji);
    }
    Send(Text(`发放成功,增加${thing_name} x ${thing_amount}`));
});

export { res as default, regular };
