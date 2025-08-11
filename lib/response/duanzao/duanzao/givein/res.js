import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/Config.js';
import { looktripod, readMytripod, readTripod, writeDuanlu } from '../../../../model/duanzaofu.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import data from '../../../../model/XiuxianData.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import { readDanyao } from '../../../../model/danyao.js';
import '../../../../model/temp.js';
import { foundthing } from '../../../../model/cultivation.js';
import 'dayjs';
import 'fs';
import 'path';
import 'jsxp';
import 'react';
import '../../../../resources/html/adminset/adminset.css.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/html/association/association.css.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/html/danfang/danfang.css.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/html/gongfa/gongfa.css.js';
import '../../../../resources/html/equipment/equipment.css.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/html/fairyrealm/fairyrealm.css.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/html/forbidden_area/forbidden_area.css.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/html/supermarket/supermarket.css.js';
import '../../../../resources/html/Ranking/tailwindcss.css.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help/help.js';
import '../../../../resources/html/log/log.css.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/html/ningmenghome/ningmenghome.css.js';
import '../../../../resources/html/najie/najie.css.js';
import '../../../../resources/html/player/player.css.js';
import '../../../../resources/html/playercopy/player.css.js';
import '../../../../resources/html/secret_place/secret_place.css.js';
import '../../../../resources/html/shenbing/shenbing.css.js';
import '../../../../resources/html/shifu/shifu.css.js';
import '../../../../resources/html/shitu/shitu.css.js';
import '../../../../resources/html/shituhelp/common.css.js';
import '../../../../resources/html/shituhelp/shituhelp.css.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/html/shop/shop.css.js';
import '../../../../resources/html/statezhiye/statezhiye.css.js';
import '../../../../resources/html/sudoku/sudoku.css.js';
import '../../../../resources/html/talent/talent.css.js';
import '../../../../resources/html/temp/temp.css.js';
import '../../../../resources/html/time_place/time_place.css.js';
import '../../../../resources/html/tujian/tujian.css.js';
import '../../../../resources/html/tuzhi/tuzhi.css.js';
import '../../../../resources/html/valuables/valuables.css.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import '../../../../resources/html/updateRecord/updateRecord.css.js';
import '../../../../resources/html/BlessPlace/BlessPlace.css.js';
import '../../../../resources/html/jindi/BlessPlace.css.js';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?熔炼.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const user_qq = e.UserId;
    if (!(await existplayer(user_qq)))
        return false;
    const A = await looktripod(user_qq);
    if (A != 1) {
        Send(Text(`请先去#炼器师能力评测,再来煅炉吧`));
        return false;
    }
    const player = await await data.getData('player', user_qq);
    if (player.occupation != '炼器师') {
        Send(Text(`切换到炼器师后再来吧,宝贝`));
        return false;
    }
    const thing = e.MessageText.replace(/^(#|＃|\/)?熔炼/, '');
    const code = thing.split('*');
    const thing_name = code[0];
    const account = code[1];
    const parsedCount = await convert2integer(account);
    const thing_acount = typeof parsedCount === 'number' && !Number.isNaN(parsedCount)
        ? parsedCount
        : 1;
    const wupintype = await foundthing(thing_name);
    if (!wupintype || wupintype.type != '锻造') {
        Send(Text(`凡界物品无法放入煅炉`));
        return false;
    }
    const mynumRaw = await existNajieThing(user_qq, thing_name, '材料');
    const mynum = typeof mynumRaw === 'number' ? mynumRaw : 0;
    if (mynum < thing_acount) {
        Send(Text(`材料不足,无法放入`));
        return false;
    }
    const tripod = await readMytripod(user_qq);
    if (tripod.状态 == 1) {
        Send(Text(`正在炼制中,无法熔炼更多材料`));
        return false;
    }
    let num1 = 0;
    if (player.仙宠.type == '炼器') {
        num1 = Math.trunc(player.仙宠.等级 / 33);
    }
    let num = 0;
    for (const item in tripod.数量) {
        num += Number(tripod.数量[item]);
    }
    let dyew = 0;
    const dyList = await readDanyao(user_qq);
    for (const d of dyList) {
        const extra = d.beiyong5;
        if (typeof extra === 'number' && extra > 0) {
            dyew = extra;
            break;
        }
    }
    const shengyu = dyew +
        tripod.容纳量 +
        num1 +
        Math.floor(player.occupation_level / 2) -
        num -
        Number(thing_acount);
    if (num + Number(thing_acount) >
        tripod.容纳量 + dyew + num1 + Math.floor(player.occupation_level / 2)) {
        Send(Text(`该煅炉当前只能容纳[${shengyu + Number(thing_acount)}]物品`));
        return false;
    }
    let newtripod = [];
    try {
        newtripod = await readTripod();
    }
    catch {
        await writeDuanlu([]);
    }
    for (const item of newtripod) {
        if (user_qq == item.qq) {
            item.材料.push(thing_name);
            item.数量.push(thing_acount);
            await writeDuanlu(newtripod);
            await addNajieThing(user_qq, thing_name, '材料', -thing_acount);
            const yongyou = num + Number(thing_acount);
            Send(Text(`熔炼成功,当前煅炉内拥有[${yongyou}]个材料,根据您现有等级,您还可以放入[${shengyu}]个材料`));
            return false;
        }
    }
});

export { res as default, regular };
