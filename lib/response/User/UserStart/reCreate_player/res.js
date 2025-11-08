import { useSend, Text, useSubscribe, useMessage } from 'alemonjs';
import { redis } from '../../../../model/api.js';
import { getRedisKey, keys, keysByPath, __PATH } from '../../../../model/keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey, delDataByKey } from '../../../../model/DataControl.js';
import { getAvatar } from '../../../../model/utils/utilsx.js';
import { formatRemaining } from '../../../../model/actionHelper.js';
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
import { getConfig } from '../../../../model/Config.js';
import { Go, notUndAndNull, getRandomFromARR } from '../../../../model/common.js';
import { writeEquipment } from '../../../../model/equipment.js';
import { existplayer, readPlayer, readNajie, writePlayer, writeNajie } from '../../../../model/xiuxiandata.js';
import '../../../../model/settions.js';
import { addHP } from '../../../../model/economy.js';
import 'svg-captcha';
import 'sharp';
import { getRandomTalent } from '../../../../model/cultivation.js';
import '../../../../model/currency.js';
import { writeDanyao } from '../../../../model/danyao.js';
import 'crypto';
import { addNajieThing } from '../../../../model/najie.js';
import 'posthog-node';
import '../../../../model/message.js';
import mw, { selects } from '../../../mw-captcha.js';

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
    const nowTime = Date.now();
    const lastKey = getRedisKey(userId, 'last_reCreate_time');
    const lastRestartRaw = await redis.get(lastKey);
    const lastRestart = parseNum(lastRestartRaw);
    const cf = (await getConfig('xiuxian', 'xiuxian'));
    const rebornMin = cf?.CD?.reborn ?? 60;
    const rebornTime = rebornMin * 60000;
    if (nowTime < lastRestart + rebornTime) {
        const remain = lastRestart + rebornTime - nowTime;
        void Send(Text(`每${rebornTime / 60000}分钟只能转世一次 剩余cd:${formatRemaining(remain)}`));
        return false;
    }
    const najie = await readNajie(userId);
    if (!najie?.道具?.some(item => item.name === '转世卡')) {
        void Send(Text('您没有转世卡'));
        return false;
    }
    await addNajieThing(userId, '转世卡', '道具', -1);
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
        await createPlayer(event);
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
var res_default = onResponse(selects, [mw.current, res.current]);
async function createPlayer(e) {
    const userId = e.UserId;
    const userList = await keysByPath(__PATH.player_path);
    const n = userList.length + 1;
    const talentRaw = await getRandomTalent();
    const talent = normalizeTalent(talentRaw);
    const newPlayer = {
        id: userId,
        sex: 0,
        名号: `路人甲${n}号`,
        宣言: '这个人很懒还没有写',
        avatar: e.UserAvatar ?? getAvatar('1715713638'),
        level_id: 1,
        Physique_id: 1,
        race: 1,
        修为: 1,
        血气: 1,
        灵石: 10000,
        灵根: talent,
        神石: 0,
        favorability: 0,
        breakthrough: false,
        linggen: [],
        linggenshow: 1,
        学习的功法: [],
        修炼效率提升: talent.eff,
        连续签到天数: 0,
        攻击加成: 0,
        防御加成: 0,
        生命加成: 0,
        power_place: 1,
        当前血量: 8000,
        lunhui: 0,
        lunhuiBH: 0,
        轮回点: 10,
        occupation: '',
        occupation_level: 1,
        镇妖塔层数: 0,
        神魄段数: 0,
        魔道值: 0,
        仙宠: {
            name: '',
            type: '',
            加成: 0,
            灵魂绑定: 0,
            等级: 0,
            每级增加: 0,
            等级上限: 0
        },
        练气皮肤: 0,
        装备皮肤: 0,
        幸运: 0,
        addluckyNo: 0,
        师徒任务阶段: 0,
        师徒积分: 0,
        血量上限: 0,
        攻击: 0,
        防御: 0,
        暴击率: 0,
        暴击伤害: 0,
        金银坊败场: 0,
        金银坊支出: 0,
        金银坊胜场: 0,
        金银坊收入: 0,
        occupation_exp: 0,
        锻造天赋: 0,
        隐藏灵根: undefined,
        神界次数: 0,
        法球倍率: 0
    };
    await writePlayer(userId, newPlayer);
    const newQquipment = {
        武器: await pickEquip('烂铁匕首'),
        护具: await pickEquip('破铜护具'),
        法宝: await pickEquip('廉价炮仗')
    };
    await writeEquipment(userId, newQquipment);
    const newNajie = {
        等级: 1,
        灵石上限: 5000,
        灵石: 0,
        装备: [],
        丹药: [],
        道具: [],
        功法: [],
        草药: [],
        材料: [],
        仙宠: [],
        仙宠口粮: [],
        武器: null,
        护具: null,
        法宝: null
    };
    await writeNajie(userId, newNajie);
    await addHP(userId, 999999);
    const danyaoInit = {
        biguan: 0,
        biguanxl: 0,
        xingyun: 0,
        lianti: 0,
        ped: 0,
        modao: 0,
        beiyong1: 0,
        beiyong2: 0,
        beiyong3: 0,
        beiyong4: 0,
        beiyong5: 0
    };
    await writeDanyao(userId, danyaoInit);
}
async function pickEquip(name) {
    const equipmentData = await getDataList('Equipment');
    return equipmentData.find(i => i.name === name) || null;
}
function normalizeTalent(t) {
    if (t && typeof t === 'object') {
        const obj = t;
        const eff = typeof obj.eff === 'number' ? obj.eff : 0;
        return { ...obj, eff };
    }
    return { eff: 0 };
}

export { res_default as default, regular };
