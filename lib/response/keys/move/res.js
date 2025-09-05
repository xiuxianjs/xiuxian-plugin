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
import '../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';
import mw, { selects } from '../../mw.js';

const regular = /^(#|＃|\/)?移除快捷/;
const res = onResponse(selects, async (e) => {
    const player = await getDataJSONParseByKey(keys.player(e.UserId));
    if (!player) {
        return;
    }
    const [message] = useMessage(e);
    const shortcuts = await getDataJSONParseByKey(keys.shortcut(e.UserId));
    if (!Array.isArray(shortcuts) || shortcuts.length === 0) {
        void message.send(format(Text('您还没有设置任何快捷指令')));
        return;
    }
    const inputText = e.MessageText.replace(regular, '').trim();
    if (!inputText) {
        void message.send(format(Text('请输入要移除的快捷指令编号，例如：移除快捷1')));
        return;
    }
    const index = parseInt(inputText);
    if (isNaN(index) || index < 1 || index > shortcuts.length) {
        void message.send(format(Text(`快捷指令编号无效，请输入1-${shortcuts.length}之间的数字`)));
        return;
    }
    const removedShortcut = shortcuts.splice(index - 1, 1)[0];
    await setDataJSONStringifyByKey(keys.shortcut(e.UserId), shortcuts);
    const removedText = Array.isArray(removedShortcut) ? removedShortcut.join('，') : removedShortcut;
    void message.send(format(Text(`快捷指令移除成功！已移除：${removedText}`)));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
