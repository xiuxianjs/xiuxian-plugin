import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { keys, getRedisKey } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import config from '../../../../model/Config.js';
import 'dayjs';
import '../../../../model/DataList.js';
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
import '../../../../resources/html/monthCard.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?拔苗助长.*$/;
function toInt(v, def = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.floor(n) : def;
}
function formatRemain(ms) {
    if (ms <= 0) {
        return '0分0秒';
    }
    const m = Math.trunc(ms / 60000);
    const s = Math.trunc((ms % 60000) / 1000);
    return `${m}分${s}秒`;
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const guildName = player?.宗门?.宗门名称;
    if (!guildName) {
        void Send(Text('您未加入宗门，无法拔苗助长'));
        return false;
    }
    const ass = await getDataJSONParseByKey(keys.association(guildName));
    if (!ass) {
        void Send(Text('宗门不存在, 如有必要可聊系管理员!'));
        return;
    }
    const gardenAny = ass['药园'];
    const garden = gardenAny;
    if (!garden || toInt(garden.药园等级) <= 1) {
        void Send(Text('药园等级太低，可远观不可亵玩焉'));
        return false;
    }
    const cdMinutes = toInt((await config.getConfig('xiuxian', 'xiuxian'))?.CD?.garden);
    const cdMs = cdMinutes * 60000;
    const now = Date.now();
    const lastKey = getRedisKey(userId, 'last_garden_time');
    const lastTime = toInt(await redis.get(lastKey));
    const remain = lastTime + cdMs - now;
    if (cdMs > 0 && remain > 0) {
        void Send(Text(`每${cdMinutes}分钟拔苗一次。cd: ${formatRemain(remain)}`));
        return false;
    }
    const rawName = e.MessageText.replace(/^(#|＃|\/)?拔苗助长/, '').trim();
    if (!rawName) {
        void Send(Text('请输入要拔苗助长的作物名称'));
        return false;
    }
    const crops = Array.isArray(garden.作物) ? garden.作物 : [];
    const targetIndex = crops.findIndex(c => c?.name === rawName);
    if (targetIndex === -1) {
        void Send(Text('您拔错了吧！掣电树chedianshu'));
        await redis.set(lastKey, now);
        return false;
    }
    const crop = crops[targetIndex];
    const ts = toInt(crop.ts, 1);
    const matureKey = `xiuxian:${ass.宗门名称}${rawName}`;
    let matureAt = toInt(await redis.get(matureKey), 0);
    if (matureAt === 0) {
        matureAt = now + 24 * 60 * 60 * 1000 * ts;
        crop.start_time = now;
        await redis.set(matureKey, matureAt);
        await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
    }
    const accelerate = 30 * 60 * 1000;
    if (now + accelerate < matureAt) {
        matureAt -= accelerate;
        await redis.set(matureKey, matureAt);
        await redis.set(lastKey, now);
        const remainAfter = matureAt - now;
        void Send(Text(`作物${rawName}加速成功，减少1800000成熟度，剩余${remainAfter}成熟度`));
        return false;
    }
    void Send(Text(`作物${rawName}已成熟，被${userId}${player?.名号 || ''}摘取, 放入纳戒了`));
    await addNajieThing(userId, rawName, '草药', 1);
    const nextMature = now + 24 * 60 * 60 * 1000 * ts;
    crop.start_time = now;
    await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
    await Promise.all([redis.set(matureKey, nextMature), redis.set(lastKey, now)]);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
