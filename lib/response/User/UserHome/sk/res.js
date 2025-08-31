import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import { sleep } from '../../../../model/common.js';
import { existplayer } from '../../../../model/xiuxiandata.js';
import { getDataList } from '../../../../model/DataList.js';
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
import 'svg-captcha';
import 'sharp';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import { addPet } from '../../../../model/pets.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?抽(天地卡池|灵界卡池|凡界卡池)$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    let tianluoRandom;
    let thing = e.MessageText.replace(/^(#|＃|\/)?/, '');
    thing = thing.replace('抽', '');
    if (thing === '天地卡池') {
        const x = await existNajieThing(userId, '天罗地网', '道具');
        if (!x) {
            void Send(Text('你没有【天罗地网】'));
            return false;
        }
        await addNajieThing(userId, '天罗地网', '道具', -1);
    }
    else if (thing === '灵界卡池') {
        const x = await existNajieThing(userId, '金丝仙网', '道具');
        if (!x) {
            void Send(Text('你没有【金丝仙网】'));
            return false;
        }
        await addNajieThing(userId, '金丝仙网', '道具', -1);
    }
    else if (thing === '凡界卡池') {
        const x = await existNajieThing(userId, '银丝仙网', '道具');
        if (!x) {
            void Send(Text('你没有【银丝仙网】'));
            return false;
        }
        await addNajieThing(userId, '银丝仙网', '道具', -1);
    }
    const changzhuxianchonData = await getDataList('Changzhuxianchon');
    tianluoRandom = Math.floor(Math.random() * changzhuxianchonData.length);
    tianluoRandom = (Math.ceil((tianluoRandom + 1) / 5) - 1) * 5;
    void Send(Text('一道金光从天而降'));
    await sleep(5000);
    void Send(Text('金光掉落在地上，走近一看是【' + changzhuxianchonData[tianluoRandom].品级 + '】' + changzhuxianchonData[tianluoRandom].name));
    await addPet(userId, changzhuxianchonData[tianluoRandom].name, 1);
    void Send(Text('恭喜获得' + changzhuxianchonData[tianluoRandom].name));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
