import '../../../model/api.js';
import { keys } from '../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../model/DataControl.js';
import '@alemonjs/db';
import { useMessage, Text } from 'alemonjs';
import 'dayjs';
import '../../../model/DataList.js';
import '../../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../resources/img/state.jpg.js';
import '../../../resources/styles/tw.scss.js';
import '../../../resources/font/tttgbnumber.ttf.js';
import '../../../resources/img/player.jpg.js';
import '../../../resources/img/player_footer.png.js';
import '../../../resources/img/user_state.png.js';
import 'classnames';
import '../../../resources/img/fairyrealm.jpg.js';
import '../../../resources/img/card.jpg.js';
import '../../../resources/img/road.jpg.js';
import '../../../resources/img/user_state2.png.js';
import '../../../resources/html/help.js';
import '../../../resources/img/najie.jpg.js';
import '../../../resources/img/shituhelp.jpg.js';
import '../../../resources/img/icon.png.js';
import '../../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import { isUserMonthCard } from '../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';
import mw, { selects } from '../../mw-captcha.js';
import { lengthMax, cmdMax } from '../config.js';

const regular = /^(#|＃|\/)?添加快捷/;
const res = onResponse(selects, async (e) => {
    const player = await getDataJSONParseByKey(keys.player(e.UserId));
    if (!player) {
        return;
    }
    const [message] = useMessage(e);
    const isCardUser = await isUserMonthCard(e.UserId);
    if (!isCardUser) {
        void message.send(format(Text('暂无该权益')));
        return;
    }
    const shortcuts = await getDataJSONParseByKey(keys.shortcut(e.UserId));
    if (Array.isArray(shortcuts) && shortcuts?.length >= lengthMax) {
        void message.send(format(Text('快捷指令已满，无法添加新快捷指令')));
        return;
    }
    const cmds = Array.isArray(shortcuts) ? shortcuts : [];
    const texts = e.MessageText.replace(regular, '')
        .split(/[,，]/)
        .map(v => v.trim())
        .filter(v => !!v);
    if (texts.length < 1 || texts.length > cmdMax) {
        void message.send(format(Text(`指令数量不合法，必须为1-${cmdMax}个`)));
        return;
    }
    if (texts.some(text => /快捷/.test(text))) {
        void message.send(format(Text('非法指令')));
        return;
    }
    cmds.push(texts);
    await setDataJSONStringifyByKey(keys.shortcut(e.UserId), cmds);
    void message.send(format(Text(`快捷指令添加成功:${texts.join('，')}`)));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
