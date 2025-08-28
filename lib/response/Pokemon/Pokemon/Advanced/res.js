import { useSend, Text } from 'alemonjs';
import { keys } from '../../../../model/keys.js';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import { getDataList } from '../../../../model/DataList.js';
import '../../../../model/xiuxian_impl.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import { notUndAndNull } from '../../../../model/common.js';
import { petGrade, petLevel } from '../../../../model/pets.js';
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

const regular = /^(#|＃|\/)?进阶仙宠$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return false;
    }
    if (!notUndAndNull(player.仙宠)) {
        void Send(Text('你没有仙宠'));
        return false;
    }
    const currentIndex = petGrade.findIndex(l => l === player.仙宠.品级);
    if (currentIndex === petGrade.length - 1) {
        void Send(Text('[' + player.仙宠.name + ']已达到最高品级'));
        return false;
    }
    const n = currentIndex + 1;
    const name = n + '级仙石';
    const quantity = await existNajieThing(userId, name, '道具');
    if (!quantity) {
        void Send(Text(`你没有[${name}]`));
        return false;
    }
    const playerLevel = player.仙宠.等级;
    const lastJiachen = player.仙宠.加成;
    if (playerLevel === petLevel[currentIndex]) {
        const xianchonData = await getDataList('Xianchon');
        const thing = xianchonData.find(item => item.id === player.仙宠.id + 1);
        if (!thing) {
            void Send(Text('仙宠不存在'));
            return;
        }
        player.仙宠 = thing;
        player.仙宠.等级 = playerLevel;
        player.仙宠.加成 = lastJiachen;
        await addNajieThing(userId, name, '道具', -1);
        await writePlayer(userId, player);
        void Send(Text('恭喜进阶【' + player.仙宠.name + '】成功'));
    }
    else {
        const need = Number(petLevel[currentIndex]) - Number(playerLevel);
        void Send(Text('仙宠的灵泉集韵不足,还需要【' + need + '】级方可进阶'));
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
