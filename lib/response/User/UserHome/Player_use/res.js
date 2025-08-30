import { useMessage, Text } from 'alemonjs';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { readPlayer, readNajie } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
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
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';
import { parseCommand, validateThing } from './utils.js';
import { handleEquipment } from './equipment.js';
import { handleConsume } from './consume.js';
import { handleDanyao } from './danyao.js';
import { handleStudy } from './study.js';

const regular = /^(#|＃|\/)?(装备|消耗|服用|学习)\s*\S+/;
const res = onResponse(selects, async (e) => {
    const userId = e.UserId;
    const [message] = useMessage(e);
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return;
    }
    const startCode = /装备|消耗|服用|学习/.exec(e.MessageText)?.[0];
    if (!startCode) {
        return;
    }
    const msg = e.MessageText.replace(/^(#|＃|\/)?(装备|消耗|服用|学习)/, '').trim();
    if (!msg) {
        return;
    }
    const parseResult = await parseCommand(msg, startCode, najie);
    if (!parseResult) {
        void message.send(format(Text('装备代号输入有误!')));
        return;
    }
    const { thingName, quantity, pinji, thingExist, thingClass } = parseResult;
    const isValid = await validateThing(userId, thingName, thingClass, pinji, quantity, startCode);
    if (!isValid) {
        void message.send(format(Text(`你没有【${thingName}】这样的【${thingClass}】`)));
        return;
    }
    switch (startCode) {
        case '装备': {
            const success = await handleEquipment(userId, thingName, pinji, najie, e);
            if (!success) {
                void message.send(format(Text(`找不到可装备的 ${thingName}`)));
            }
            break;
        }
        case '服用': {
            if (thingClass !== '丹药') {
                return;
            }
            await handleDanyao(userId, thingName, thingExist, player, quantity, message);
            break;
        }
        case '消耗': {
            await handleConsume(userId, thingName, thingExist, player, quantity, message, e);
            break;
        }
        case '学习': {
            await handleStudy(userId, thingName, message);
            break;
        }
        default: {
            void message.send(format(Text('未知指令类型')));
            break;
        }
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
