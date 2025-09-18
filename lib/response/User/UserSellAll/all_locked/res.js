import { useSend, Text } from 'alemonjs';
import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer, writeNajie } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../resources/img/state.jpg.js';
import '../../../../resources/styles/tw.scss.js';
import '../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../resources/img/player.jpg.js';
import '../../../../resources/img/player_footer.png.js';
import '../../../../resources/img/user_state.png.js';
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
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?一键锁定(.*)$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const najie = await getDataJSONParseByKey(keys.najie(userId));
    if (!najie) {
        return;
    }
    let wupin = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
    const wupin1 = [];
    if (e.MessageText !== '#一键锁定') {
        let thing = e.MessageText.replace(/^(#|＃|\/)?一键锁定/, '');
        for (const i of wupin) {
            if (thing === i) {
                wupin1.push(i);
                thing = thing.replace(i, '');
            }
        }
        if (thing.length === 0) {
            wupin = wupin1;
        }
        else {
            return false;
        }
    }
    for (const i of wupin) {
        const list = najie[i];
        if (!Array.isArray(list)) {
            continue;
        }
        for (const l of najie[i]) {
            l.islockd = 1;
        }
    }
    await writeNajie(userId, najie);
    void Send(Text('一键锁定完成'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
