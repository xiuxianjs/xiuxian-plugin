import { useSend, Text, useSubscribe, useMessage } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey, keys } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey, delDataByKey } from '../../../../model/DataControl.js';
import '@alemonjs/db';
import { getConfig } from '../../../../model/Config.js';
import { Go, notUndAndNull, getRandomFromARR } from '../../../../model/common.js';
import { existplayer, readPlayer, readNajie, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import '../../../../model/settions.js';
import 'dayjs';
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

const regular = /^(#|＃|\/)?再入仙途$/;
function isPlayerGuildRef(v) {
    return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}
function isExtAss(v) {
    return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v;
}
function parseNum(v, def = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
}
function removeFromRole(ass, role, qq) {
    const list = ass[role];
    if (Array.isArray(list)) {
        ass[role] = list.filter(v => v !== qq);
    }
}
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const rebornKey = getRedisKey(userId, 'reCreate_acount');
    let acountRaw = await redis.get(rebornKey);
    if (!acountRaw) {
        await redis.set(rebornKey, '1');
        acountRaw = '1';
    }
    let acount = parseNum(acountRaw, 1);
    if (acount <= 0) {
        acount = 1;
        await redis.set(rebornKey, '1');
    }
    const player = await readPlayer(userId);
    if (!player) {
        void Send(Text('玩家数据异常'));
        return false;
    }
    if (parseNum(player.灵石) <= 0) {
        void Send(Text('负债无法再入仙途'));
        return false;
    }
    if (!(await Go(e))) {
        return false;
    }
    const najie = await readNajie(userId);
    if (!najie?.道具?.some(item => item.name === '转世卡')) {
        void Send(Text('您没有转世卡'));
        return false;
    }
    await addNajieThing(userId, '转世卡', '道具', -1);
    const nowTime = Date.now();
    const lastKey = getRedisKey(userId, 'last_reCreate_time');
    const lastRestartRaw = await redis.get(lastKey);
    const lastRestart = parseNum(lastRestartRaw);
    const cf = (await getConfig('xiuxian', 'xiuxian'));
    const rebornMin = cf?.CD?.reborn ?? 60;
    const rebornTime = rebornMin * 60000;
    if (nowTime < lastRestart + rebornTime) {
        const remain = lastRestart + rebornTime - nowTime;
        const m = Math.trunc(remain / 60000);
        const s = Math.trunc((remain % 60000) / 1000);
        void Send(Text(`每${rebornTime / 60000}分钟只能转世一次 剩余cd:${m}分 ${s}秒`));
        return false;
    }
    void Send(Text('一旦转世一切当世与你无缘,你真的要重生吗?回复:【断绝此生】或者【再继仙缘】进行选择'));
    const [subscribe] = useSubscribe(e, selects);
    const sub = subscribe.mount(async (event, next) => {
        const [message] = useMessage(event);
        const choice = event.MessageText.trim();
        if (choice === '再继仙缘') {
            void message.send([Text('重拾道心,继续修行')]);
            clearTimeout(timeout);
            return;
        }
        if (choice !== '断绝此生') {
            void message.send([Text('请回复:【断绝此生】或者【再继仙缘】进行选择')]);
            next();
            return;
        }
        clearTimeout(timeout);
        const acountValRaw = await redis.get(rebornKey);
        let acountVal = parseNum(acountValRaw, 1);
        if (acountVal >= 15) {
            void message.send([Text('灵魂虚弱，已不可转世！')]);
            return;
        }
        acountVal += 1;
        const playerNow = await readPlayer(userId);
        if (playerNow && notUndAndNull(playerNow.宗门) && isPlayerGuildRef(playerNow.宗门)) {
            const assRaw = await getDataJSONParseByKey(keys.association(playerNow.宗门.宗门名称));
            if (assRaw !== 'error' && isExtAss(assRaw)) {
                const ass = assRaw;
                if (playerNow.宗门.职位 !== '宗主') {
                    removeFromRole(ass, playerNow.宗门.职位, userId);
                    ass.所有成员 = (ass.所有成员 || []).filter(q => q !== userId);
                    if ('宗门' in playerNow) {
                        delete playerNow.宗门;
                    }
                    await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
                    await writePlayer(userId, playerNow);
                }
                else {
                    if ((ass.所有成员 || []).length < 2) {
                        try {
                            await delDataByKey(keys.association(ass.宗门名称));
                        }
                        catch {
                        }
                    }
                    else {
                        ass.所有成员 = (ass.所有成员 || []).filter(q => q !== userId);
                        let randmemberId;
                        if ((ass.长老 || []).length > 0) {
                            randmemberId = getRandomFromARR(ass.长老);
                        }
                        else if ((ass.内门弟子 || []).length > 0) {
                            randmemberId = getRandomFromARR(ass.内门弟子);
                        }
                        else {
                            randmemberId = getRandomFromARR(ass.所有成员 || []);
                        }
                        if (randmemberId) {
                            const randmember = await readPlayer(randmemberId);
                            if (randmember?.宗门 && isPlayerGuildRef(randmember.宗门)) {
                                removeFromRole(ass, randmember.宗门.职位, randmemberId);
                                ass.宗主 = randmemberId;
                                randmember.宗门.职位 = '宗主';
                                await writePlayer(randmemberId, randmember);
                                await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);
                            }
                        }
                    }
                }
            }
        }
        await redis.del(getRedisKey(userId, 'last_dajie_time'));
        await redis.set(lastKey, String(Date.now()));
        await redis.set(rebornKey, String(acountVal));
        void message.send([Text('来世，信则有，不信则无，岁月悠悠……')]);
    }, ['UserId']);
    const timeout = setTimeout(() => {
        try {
            subscribe.cancel(sub);
            void Send(Text('超时自动取消操作'));
        }
        catch {
        }
    }, 60 * 1000);
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
