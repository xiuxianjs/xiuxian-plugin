import { useSend, Text } from 'alemonjs';
import { keysByPath, __PATH } from '../../../../model/keys.js';
import '@alemonjs/db';
import '../../../../model/settions.js';
import '../../../../model/DataList.js';
import '../../../../model/xiuxian_impl.js';
import { addCoin, addExp, addExp2 } from '../../../../model/economy.js';
import { addNajieThing } from '../../../../model/najie.js';
import { foundthing } from '../../../../model/cultivation.js';
import '../../../../model/api.js';
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
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?全体发.+$/;
const QUALITY_MAP = {
    劣: 0,
    普: 1,
    优: 2,
    精: 3,
    极: 4,
    绝: 5,
    顶: 6
};
const MAX_AMOUNT = 1_000_000_000;
function toInt(v, d = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.trunc(n) : d;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return false;
    }
    const playerList = await keysByPath(__PATH.player_path);
    const playerCount = playerList.length;
    if (playerCount === 0) {
        Send(Text('暂无玩家存档，发放取消'));
        return false;
    }
    const body = e.MessageText.replace(/^(#|＃|\/)?全体发/, '').trim();
    if (!body) {
        Send(Text('格式: 全体发灵石*数量 / 全体发物品名*数量 / 全体发装备名*品质*数量'));
        return false;
    }
    const seg = body
        .split('*')
        .map(s => s.trim())
        .filter(Boolean);
    if (seg.length === 0) {
        Send(Text('指令解析失败'));
        return false;
    }
    const name = seg[0];
    const isResource = name === '灵石' || name === '修为' || name === '血气';
    if (isResource) {
        if (seg.length < 2) {
            Send(Text('请填写发放数量'));
            return false;
        }
        let amt = toInt(seg[1], 0);
        if (amt <= 0) {
            Send(Text('数量需为正整数'));
            return false;
        }
        if (amt > MAX_AMOUNT) {
            amt = MAX_AMOUNT;
        }
        for (const qq of playerList) {
            if (name === '灵石') {
                await addCoin(qq, amt);
            }
            else if (name === '修为') {
                await addExp(qq, amt);
            }
            else {
                await addExp2(qq, amt);
            }
        }
        Send(Text(`发放成功，共${playerCount}人，每人增加 ${name} x ${amt}`));
        return false;
    }
    const itemMeta = await foundthing(name);
    if (!itemMeta) {
        Send(Text(`这方世界没有[${name}]`));
        return false;
    }
    let quality = 0;
    let amount = 1;
    if (itemMeta.class === '装备') {
        if (seg.length === 1) ;
        else if (seg.length === 2) {
            if (QUALITY_MAP[seg[1]] !== undefined) {
                quality = QUALITY_MAP[seg[1]];
            }
            else {
                amount = toInt(seg[1], 1);
            }
        }
        else {
            if (QUALITY_MAP[seg[1]] !== undefined) {
                quality = QUALITY_MAP[seg[1]];
            }
            amount = toInt(seg[2], 1);
        }
    }
    else {
        if (seg.length >= 2) {
            amount = toInt(seg[1], 1);
        }
    }
    if (!Number.isFinite(amount) || amount <= 0) {
        amount = 1;
    }
    if (amount > MAX_AMOUNT) {
        amount = MAX_AMOUNT;
    }
    if (!Number.isFinite(quality) || quality < 0) {
        quality = 0;
    }
    for (const qq of playerList) {
        await addNajieThing(qq, name, itemMeta.class, amount, itemMeta.class === '装备' ? quality : undefined);
    }
    Send(Text(`发放成功, 当前${playerCount}人, 每人增加 ${name}${itemMeta.class === '装备' ? `(品质${quality})` : ''} x ${amount}`));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
