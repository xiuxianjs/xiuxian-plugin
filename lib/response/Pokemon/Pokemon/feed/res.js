import { useSend, Text } from 'alemonjs';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import { getDataList } from '../../../../model/DataList.js';
import { existplayer, readPlayer } from '../../../../model/xiuxian_impl.js';
import { notUndAndNull } from '../../../../model/common.js';
import { convert2integer } from '../../../../model/utils/number.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/settions.js';
import '../../../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../../resources/img/fairyrealm.jpg.js';
import '../../../../resources/img/card.jpg.js';
import '../../../../resources/img/road.jpg.js';
import '../../../../resources/img/user_state2.png.js';
import '../../../../resources/html/help.js';
import '../../../../resources/img/najie.jpg.js';
import '../../../../resources/img/shituhelp.jpg.js';
import '../../../../resources/img/icon.png.js';
import '../../../../resources/styles/temp.scss.js';
import 'fs';
import 'crypto';
import '../../../../route/core/auth.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?喂给仙宠.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const player = await readPlayer(usr_qq);
    if (player.仙宠 == '') {
        Send(Text('你没有仙宠'));
        return false;
    }
    const thing = e.MessageText.replace(/^(#|＃|\/)?喂给仙宠/, '');
    const code = thing.split('*');
    const thing_name = code[0];
    const thing_value = await convert2integer(code[1]);
    const xianchonkouliangData = await getDataList('Xianchonkouliang');
    const ifexist = xianchonkouliangData.find(item => item.name == thing_name);
    if (!notUndAndNull(ifexist)) {
        Send(Text('此乃凡物,仙宠不吃' + thing_name));
        return false;
    }
    if (!player.仙宠.等级上限) {
        const list = ['Xianchon', 'Changzhuxianchon'];
        for (const item of list) {
            const i = (await getDataList(item)).find(x => x.name == player.仙宠.name);
            if (i) {
                player.仙宠.等级上限 = i.等级上限;
                break;
            }
        }
        if (!notUndAndNull(player.仙宠.等级上限)) {
            Send(Text('存档出错，请联系管理员'));
            return false;
        }
    }
    if (player.仙宠.等级 == player.仙宠.等级上限 && player.仙宠.品级 != '仙灵') {
        Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'));
        return false;
    }
    if (player.仙宠.品级 == '仙灵' && player.仙宠.等级 == player.仙宠.等级上限) {
        Send(Text('您的仙宠已达到天赋极限'));
        return false;
    }
    const thing_quantity = (await existNajieThing(usr_qq, thing_name, '仙宠口粮')) || 0;
    if (thing_quantity < thing_value || !thing_quantity) {
        Send(Text(`【${thing_name}】数量不足`));
        return false;
    }
    await addNajieThing(usr_qq, thing_name, '仙宠口粮', -thing_value);
    let jiachen = +ifexist.level * thing_value;
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
    await writePlayer(usr_qq, player);
    Send(Text(`喂养成功，仙宠的等级增加了${jiachen},当前为${player.仙宠.等级}`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
