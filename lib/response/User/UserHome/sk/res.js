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
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { addPet } from '../../../../model/pets.js';
import { existNajieThing, addNajieThing } from '../../../../model/najie.js';
import { sleep } from '../../../../model/common.js';
import '../../../../model/equipment.js';
import '../../../../model/shop.js';
import '../../../../model/trade.js';
import '../../../../model/qinmidu.js';
import '../../../../model/shitu.js';
import '../../../../model/danyao.js';
import '../../../../model/temp.js';
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
