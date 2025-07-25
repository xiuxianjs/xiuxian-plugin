import { useSend, Text } from 'alemonjs';
import '../../../../api/api.js';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import data from '../../../../model/XiuxianData.js';
import { existplayer, Read_player, convert2integer, isNotNull, exist_najie_thing, Add_najie_thing, Add_职业经验 as Add_____ } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?炼制.*(\*[0-9]*)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let player = await Read_player(usr_qq);
    if (player.occupation != '炼丹师') {
        Send(Text('丹是上午炼的,药是中午吃的,人是下午走的'));
        return false;
    }
    let t = e.MessageText.replace(/^(#|＃|\/)?炼制/, '').split('*');
    if (+t <= 0) {
        t = 1;
    }
    let danyao = t[0];
    let n = await convert2integer(t[1]);
    let tmp_msg = '';
    let danfang = data.danfang_list.find(item => item.name == danyao);
    if (!isNotNull(danfang)) {
        Send(Text(`世界上没有丹药[${danyao}]的配方`));
        return false;
    }
    if (danfang.level_limit > player.occupation_level) {
        Send(Text(`${danfang.level_limit}级炼丹师才能炼制${danyao}`));
        return false;
    }
    let materials = danfang.materials;
    let exp = danfang.exp;
    tmp_msg += '消耗';
    for (let i in materials) {
        let material = materials[i];
        let x = await exist_najie_thing(usr_qq, material.name, '草药');
        if (x == false) {
            x = 0;
        }
        if (x < material.amount * n) {
            Send(Text(`纳戒中拥有${material.name}${x}份，炼制需要${material.amount * n}份`));
            return false;
        }
    }
    for (let i in materials) {
        let material = materials[i];
        tmp_msg += `${material.name}×${material.amount * n}，`;
        await Add_najie_thing(usr_qq, material.name, '草药', -material.amount * n);
    }
    let total_exp = exp[1] * n;
    if (player.仙宠.type == '炼丹') {
        let random = Math.random();
        if (random < player.仙宠.加成) {
            n *= 2;
            Send(Text('你的仙宠' + player.仙宠.name + '辅佐了你进行炼丹,成功获得了双倍丹药'));
        }
        else {
            Send(Text('你的仙宠只是在旁边看着'));
        }
    }
    if (danyao == '神心丹' ||
        danyao == '九阶淬体丹' ||
        danyao == '九阶玄元丹' ||
        danyao == '起死回生丹') {
        await Add_najie_thing(usr_qq, danyao, '丹药', n);
        Send(Text(`${tmp_msg}得到${danyao}${n}颗，获得炼丹经验${total_exp}`));
    }
    else {
        let dengjixiuzheng = player.occupation_level;
        let newrandom = Math.random();
        let newrandom2 = Math.random();
        if (newrandom >= 0.1 + (dengjixiuzheng * 3) / 100) {
            await Add_najie_thing(usr_qq, '凡品' + danyao, '丹药', n);
            Send(Text(`${tmp_msg}得到"凡品"${danyao}${n}颗，获得炼丹经验${total_exp}`));
        }
        else {
            if (newrandom2 >= 0.4) {
                await Add_najie_thing(usr_qq, '极品' + danyao, '丹药', n);
                Send(Text(`${tmp_msg}得到"极品"${danyao}${n}颗，获得炼丹经验${total_exp}`));
            }
            else {
                await Add_najie_thing(usr_qq, '仙品' + danyao, '丹药', n);
                Send(Text(`${tmp_msg}得到"仙品"${danyao}${n}颗，获得炼丹经验${total_exp}`));
            }
        }
    }
    await Add_____(usr_qq, total_exp);
});

export { res as default, regular };
