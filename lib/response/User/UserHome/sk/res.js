import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '@alemonjs/db';
import data from '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/danyao.js';
import { sleep } from '../../../../model/common.js';
import { addPet } from '../../../../model/pets.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/temp.js';
import '../../../../model/settions.js';
import 'dayjs';
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
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?抽(天地卡池|灵界卡池|凡界卡池)$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let tianluoRandom;
    let thing = e.MessageText.replace(/^(#|＃|\/)?/, '');
    thing = thing.replace('抽', '');
    if (thing == '天地卡池') {
        const x = await existNajieThing(usr_qq, '天罗地网', '道具');
        if (!x) {
            Send(Text('你没有【天罗地网】'));
            return false;
        }
        await addNajieThing(usr_qq, '天罗地网', '道具', -1);
    }
    else if (thing == '灵界卡池') {
        const x = await existNajieThing(usr_qq, '金丝仙网', '道具');
        if (!x) {
            Send(Text('你没有【金丝仙网】'));
            return false;
        }
        await addNajieThing(usr_qq, '金丝仙网', '道具', -1);
    }
    else if (thing == '凡界卡池') {
        const x = await existNajieThing(usr_qq, '银丝仙网', '道具');
        if (!x) {
            Send(Text('你没有【银丝仙网】'));
            return false;
        }
        await addNajieThing(usr_qq, '银丝仙网', '道具', -1);
    }
    tianluoRandom = Math.floor(Math.random() * data.changzhuxianchon.length);
    tianluoRandom = (Math.ceil((tianluoRandom + 1) / 5) - 1) * 5;
    Send(Text('一道金光从天而降'));
    await sleep(5000);
    Send(Text('金光掉落在地上，走近一看是【' +
        data.changzhuxianchon[tianluoRandom].品级 +
        '】' +
        data.changzhuxianchon[tianluoRandom].name));
    await addPet(usr_qq, data.changzhuxianchon[tianluoRandom].name, 1);
    Send(Text('恭喜获得' + data.changzhuxianchon[tianluoRandom].name));
});

export { res as default, regular };
