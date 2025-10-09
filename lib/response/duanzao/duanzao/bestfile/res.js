import { useSend, Text, Image } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import mw, { selects } from '../../../mw-captcha.js';
import { getDataJSONParseByKey } from '../../../../model/DataControl.js';
import { keysByPath, __PATH, keys } from '../../../../model/keys.js';
import '../../../../model/DataList.js';
import { screenshot } from '../../../../image/index.js';
import '@alemonjs/db';
import 'dayjs';
import { readEquipment } from '../../../../model/equipment.js';
import { existplayer, readNajie, writeIt } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import { readItTyped } from '../../../../model/duanzaofu.js';
import 'lodash-es';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?神兵榜$/;
function calcScore(r) {
    return Math.trunc((r.atk * 1.2 + r.def * 1.5 + r.HP * 1.5) * 10000);
}
function getSectDisplay(p) {
    if (!p?.宗门) {
        return '无门无派';
    }
    if (typeof p.宗门 === 'string') {
        return p.宗门 || '无门无派';
    }
    return p.宗门.宗门名称 || '无门无派';
}
const CACHE_KEY_TIME = 'xiuxian:bestfileCD';
const CACHE_KEY_LIST = 'xiuxian:bestfileList';
const CACHE_EXPIRE_MS = 30 * 60 * 1000;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplayA = await existplayer(userId);
    if (!ifexistplayA) {
        return false;
    }
    const now = Date.now();
    const lastTsRaw = await redis.get(CACHE_KEY_TIME);
    const lastTs = lastTsRaw ? Number(lastTsRaw) : 0;
    let needRebuild = !lastTs || now - lastTs > CACHE_EXPIRE_MS;
    const wupin = (await readItTyped()) ?? [];
    let result = [];
    if (needRebuild) {
        await redis.set(CACHE_KEY_TIME, String(now));
        const all = await keysByPath(__PATH.player_path);
        const playerCache = new Map();
        async function getPlayer(qq) {
            if (playerCache.has(qq)) {
                return playerCache.get(qq) ?? null;
            }
            try {
                const p = await getDataJSONParseByKey(keys.player(qq));
                if (p && typeof p === 'object' && !Array.isArray(p)) {
                    playerCache.set(qq, p);
                    return p;
                }
            }
            catch {
                playerCache.set(qq, null);
                return null;
            }
            playerCache.set(qq, null);
            return null;
        }
        const equipTypes = ['武器', '护具', '法宝'];
        for (const [idx, rec] of wupin.entries()) {
            for (const qq of all) {
                const najie = await readNajie(qq);
                const equ = (await readEquipment(qq));
                if (!najie || !equ) {
                    continue;
                }
                let found = najie.装备.find(it => it.name === rec.name);
                if (!found) {
                    for (const t of equipTypes) {
                        const slot = equ[t];
                        if (slot && slot.name === rec.name) {
                            found = slot;
                            break;
                        }
                    }
                }
                if (!found) {
                    continue;
                }
                wupin[idx].owner_name = qq;
                let authorName = '神秘匠师';
                if (rec.author_name) {
                    const authorP = await getPlayer(rec.author_name);
                    if (authorP) {
                        authorName = authorP.名号;
                    }
                }
                const ownerP = await getPlayer(qq);
                const ownerDisplay = `${ownerP?.名号 || qq}(${getSectDisplay(ownerP)})`;
                result.push({
                    name: rec.name,
                    type: rec.type,
                    评分: calcScore(rec),
                    制作者: authorName,
                    使用者: ownerDisplay
                });
                break;
            }
        }
        const plain = wupin.map(r => ({ ...r }));
        await writeIt(plain);
        await redis.set(CACHE_KEY_LIST, JSON.stringify(result));
    }
    else {
        const cachedList = await redis.get(CACHE_KEY_LIST);
        if (cachedList) {
            try {
                result = JSON.parse(cachedList);
            }
            catch {
                result = [];
            }
        }
        if (result.length === 0) {
            needRebuild = true;
            await redis.del(CACHE_KEY_TIME);
            void Send(Text('数据缓存缺失，稍后再试'));
            return false;
        }
    }
    result.sort((a, b) => b.评分 - a.评分);
    if (result.length > 20) {
        if (result[0].评分 === result[20].评分) {
            const offset = Math.floor(Math.random() * (result.length - 20));
            result = result.slice(offset, offset + 20);
        }
        else {
            result = result.slice(0, 20);
        }
    }
    const tu = await screenshot('shenbing', e.UserId, { newwupin: result });
    if (Buffer.isBuffer(tu)) {
        void Send(Image(tu));
    }
    else {
        void Send(Text('图片生成失败'));
    }
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
