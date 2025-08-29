import { useSend, Text } from 'alemonjs';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { convert2integer } from '../../../../model/utils/number.js';
import '../../../../model/api.js';
import { notUndAndNull } from '../../../../model/common.js';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
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
import '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?喂给仙宠.*$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player.仙宠) {
        void Send(Text('你没有仙宠'));
        return false;
    }
    const thing = e.MessageText.replace(/^(#|＃|\/)?喂给仙宠/, '');
    const code = thing.split('*');
    const thingName = code[0];
    const thingValue = convert2integer(code[1]);
    const xianchonkouliangData = await getDataList('Xianchonkouliang');
    const ifexist = xianchonkouliangData.find(item => item.name === thingName);
    if (!notUndAndNull(ifexist)) {
        void Send(Text('此乃凡物,仙宠不吃' + thingName));
        return false;
    }
    if (!player.仙宠.等级上限) {
        const list = ['Xianchon', 'Changzhuxianchon'];
        for (const item of list) {
            const i = (await getDataList(item)).find(x => x.name === player.仙宠.name);
            if (i) {
                player.仙宠.等级上限 = i.等级上限;
                break;
            }
        }
        if (!notUndAndNull(player.仙宠.等级上限)) {
            void Send(Text('存档出错，请联系管理员'));
            return false;
        }
    }
    if (player.仙宠.等级 === player.仙宠.等级上限 && player.仙宠.品级 !== '仙灵') {
        void Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'));
        return false;
    }
    if (player.仙宠.品级 === '仙灵' && player.仙宠.等级 === player.仙宠.等级上限) {
        void Send(Text('您的仙宠已达到天赋极限'));
        return false;
    }
    const thingQuantity = (await existNajieThing(userId, thingName, '仙宠口粮')) || 0;
    if (thingQuantity < thingValue || !thingQuantity) {
        void Send(Text(`【${thingName}】数量不足`));
        return false;
    }
    await addNajieThing(userId, thingName, '仙宠口粮', -thingValue);
    let jiachen = +ifexist.level * thingValue;
    if (jiachen > player.仙宠.等级上限 - player.仙宠.等级) {
        jiachen = player.仙宠.等级上限 - player.仙宠.等级;
    }
    player.仙宠.加成 += jiachen * player.仙宠.每级增加;
    if (player.仙宠.type === '修炼') {
        player.修炼效率提升 += jiachen * player.仙宠.每级增加;
    }
    if (player.仙宠.type === '幸运') {
        player.幸运 += jiachen * player.仙宠.每级增加;
    }
    if (player.仙宠.等级上限 > player.仙宠.等级 + jiachen) {
        player.仙宠.等级 += jiachen;
    }
    else {
        if (player.仙宠.品级 === '仙灵') {
            void Send(Text('您的仙宠已达到天赋极限'));
        }
        else {
            void Send(Text('等级.已达到上限,请主人尽快为仙宠突破品级'));
        }
        player.仙宠.等级 = player.仙宠.等级上限;
    }
    await writePlayer(userId, player);
    void Send(Text(`喂养成功，仙宠的等级增加了${jiachen},当前为${player.仙宠.等级}`));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
