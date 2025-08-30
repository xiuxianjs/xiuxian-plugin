import '../../../model/api.js';
import { keys } from '../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../model/DataControl.js';
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
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../model/message.js';
import mw, { selects } from '../../mw.js';

const regular = /^(#|＃|\/)?快捷帮助/;
const res = onResponse(selects, async (e) => {
    const player = await getDataJSONParseByKey(keys.player(e.UserId));
    if (!player) {
        return;
    }
    const [message] = useMessage(e);
    const shortcuts = await getDataJSONParseByKey(keys.shortcut(e.UserId));
    let helpText = '📋 快捷指令使用说明：\n\n';
    helpText += '🔧 添加快捷指令：\n';
    helpText += '格式：添加快捷 指令1,指令2,指令3\n';
    helpText += '示例：添加快捷 修炼,打坐,炼丹\n\n';
    helpText += '🗑️ 移除快捷指令：\n';
    helpText += '格式：移除快捷 编号\n';
    helpText += '示例：移除快捷1\n\n';
    helpText += '⚡ 使用快捷指令：\n';
    helpText += '格式：快捷+编号\n';
    helpText += '示例：快捷1\n\n';
    helpText += '📊 当前快捷指令列表：\n';
    if (Array.isArray(shortcuts) && shortcuts.length > 0) {
        shortcuts.forEach((shortcut, index) => {
            const shortcutText = Array.isArray(shortcut) ? shortcut.join('，') : shortcut;
            helpText += `${index + 1}. ${shortcutText}\n`;
        });
    }
    else {
        helpText += '暂无快捷指令\n';
    }
    helpText += '\n💡 提示：\n';
    helpText += '- 最多可设置9个快捷指令\n';
    helpText += '- 每个快捷指令最多包含3个命令\n';
    helpText += '- 命令之间用逗号分隔\n';
    helpText += '- 指令按前后顺序执行';
    void message.send(format(Text(helpText)));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
