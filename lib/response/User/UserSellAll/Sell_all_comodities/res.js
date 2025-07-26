import { useMessage, Text, useSubscribe } from 'alemonjs';
import '../../../../api/api.js';
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
import data from '../../../../model/XiuxianData.js';
import { existplayer, addNajieThing, Add_灵石 as Add___, sleep } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?一键出售(.*)$/;
var res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let commodities_price = 0;
    let najie = await await data.getData('najie', usr_qq);
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
        let thing = e.MessageText.replace(/^(#|＃|\/)?/, '');
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
                    await addNajieThing(usr_qq, l.name, l.class, -quantity, l.pinji);
                    commodities_price = commodities_price + l.出售价 * quantity;
                }
            }
        }
        await Add___(usr_qq, commodities_price);
        message.send(format(Text(`出售成功!  获得${commodities_price}灵石 `)));
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
        message.send(format(Text('没有东西可以出售')));
        return false;
    }
    goods.push('\n回复[1]出售,回复[0]取消出售');
    for (let i = 0; i < goods.length; i += 8) {
        message.send(format(Text(goods.slice(i, i + 8).join(''))));
        await sleep(500);
    }
    const [subscribe] = useSubscribe(e, selects);
    const sub = subscribe.mount(async (event) => {
        const [message] = useMessage(event);
        let new_msg = event.MessageText;
        let difficulty = new_msg === '1';
        if (!difficulty) {
            message.send(format(Text('已取消出售')));
            clearTimeout(timeout);
            return;
        }
        clearTimeout(timeout);
        let usr_qq = event.UserId;
        let najie = await data.getData('najie', usr_qq);
        let commodities_price = 0;
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
        for (let i of wupin) {
            for (let l of najie[i]) {
                if (l && l.islockd == 0) {
                    let quantity = l.数量;
                    await addNajieThing(usr_qq, l.name, l.class, -quantity, l.pinji);
                    commodities_price = commodities_price + l.出售价 * quantity;
                }
            }
        }
        await Add___(usr_qq, commodities_price);
        message.send(format(Text(`出售成功!  获得${commodities_price}灵石 `)));
    }, ['UserId']);
    const timeout = setTimeout(() => {
        subscribe.cancel(sub);
        message.send(format(Text('超时自动取消出售')));
    }, 30000);
});

export { res as default, regular };
