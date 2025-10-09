import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey, keysAction, keys, __PATH } from '../../../../model/keys.js';
import { getDataJSONParseByKey, delDataByKey } from '../../../../model/DataControl.js';
import { getDataList } from '../../../../model/DataList.js';
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
import { notUndAndNull, getRandomFromARR } from '../../../../model/common.js';
import { readEquipment, writeEquipment } from '../../../../model/equipment.js';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import { addHP } from '../../../../model/economy.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../model/currency.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?登仙$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const game_action_raw = await redis.get(getRedisKey(userId, 'game_action'));
    const game_action = game_action_raw === null ? 0 : Number(game_action_raw);
    if (game_action === 1) {
        void Send(Text('修仙：游戏进行中...'));
        return false;
    }
    const player = await readPlayer(userId);
    const levelList = await getDataList('Level1');
    const now_level = levelList.find(item => item.level_id === player.level_id)?.level;
    if (now_level !== '渡劫期') {
        void Send(Text('你非渡劫期修士！'));
        return false;
    }
    const actionA = await getDataJSONParseByKey(keysAction.action(userId));
    if (actionA) {
        const action_end_time = actionA.end_time;
        const now_time = Date.now();
        if (now_time <= action_end_time) {
            const m = Math.floor((action_end_time - now_time) / 1000 / 60);
            const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);
            void Send(Text('正在' + actionA.action + '中,剩余时间:' + m + '分' + s + '秒'));
            return false;
        }
    }
    if (player.power_place !== 0) {
        void Send(Text('请先渡劫！'));
        return false;
    }
    let now_level_id;
    if (!notUndAndNull(player.level_id)) {
        void Send(Text('请先#刷新信息'));
        return false;
    }
    now_level_id = levelList.find(item => item.level_id === player.level_id).level_id;
    const now_exp = player.修为;
    const needEXP = levelList.find(item => item.level_id === player.level_id).exp;
    if (now_exp < needEXP) {
        void Send(Text(`修为不足,再积累${needEXP - now_exp}修为后方可成仙！`));
        return false;
    }
    if (player.power_place === 0) {
        void Send(Text('天空一声巨响，一道虚影从眼中浮现，突然身体微微颤抖，似乎感受到了什么，' +
            player.名号 +
            '来不及思索，立即向前飞去！只见万物仰头相望，似乎感觉到了，也似乎没有感觉，殊不知......'));
        now_level_id = now_level_id + 1;
        player.level_id = now_level_id;
        player.修为 -= needEXP;
        await writePlayer(userId, player);
        const equipment = await readEquipment(userId);
        await writeEquipment(userId, equipment);
        await addHP(userId, 99999999);
        if (now_level_id >= 42) {
            const player = await getDataJSONParseByKey(keys.player(userId));
            if (!player) {
                return;
            }
            if (!notUndAndNull(player.宗门)) {
                return false;
            }
            if (player.宗门.职位 !== '宗主') {
                const assData = await redis.get(`${__PATH.association}:${player.宗门.宗门名称}`);
                if (!assData) {
                    return false;
                }
                const ass = JSON.parse(assData);
                if (ass === 'error') {
                    return false;
                }
                const association = ass;
                const pos = player.宗门.职位;
                const curList = association[pos] || [];
                association[pos] = curList.filter(item => item !== userId);
                const allList = association['所有成员'] || [];
                association['所有成员'] = allList.filter(item => item !== userId);
                await redis.set(`${__PATH.association}:${association.宗门名称}`, JSON.stringify(association));
                delete player.宗门;
                await writePlayer(userId, player);
                await playerEfficiency(userId);
                void Send(Text('退出宗门成功'));
            }
            else {
                const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));
                if (!ass) {
                    return;
                }
                const association = ass;
                const allList = association.所有成员 || [];
                if (allList.length < 2) {
                    await delDataByKey(keys.association(player.宗门.宗门名称));
                    delete player.宗门;
                    await writePlayer(userId, player);
                    await playerEfficiency(userId);
                    void Send(Text('一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'));
                }
                else {
                    association['所有成员'] = allList.filter(item => item !== userId);
                    delete player.宗门;
                    await writePlayer(userId, player);
                    await playerEfficiency(userId);
                    let randmemberId;
                    const list_v = association.副宗主 || [];
                    const list_l = association.长老 || [];
                    const list_n = association.内门弟子 || [];
                    if (list_v.length > 0) {
                        randmemberId = getRandomFromARR(list_v);
                    }
                    else if (list_l.length > 0) {
                        randmemberId = getRandomFromARR(list_l);
                    }
                    else if (list_n.length > 0) {
                        randmemberId = getRandomFromARR(list_n);
                    }
                    else {
                        randmemberId = getRandomFromARR(association.所有成员 || []);
                    }
                    const randmember = await readPlayer(randmemberId);
                    const rPos = randmember.宗门.职位;
                    const rList = association[rPos] || [];
                    association[rPos] = rList.filter(item => item !== randmemberId);
                    association['宗主'] = randmemberId;
                    randmember.宗门.职位 = '宗主';
                    await writePlayer(randmemberId, randmember);
                    await writePlayer(userId, player);
                    await redis.set(`${__PATH.association}:${association.宗门名称}`, JSON.stringify(association));
                    void Send(Text(`飞升前,遵循你的嘱托,${randmember.名号}将继承你的衣钵,成为新一任的宗主`));
                }
            }
        }
        return false;
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
