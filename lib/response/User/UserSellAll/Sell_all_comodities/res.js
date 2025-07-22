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
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, Add_najie_thing, Add_灵石 as Add___, sleep } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)一键出售(.*)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let commodities_price = 0;
    let najie = await data.getData('najie', usr_qq);
    let wupin = [
        '装备',
        '丹药',
        '道具',
        '功法',
        '草药',
        '材料',
        '仙宠',
        '仙宠口粮'
    ];
    let wupin1 = [];
    if (e.MessageText != '#一键出售') {
        let thing = e.MessageText.replace('#一键出售', '');
        for (let i of wupin) {
            if (thing == i) {
                wupin1.push(i);
                thing = thing.replace(i, '');
            }
        }
        if (thing.length == 0) {
            wupin = wupin1;
        }
        else {
            return false;
        }
        for (let i of wupin) {
            for (let l of najie[i]) {
                if (l && l.islockd == 0) {
                    let quantity = l.数量;
                    await Add_najie_thing(usr_qq, l.name, l.class, -quantity, l.pinji);
                    commodities_price = commodities_price + l.出售价 * quantity;
                }
            }
        }
        await Add___(usr_qq, commodities_price);
        Send(Text(`出售成功!  获得${commodities_price}灵石 `));
        return false;
    }
    let goodsNum = 0;
    let goods = [];
    goods.push('正在出售:');
    for (let i of wupin) {
        for (let l of najie[i]) {
            if (l && l.islockd == 0) {
                let quantity = l.数量;
                goods.push('\n' + l.name + '*' + quantity);
                goodsNum++;
            }
        }
    }
    if (goodsNum == 0) {
        Send(Text('没有东西可以出售'));
        return false;
    }
    goods.push('\n回复[1]出售,回复[0]取消出售');
    for (let i = 0; i < goods.length; i += 8) {
        Send(Text(goods.slice(i, i + 8).join('')));
        await sleep(500);
    }
});

export { res as default, name, regular, selects };
