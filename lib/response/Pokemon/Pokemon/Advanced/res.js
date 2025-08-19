import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import { writePlayer } from '../../../../model/pub.js';
import '../../../../model/DataList.js';
import data from '../../../../model/XiuxianData.js';
import '../../../../model/repository/playerRepository.js';
import '../../../../model/repository/najieRepository.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/settions.js';
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
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?进阶仙宠$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await data.existData('player', usr_qq);
    if (!ifexistplay)
        return false;
    const player = await data.getData('player', usr_qq);
    const list = ['仙胎', '仙仔', '仙兽', '仙道', '仙灵'];
    const list_level = [20, 40, 60, 80, 100];
    const currentIndex = list.findIndex(l => l == player.仙宠.品级);
    if (currentIndex === -1) {
        Send(Text('你没有仙宠'));
        return false;
    }
    if (currentIndex === list.length - 1) {
        Send(Text('[' + player.仙宠.name + ']已达到最高品级'));
        return false;
    }
    const number_n = currentIndex + 1;
    const name = number_n + '级仙石';
    const quantity = await existNajieThing(usr_qq, name, '道具');
    if (!quantity) {
        Send(Text(`你没有[${name}]`));
        return false;
    }
    const player_level = player.仙宠.等级;
    const last_jiachen = player.仙宠.加成;
    if (player_level == list_level[currentIndex]) {
        const thing = data.xianchon.find(item => item.id == player.仙宠.id + 1);
        logger.info(thing);
        player.仙宠 = thing;
        player.仙宠.等级 = player_level;
        player.仙宠.加成 = last_jiachen;
        await addNajieThing(usr_qq, name, '道具', -1);
        await writePlayer(usr_qq, player);
        Send(Text('恭喜进阶【' + player.仙宠.name + '】成功'));
    }
    else {
        const need = Number(list_level[currentIndex]) - Number(player_level);
        Send(Text('仙宠的灵泉集韵不足,还需要【' + need + '】级方可进阶'));
        return false;
    }
});

export { res as default, regular };
