import { useSend, useMention, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { addExp } from '../../../../model/economy.js';
import { findQinmidu, existHunyin, fstaddQinmidu, addQinmidu } from '../../../../model/qinmidu.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import { selects } from '../../../index.js';
import config from '../../../../model/Config.js';

const regular = /^(#|＃|\/)?双修$/;
function toInt(v) {
    const n = Number(v);
    return Number.isFinite(n) ? Math.floor(n) : 0;
}
function formatRemain(ms) {
    if (ms <= 0)
        return '0分 0秒';
    const m = Math.trunc(ms / 60000);
    const s = Math.trunc((ms % 60000) / 1000);
    return `${m}分 ${s}秒`;
}
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const cf = (await config.getConfig('xiuxian', 'xiuxian'));
    if (!cf?.switch?.couple)
        return false;
    const A = e.UserId;
    let B;
    try {
        const mentionApi = useMention(e)[0];
        const result = await mentionApi.find({ IsBot: false });
        const list = result?.data || [];
        const target = list.find(item => !item.IsBot);
        if (target)
            B = target.UserId;
    }
    catch {
    }
    if (!B)
        return false;
    if (A === B) {
        Send(Text('你咋这么爱撸自己呢?'));
        return false;
    }
    if (!(await existplayer(B))) {
        Send(Text('修仙者不可对凡人出手!'));
        return false;
    }
    const cooldownMinutes = toInt(cf?.CD?.couple);
    const cooldownMs = cooldownMinutes * 60000;
    const now = Date.now();
    async function checkAndGetRemain(_userId, key) {
        const lastRaw = await redis.get(key);
        const last = toInt(lastRaw);
        const remain = last + cooldownMs - now;
        return { last, remain };
    }
    const keyA = `xiuxian@1.3.0:${A}:last_shuangxiu_time`;
    const keyB = `xiuxian@1.3.0:${B}:last_shuangxiu_time`;
    if (cooldownMs > 0) {
        const [{ remain: remainA }, { remain: remainB }] = await Promise.all([
            checkAndGetRemain(A, keyA),
            checkAndGetRemain(B, keyB)
        ]);
        if (remainA > 0) {
            Send(Text(`双修冷却:  ${formatRemain(remainA)}`));
            return false;
        }
        if (remainB > 0) {
            Send(Text(`对方双修冷却:  ${formatRemain(remainB)}`));
            return false;
        }
    }
    const coupleFlag = toInt(await redis.get(`xiuxian@1.3.0:${B}:couple`));
    if (coupleFlag !== 0) {
        Send(Text('哎哟，你干嘛...'));
        return false;
    }
    const pd = await findQinmidu(A, B);
    const hunyinOfA = await existHunyin(A);
    const hunyinOfB = await existHunyin(B);
    if (hunyinOfA !== '' || hunyinOfB !== '') {
        if (hunyinOfA !== B || hunyinOfB !== A) {
            Send(Text('力争纯爱！禁止贴贴！！'));
            return false;
        }
    }
    else if (pd === false) {
        await fstaddQinmidu(A, B);
    }
    await Promise.all([redis.set(keyA, now), redis.set(keyB, now)]);
    const scenarios = [
        {
            range: [0, 0.5],
            base: 28000,
            intimacy: 30,
            text: '你们双方情意相通，缠绵一晚，都增加了'
        },
        {
            range: [0.5, 0.6],
            base: 21000,
            intimacy: 20,
            text: '你们双方交心交神，努力修炼，都增加了'
        },
        {
            range: [0.6, 0.7],
            base: 14000,
            intimacy: 15,
            text: '你们双方共同修炼，过程平稳，都增加了'
        },
        {
            range: [0.7, 0.9],
            base: 520,
            intimacy: 10,
            text: '你们双方努力修炼，但是并进不了状态，都增加了'
        }
    ];
    const rand = Math.random();
    const efficiency = Math.random();
    const scenario = scenarios.find(s => rand > s.range[0] && rand <= s.range[1]);
    if (!scenario) {
        Send(Text('你们双修时心神合一，但是不知道哪来的小孩，惊断了状态'));
        return false;
    }
    const gain = Math.trunc(efficiency * scenario.base);
    await Promise.all([
        addExp(A, gain),
        addExp(B, gain),
        addQinmidu(A, B, scenario.intimacy)
    ]);
    Send(Text(`${scenario.text}${gain}修为,亲密度增加了${scenario.intimacy}点`));
    return false;
});

export { res as default, regular };
