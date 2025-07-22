import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';
import '../../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../../config/help/Association.yaml.js';
import '../../../../config/help/help.yaml.js';
import '../../../../config/help/helpcopy.yaml.js';
import '../../../../config/help/set.yaml.js';
import '../../../../config/help/shituhelp.yaml.js';
import '../../../../config/parameter/namelist.yaml.js';
import '../../../../config/task/task.yaml.js';
import '../../../../config/version/version.yaml.js';
import '../../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import { existplayer, Read_najie, foundthing, convert2integer, exist_najie_thing, Add_najie_thing, Add_灵石 as Add___ } from '../../../../model/xiuxian.js';
import data from '../../../../model/XiuxianData.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)出售.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let thing = e.MessageText.replace('#', '');
    thing = thing.replace('出售', '');
    let code = thing.split('*');
    let thing_name = code[0];
    code[0] = parseInt(code[0]);
    let thing_amount = code[1];
    let thing_piji;
    let najie = await Read_najie(usr_qq);
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
    thing_piji = pj[code[1]];
    if (thing_exist.class == '装备') {
        if (thing_piji) {
            thing_amount = code[2];
        }
        else {
            let equ = najie.装备.find(item => item.name == thing_name);
            if (!equ) {
                Send(Text(`你没有[${thing_name}]这样的${thing_exist.class}`));
                return false;
            }
            for (let i of najie.装备) {
                if (i.name == thing_name && i.pinji < equ.pinji) {
                    equ = i;
                }
            }
            thing_piji = equ.pinji;
        }
    }
    thing_amount = await convert2integer(thing_amount);
    let x = await exist_najie_thing(usr_qq, thing_name, thing_exist.class, thing_piji);
    if (!x) {
        Send(Text(`你没有[${thing_name}]这样的${thing_exist.class}`));
        return false;
    }
    if (x < thing_amount) {
        Send(Text(`你目前只有[${thing_name}]*${x}`));
        return false;
    }
    await Add_najie_thing(usr_qq, thing_name, thing_exist.class, -thing_amount, thing_piji);
    let commodities_price;
    commodities_price = thing_exist.出售价 * thing_amount;
    if (data.zalei.find(item => item.name == thing_name.replace(/[0-9]+/g, ''))) {
        let sell = najie.装备.find(item => item.name == thing_name && thing_piji == item.pinji);
        commodities_price = sell.出售价 * thing_amount;
    }
    await Add___(usr_qq, commodities_price);
    Send(Text(`出售成功!  获得${commodities_price}灵石,还剩余${thing_name}*${x - thing_amount} `));
});

export { res as default, name, regular, selects };
