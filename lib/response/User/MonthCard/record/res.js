import '../../../../model/api.js';
import { keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import '../../../../model/DataList.js';
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
import 'dayjs';
import 'buffer';
import '@alemonjs/db';
import { useMessage, format, Text } from 'alemonjs';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?兑换记录(?=$|\s)/;
const res = onResponse(selects, async (e) => {
    const [message] = useMessage(e);
    const PAGE_SIZE = 5;
    const afterCmd = e.MessageText.replace(/^(#|＃|\/)?兑换记录\s*/, '');
    const pageText = afterCmd.trim();
    let page = 1;
    if (pageText !== '') {
        const n = Number(pageText);
        if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
            await message.send(format(Text('页码需为正整数')));
            return;
        }
        page = n;
    }
    const key = keys.exchange('MonthMarket');
    const raw = await getDataJSONParseByKey(key);
    const list = Array.isArray(raw) ? raw : [];
    const mine = list.filter(r => String(r.qq) === e.UserId).sort((a, b) => Number(b.now_time || 0) - Number(a.now_time || 0));
    if (mine.length === 0) {
        await message.send(format(Text('暂无兑换记录')));
        return;
    }
    const totalPages = Math.max(1, Math.ceil(mine.length / PAGE_SIZE));
    if (page > totalPages) {
        await message.send(format(Text(`页码超出范围，最大${totalPages}页`)));
        return;
    }
    const start = (page - 1) * PAGE_SIZE;
    const items = mine.slice(start, start + PAGE_SIZE);
    const lines = items.map((r, i) => {
        const name = r.thing && r.thing.name ? String(r.thing.name) : '未知物品';
        const amount = Number(r.amount ?? r.thing?.数量 ?? 0) || 0;
        const price = Number(r.price ?? r.thing?.出售价 ?? 0) || 0;
        const total = price * amount;
        const time = r.now_time ? new Date(r.now_time).toLocaleString('zh-CN', { hour12: false }) : '未知时间';
        return `${start + i + 1}. ${time} 物品：[${name}] x${amount}，单价：${price}，合计：${total}`;
    });
    const header = `最近${lines.length}条仙缘兑换记录（第${page}/${totalPages}页）：`;
    await message.send(format(Text([header, ...lines].join('\n'))));
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
