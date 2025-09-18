import '../../model/api.js';
import { keys } from '../../model/keys.js';
import { getDataJSONParseByKey } from '../../model/DataControl.js';
import '@alemonjs/db';
import { useMessage, Text, expendCycle } from 'alemonjs';
import 'dayjs';
import '../../model/DataList.js';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import { isUserMonthCard } from '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';
import mw, { selects } from '../mw-captcha.js';
import _ from 'lodash';

const regular = /^(#|＃|\/)?快捷\d+/;
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
    if (!Array.isArray(shortcuts) || shortcuts.length === 0) {
        void message.send(format(Text('您还没有设置任何快捷指令，请先使用"快捷帮助"查看使用方法')));
        return;
    }
    const match = e.MessageText.match(/^(#|＃|\/)?快捷(\d+)$/);
    if (!match) {
        void message.send(format(Text('快捷指令格式错误，请使用"快捷+编号"的格式，例如：快捷1')));
        return;
    }
    const index = parseInt(match[2]);
    if (index < 1 || index > shortcuts.length) {
        void message.send(format(Text(`快捷指令编号无效，请输入1-${shortcuts.length}之间的数字`)));
        return;
    }
    const texts = shortcuts[index - 1];
    if (!Array.isArray(texts) || texts.length === 0) {
        void message.send(format(Text('该快捷指令为空，请重新设置')));
        return;
    }
    void message.send(format(Text(`开始执行快捷指令： ${texts.join('，')}`)));
    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        setTimeout(() => {
            const event = _.cloneDeep(e);
            event.MessageText = text;
            Object.defineProperty(event, 'value', {
                get() {
                    return e.value;
                }
            });
            void expendCycle(event, e.name);
        }, (i + 1) * 3600);
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
