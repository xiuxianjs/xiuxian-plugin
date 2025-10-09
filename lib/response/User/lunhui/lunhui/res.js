import { useSend, Text } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey, keys, __PATH } from '../../../../model/keys.js';
import { getIoRedis } from '@alemonjs/db';
import { getDataJSONParseByKey, setDataJSONStringifyByKey, delDataByKey } from '../../../../model/DataControl.js';
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
import { notUndAndNull, getRandomFromARR } from '../../../../model/common.js';
import { readEquipment, writeEquipment } from '../../../../model/equipment.js';
import { existplayer, readPlayer, writePlayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import { addHP } from '../../../../model/economy.js';
import 'svg-captcha';
import 'sharp';
import { addNajieThing } from '../../../../model/najie.js';
import '../../../../model/currency.js';
import { playerEfficiency } from '../../../../model/xiuxian_m.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?轮回$/;
const REBIRTH_MAP = {
    1: {
        name: '一转轮回体',
        eff: 0.3,
        ratio: 0.2,
        gongfa: '一转轮回',
        msg: '一转轮回！'
    },
    2: {
        name: '二转轮回体',
        eff: 0.35,
        ratio: 0.23,
        gongfa: '二转轮回',
        msg: '二转轮回！'
    },
    3: {
        name: '三转轮回体',
        eff: 0.4,
        ratio: 0.26,
        gongfa: '三转轮回',
        msg: '三转轮回！'
    },
    4: {
        name: '四转轮回体',
        eff: 0.45,
        ratio: 0.3,
        gongfa: '四转轮回',
        msg: '四转轮回！'
    },
    5: {
        name: '五转轮回体',
        eff: 0.5,
        ratio: 0.33,
        gongfa: '五转轮回',
        msg: '五转轮回！'
    },
    6: {
        name: '六转轮回体',
        eff: 0.55,
        ratio: 0.36,
        gongfa: '六转轮回',
        msg: '六转轮回！'
    },
    7: {
        name: '七转轮回体',
        eff: 0.6,
        ratio: 0.39,
        gongfa: '七转轮回',
        msg: '七转轮回！'
    },
    8: {
        name: '八转轮回体',
        eff: 0.65,
        ratio: 0.42,
        gongfa: '八转轮回',
        msg: '八转轮回！'
    },
    9: {
        name: '九转轮回体',
        eff: 1,
        ratio: 1,
        gongfa: '九转轮回',
        msg: '九转轮回！已能成帝！'
    }
};
const KEY_LH = (id) => getRedisKey(id, 'lunhui');
function buildTalent(cfg) {
    return { name: cfg.name, type: '转生', eff: cfg.eff, 法球倍率: cfg.ratio };
}
async function applyRebirthCommon(userId, player) {
    player.level_id = 9;
    player.power_place = 1;
    await writePlayer(userId, player);
    const eq = await readEquipment(userId);
    if (eq) {
        await writeEquipment(userId, eq);
    }
    await addHP(userId, 99_999_999);
    const lunhuiBH = numVal(player.lunhuiBH, 0);
    if (lunhuiBH === 0) {
        player.Physique_id = Math.ceil(player.Physique_id / 2);
        player.修为 = 0;
        player.血气 = 0;
    }
    else if (lunhuiBH === 1) {
        player.修为 = Math.max(0, numVal(player.修为) - 10_000_000);
        player.血气 = Math.max(0, numVal(player.血气) - 10_000_000);
        setNum(player, 'lunhuiBH', 0);
    }
    await writePlayer(userId, player);
}
function isAssociation(obj) {
    return !!obj && typeof obj === 'object' && '宗门名称' in obj;
}
async function exitAssociationIfNeed(userId, player, Send) {
    if (!notUndAndNull(player.宗门)) {
        return;
    }
    const guild = player.宗门;
    if (!guild || typeof guild !== 'object' || !('宗门名称' in guild)) {
        return;
    }
    const assPower = await getDataJSONParseByKey(keys.association(guild.宗门名称));
    if (!assPower) {
        return;
    }
    if (!isAssociation(assPower) || !assPower.power) {
        return;
    }
    void Send(Text('轮回后降临凡界，仙宗命牌失效！'));
    if (guild.职位 !== '宗主') {
        const ass2Raw = await getDataJSONParseByKey(keys.association(guild.宗门名称));
        if (!ass2Raw) {
            return;
        }
        if (isAssociation(ass2Raw)) {
            const ass2 = ass2Raw;
            if (Array.isArray(ass2[guild.职位])) {
                ass2[guild.职位] = ass2[guild.职位].filter(q => q !== userId);
            }
            if (Array.isArray(ass2['所有成员'])) {
                ass2['所有成员'] = ass2['所有成员'].filter(q => q !== userId);
            }
            await setDataJSONStringifyByKey(keys.association(guild.宗门名称), ass2Raw);
        }
        delete player.宗门;
        await writePlayer(userId, player);
        await playerEfficiency(userId);
        void Send(Text('退出宗门成功'));
        return;
    }
    const redisClient = getIoRedis();
    const ass3Data = await redisClient.get(`${__PATH.association}:${guild.宗门名称}`);
    if (!ass3Data) {
        return;
    }
    const ass3Raw = JSON.parse(ass3Data);
    if (!isAssociation(ass3Raw)) {
        return;
    }
    const ass3 = ass3Raw;
    if (!Array.isArray(ass3.所有成员)) {
        ass3.所有成员 = [];
    }
    if (ass3.所有成员.length < 2) {
        await delDataByKey(keys.association(guild.宗门名称));
        delete player.宗门;
        await writePlayer(userId, player);
        await playerEfficiency(userId);
        void Send(Text('一声巨响,原本的宗门轰然倒塌,随着流沙沉没,仙界中再无半分痕迹'));
        return;
    }
    const seq = ['副宗主', '长老', '内门弟子', '所有成员'];
    let succList = [];
    for (const k of seq) {
        const arr = ass3[k];
        if (Array.isArray(arr) && arr.length) {
            succList = arr;
            break;
        }
    }
    const randmemberId = getRandomFromARR(succList);
    if (randmemberId) {
        const randmember = await getDataJSONParseByKey(keys.player(randmemberId));
        if (!randmember) {
            return;
        }
        if (randmember?.宗门 && randmember.宗门.职位) {
            const pos = randmember.宗门.职位;
            const arr = ass3[pos];
            if (Array.isArray(arr)) {
                ass3[pos] = arr.filter(q => q !== randmemberId);
            }
            ass3['宗主'] = randmemberId;
            randmember.宗门.职位 = '宗主';
            await writePlayer(randmemberId, randmember);
        }
    }
    ass3['所有成员'] = ass3['所有成员'].filter(q => q !== userId);
    delete player.宗门;
    await writePlayer(userId, player);
    await setDataJSONStringifyByKey(keys.association(ass3.宗门名称), ass3);
    await playerEfficiency(userId);
    void Send(Text(`轮回前,遵循你的嘱托,${randmemberId}将继承你的衣钵,成为新一任的宗主`));
}
const FAIL_PROB = 1 / 9;
const numVal = (v, d = 0) => (typeof v === 'number' && !isNaN(v) ? v : typeof v === 'string' && !isNaN(+v) ? +v : d);
const setNum = (p, k, v) => {
    p[k] = v;
};
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    if (!(await existplayer(userId))) {
        return false;
    }
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    if (!notUndAndNull(player.lunhui)) {
        setNum(player, 'lunhui', 0);
        await writePlayer(userId, player);
    }
    if (!notUndAndNull(player.轮回点)) {
        setNum(player, '轮回点', 0);
    }
    const key = KEY_LH(userId);
    const lhxqRaw = await redis.get(key);
    const lhFlag = Number(lhxqRaw) || 0;
    if (lhFlag !== 1) {
        void Send(Text('轮回之术乃逆天造化之术，须清空仙人所有的修为气血才可施展。\n' +
            '传说只有得到"轮回阵旗"进行辅助轮回，才会抵御轮回之苦的十之八九。\n' +
            '再次输入 #轮回 继续，或忽略退出。'));
        await redis.set(key, 1);
        return;
    }
    else {
        await redis.set(key, 0);
    }
    if (numVal(player.lunhui) >= 9) {
        void Send(Text('你已经轮回完结！'));
        return false;
    }
    if (player.level_id < 42) {
        void Send(Text('法境未到仙无法轮回！'));
        return false;
    }
    const equipment = await readEquipment(userId);
    if (equipment?.武器 && equipment.武器.HP < 0) {
        void Send(Text(`身上携带邪祟之物，无法进行轮回,请将[${equipment.武器.name}]放下后再进行轮回`));
        return false;
    }
    const points = numVal(player.轮回点);
    if (points <= 0) {
        void Send(Text('此生轮回点已消耗殆尽，未能躲过天机！\n被天庭发现，但因为没有轮回点未被关入天牢，\n仅被警告一次，轮回失败！'));
        player.当前血量 = 10;
        await writePlayer(userId, player);
        return false;
    }
    setNum(player, '轮回点', points - 1);
    if (Math.random() <= FAIL_PROB) {
        void Send(Text('本次轮回的最后关头，终究还是未能躲过天机！\n被天庭搜捕归案，关入天牢受尽折磨，轮回失败！'));
        player.当前血量 = 1;
        player.修为 = Math.max(0, numVal(player.修为) - 10_000_000);
        player.血气 = numVal(player.血气) + 5_141_919;
        player.灵石 = Math.max(0, numVal(player.灵石) - 10_000_000);
        await writePlayer(userId, player);
        return false;
    }
    setNum(player, 'lunhui', numVal(player.lunhui) + 1);
    await exitAssociationIfNeed(userId, player, Send);
    const stage = numVal(player.lunhui);
    const cfg = REBIRTH_MAP[stage];
    if (cfg) {
        player.灵根 = buildTalent(cfg);
        await addNajieThing(userId, cfg.gongfa, '功法', 1);
        await applyRebirthCommon(userId, player);
        await writePlayer(userId, player);
        void Send(Text(`你已打破规则，轮回成功，现在你为${cfg.msg}`));
        return false;
    }
    void Send(Text('轮回阶段配置缺失，等待更新'));
    return false;
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
