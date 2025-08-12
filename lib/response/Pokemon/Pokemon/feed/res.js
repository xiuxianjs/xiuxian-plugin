import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/Config.js';
import '../../../../config/Association.yaml.js';
import '../../../../config/help.yaml.js';
import '../../../../config/help2.yaml.js';
import '../../../../config/set.yaml.js';
import '../../../../config/shituhelp.yaml.js';
import '../../../../config/task.yaml.js';
import '../../../../config/xiuxian.yaml.js';
import data from '../../../../model/XiuxianData.js';
import '@alemonjs/db';
import '../../../../model/xiuxian_impl.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { notUndAndNull } from '../../../../model/common.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
import 'dayjs';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/img/user_state.png.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/equipment.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/styles/najie.scss.js';
import '../../../../resources/styles/ningmenghome.scss.js';
import '../../../../resources/styles/player.scss.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/img/valuables-top.jpg.js';
import '../../../../resources/img/valuables-danyao.jpg.js';
import 'fs';
import 'crypto';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?喂给仙宠.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    const player = await data.getData('player', usr_qq);
    if (player.仙宠 == '') {
        Send(Text('你没有仙宠'));
        return false;
    }
    const thing = e.MessageText.replace(/^(#|＃|\/)?喂给仙宠/, '');
    const code = thing.split('*');
    const thing_name = code[0];
    const thing_value = await convert2integer(code[1]);
    const ifexist = data.xianchonkouliang.find(item => item.name == thing_name);
    if (!notUndAndNull(ifexist)) {
        Send(Text('此乃凡物,仙宠不吃' + thing_name));
        return false;
    }
    if (player.仙宠.等级 == player.仙宠.等级上限 && player.仙宠.品级 != '仙灵') {
        Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'));
        return false;
    }
    if (player.仙宠.品级 == '仙灵' && player.仙宠.等级 == player.仙宠.等级上限) {
        Send(Text('您的仙宠已达到天赋极限'));
        return false;
    }
    const thing_quantity = await existNajieThing(usr_qq, thing_name, '仙宠口粮');
    if (thing_quantity < thing_value || !thing_quantity) {
        Send(Text(`【${thing_name}】数量不足`));
        return false;
    }
    await addNajieThing(usr_qq, thing_name, '仙宠口粮', -thing_value);
    let jiachen = ifexist.level * thing_value;
    if (jiachen > player.仙宠.等级上限 - player.仙宠.等级) {
        jiachen = player.仙宠.等级上限 - player.仙宠.等级;
    }
    player.仙宠.加成 += jiachen * player.仙宠.每级增加;
    if (player.仙宠.type == '修炼') {
        player.修炼效率提升 += jiachen * player.仙宠.每级增加;
    }
    if (player.仙宠.type == '幸运') {
        player.幸运 += jiachen * player.仙宠.每级增加;
    }
    if (player.仙宠.等级上限 > player.仙宠.等级 + jiachen) {
        player.仙宠.等级 += jiachen;
    }
    else {
        if (player.仙宠.品级 == '仙灵') {
            Send(Text('您的仙宠已达到天赋极限'));
        }
        else {
            Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'));
        }
        player.仙宠.等级 = player.仙宠.等级上限;
    }
    await data.setData('player', usr_qq, player);
    Send(Text(`喂养成功，仙宠的等级增加了${jiachen},当前为${player.仙宠.等级}`));
});

export { res as default, regular };
