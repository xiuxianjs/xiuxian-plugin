import { useSend, Image, Text } from 'alemonjs';
import { screenshot } from '../image/index.js';
import { getRandomTalent } from './cultivation.js';
import { readPlayer, readNajie } from './xiuxiandata.js';
import { notUndAndNull, getPlayerAction } from './common.js';
import { readEquipment } from './equipment.js';
import { readExchange, readForum } from './trade.js';
import { GetPower, bigNumberTransform } from './utils/number.js';
import { readQinmidu, writeQinmidu } from './qinmidu.js';
import { getConfig } from './Config.js';
import { getIoRedis } from '@alemonjs/db';
import { keys } from './keys.js';
import { getDataList } from './DataList.js';
import { getAvatar } from './utils/utilsx.js';
import { getDataJSONParseByKey } from './DataControl.js';
import { playerEfficiency } from './xiuxian_m.js';
import { isKeys } from './utils/isKeys.js';

async function getSupermarketImage(e, thingClass) {
    const userId = e.UserId;
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    const raw = await readExchange();
    let exchangeList = raw.map((rec, idx) => ({
        ...rec,
        num: idx + 1,
        name: rec.thing
    }));
    if (thingClass) {
        exchangeList = exchangeList.filter(item => item.name.class === thingClass);
    }
    exchangeList.sort((a, b) => a.now_time - b.now_time);
    const img = await screenshot('supermarket', e.UserId, {
        user_id: userId,
        Exchange_list: exchangeList
    });
    return img;
}
async function getForumImage(e, thingClass) {
    const userId = e.UserId;
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    const forum = await readForum();
    const img = await screenshot('forum', e.UserId, {
        user_id: userId,
        Forum: (thingClass ? forum.filter(item => item.class === thingClass) : forum).sort((a, b) => a.now_time - b.now_time)
    });
    return img;
}
async function getDanfangImage(e) {
    const userId = e.UserId;
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    const danfangList = await getDataList('Danfang');
    const img = await screenshot('danfang', e.UserId, {
        user_id: userId,
        danfang_list: danfangList
    });
    return img;
}
async function getTuzhiImage(e) {
    const userId = e.UserId;
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    const tuzhiList = await getDataList('Tuzhi');
    const img = await screenshot('tuzhi', e.UserId, {
        user_id: userId,
        tuzhi_list: tuzhiList
    });
    return img;
}
async function getNingmenghomeImage(e, thingType) {
    const userId = e.UserId;
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    let commoditiesList = await getDataList('Commodity');
    if (thingType !== '') {
        if (thingType === '装备' || thingType === '丹药' || thingType === '功法' || thingType === '道具' || thingType === '草药') {
            commoditiesList = commoditiesList.filter(item => item.class === thingType);
        }
        else if (thingType === '武器' ||
            thingType === '护具' ||
            thingType === '法宝' ||
            thingType === '修为' ||
            thingType === '血量' ||
            thingType === '血气' ||
            thingType === '天赋') {
            commoditiesList = commoditiesList.filter(item => item.type === thingType);
        }
    }
    const img = await screenshot('ningmenghome', e.UserId, {
        user_id: userId,
        commodities_list: commoditiesList
    });
    return img;
}
async function getValuablesImage(e) {
    const userId = e.UserId;
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    const img = await screenshot('valuables', e.UserId, {
        user_id: userId
    });
    return img;
}
function Strand(now, max) {
    const validNow = Number(now) || 0;
    const validMax = Number(max) || 1;
    const num = ((validNow / validMax) * 100).toFixed(0);
    const mini = Number(num) > 100 ? 100 : num;
    const strand = {
        style: { width: `${mini}%` },
        num: num
    };
    return strand;
}
async function getXianChongImage(e) {
    let i;
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return;
    }
    const xianChongHave = [];
    const xianChongNeed = [];
    const kouliang = [];
    const xianChongList = await getDataList('Xianchon');
    const kouliangList = await getDataList('Xianchonkouliang');
    for (i = 0; i < xianChongList.length; i++) {
        if (najie.仙宠.find(item => item.name === xianChongList[i].name)) {
            xianChongHave.push(xianChongList[i]);
        }
        else if (player.仙宠.name === xianChongList[i].name) {
            xianChongHave.push(xianChongList[i]);
        }
        else {
            xianChongNeed.push(xianChongList[i]);
        }
    }
    for (i = 0; i < kouliangList.length; i++) {
        kouliang.push(kouliangList[i]);
    }
    const playerData = {
        nickname: player.名号,
        XianChong_have: xianChongHave,
        XianChong_need: xianChongNeed,
        Kouliang: kouliang
    };
    return await screenshot('xianchong', e.UserId, playerData);
}
async function getDaojuImage(e) {
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return;
    }
    const daojuHave = [];
    const daojuNeed = [];
    const daojuList = await getDataList('Daoju');
    for (const i of daojuList) {
        if (najie.道具.find(item => item.name === i.name)) {
            daojuHave.push(i);
        }
        else {
            daojuNeed.push(i);
        }
    }
    const playerData = {
        user_id: userId,
        nickname: player.名号,
        daoju_have: daojuHave,
        daoju_need: daojuNeed
    };
    return await screenshot('daoju', e.UserId, playerData);
}
async function getWuqiImage(e) {
    const userId = e.UserId;
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return;
    }
    const equipment = await readEquipment(userId);
    if (!equipment) {
        return;
    }
    const wuqiHave = [];
    const wuqiNeed = [];
    const wuqiList = ['equipment_list', 'timeequipmen_list', 'duanzhaowuqi', 'duanzhaohuju', 'duanzhaobaowu'];
    const data = {
        equipment_list: await getDataList('Equipment'),
        timeequipmen_list: await getDataList('TimeEquipment'),
        duanzhaowuqi: await getDataList('Duanzhaowuqi'),
        duanzhaohuju: await getDataList('Duanzhaohuju'),
        duanzhaobaowu: await getDataList('Duanzhaobaowu')
    };
    for (const i of wuqiList) {
        const arr = data[i];
        if (!Array.isArray(arr)) {
            continue;
        }
        for (const j of arr) {
            if (najie['装备'].find(item => item.name === j.name) && !wuqiHave.find(item => item.name === j.name)) {
                wuqiHave.push(j);
            }
            else if ((equipment['武器'].name === j.name || equipment['法宝'].name === j.name || equipment['护具'].name === j.name) &&
                !wuqiHave.find(item => item.name === j.name)) {
                wuqiHave.push(j);
            }
            else if (!wuqiNeed.find(item => item.name === j.name)) {
                wuqiNeed.push(j);
            }
        }
    }
    const playerData = {
        user_id: userId,
        nickname: player.名号,
        wuqi_have: wuqiHave,
        wuqi_need: wuqiNeed
    };
    return await screenshot('wuqi', e.UserId, playerData);
}
async function getDanyaoImage(e) {
    const userId = e.UserId;
    const player = await readPlayer(userId);
    if (!player) {
        return;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return;
    }
    const danyaoHave = [];
    const danyaoNeed = [];
    const danyao = ['danyao_list', 'timedanyao_list', 'newdanyao_list'];
    const data = {
        danyao_list: await getDataList('Danyao'),
        timedanyao_list: await getDataList('TimeDanyao'),
        newdanyao_list: await getDataList('NewDanyao')
    };
    for (const i of danyao) {
        const arr = data[i];
        if (!Array.isArray(arr)) {
            continue;
        }
        for (const j of arr) {
            if (najie['丹药'].find(item => item.name === j.name) && !danyaoHave.find(item => item.name === j.name)) {
                danyaoHave.push(j);
            }
            else if (!danyaoNeed.find(item => item.name === j.name)) {
                danyaoNeed.push(j);
            }
        }
    }
    const playerData = {
        user_id: userId,
        nickname: player.名号,
        danyao_have: danyaoHave,
        danyao_need: danyaoNeed
    };
    return await screenshot('danyao', e.UserId, playerData);
}
async function getGongfaImage(e) {
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const rawXuexi = player.学习的功法;
    const xuexiGongfa = Array.isArray(rawXuexi) ? rawXuexi.filter(v => typeof v === 'string') : [];
    const gongfaHave = [];
    const gongfaNeed = [];
    const gongfa = ['gongfa_list', 'timegongfa_list'];
    const data = {
        gongfa_list: await getDataList('Gongfa'),
        timegongfa_list: await getDataList('TimeGongfa')
    };
    for (const i of gongfa) {
        const arr = data[i];
        if (!Array.isArray(arr)) {
            continue;
        }
        for (const j of arr) {
            if (xuexiGongfa.includes(j.name) && !gongfaHave.find(item => item.name === j.name)) {
                gongfaHave.push(j);
            }
            else if (!gongfaNeed.find(item => item.name === j.name)) {
                gongfaNeed.push(j);
            }
        }
    }
    const playerData = {
        user_id: userId,
        nickname: player.名号,
        gongfa_have: gongfaHave,
        gongfa_need: gongfaNeed
    };
    return await screenshot('gongfa', e.UserId, playerData);
}
async function getPowerImage(e) {
    const userId = e.UserId;
    const Send = useSend(e);
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        void Send(Text('玩家数据获取失败'));
        return;
    }
    let lingshi = Math.trunc(player.灵石);
    if (player.灵石 > 999999999999) {
        lingshi = 999999999999;
    }
    await playerEfficiency(userId);
    if (!notUndAndNull(player.level_id)) {
        void Send(Text('请先#同步信息'));
        return;
    }
    let association;
    if (!notUndAndNull(player.宗门)) {
        association = {
            宗门名称: '无',
            职位: '无'
        };
    }
    else {
        association = player.宗门;
    }
    const physiqueList = await getDataList('Level2');
    const curLevelMax = physiqueList.find(item => item.level_id === player.Physique_id);
    if (!curLevelMax) {
        return;
    }
    const levelMax = curLevelMax.level;
    const needXueqi = curLevelMax.exp;
    const learnedGongfa = await getDataList('Gongfa');
    const TimeGongfa = await getDataList('TimeGongfa');
    const gongfaMessage = {};
    learnedGongfa.forEach(item => {
        gongfaMessage[item.name] = item;
    });
    TimeGongfa.forEach(item => {
        gongfaMessage[item.name] = item;
    });
    const gongfa = player.学习的功法
        .map(item => {
        return {
            name: item,
            ...(gongfaMessage[item] ?? {})
        };
    })
        .sort((a, b) => {
        return (b.修炼加成 ?? 0) - (a.修炼加成 ?? 0);
    });
    const playerCopy = {
        user_id: userId,
        nickname: player.名号,
        need_xueqi: needXueqi,
        xueqi: player.血气,
        levelMax: levelMax,
        lingshi: lingshi,
        镇妖塔层数: player.镇妖塔层数,
        levelId: player.level_id,
        神魄段数: player.神魄段数,
        hgd: player.favorability,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        gongfa: gongfa,
        association: association
    };
    return await screenshot('playercopy', e.UserId, playerCopy);
}
async function getPlayerImage(e) {
    const Send = useSend(e);
    let 法宝评级;
    let 护具评级;
    let 武器评级;
    const userId = e.UserId;
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        void Send(Text('玩家数据获取失败'));
        return;
    }
    const rawXuexi = player.学习的功法;
    const learnedGongfa = Array.isArray(rawXuexi) ? rawXuexi.filter(v => typeof v === 'string') : [];
    const equipment = await getDataJSONParseByKey(keys.equipment(userId));
    if (!equipment) {
        void Send(Text('装备数据获取失败'));
        return;
    }
    const playerStatusRaw = await getPlayerAction(userId);
    const playerStatus = {
        action: String(playerStatusRaw.action),
        time: typeof playerStatusRaw.time === 'number' ? String(playerStatusRaw.time) : (playerStatusRaw.time ?? null)
    };
    let status = '空闲';
    if (playerStatus.time !== null) {
        status = playerStatus.action + '(剩余时间:' + playerStatus.time + ')';
    }
    let lingshi = Math.trunc(player.灵石);
    if (player.灵石 > 999999999999) {
        lingshi = 999999999999;
    }
    player.宣言 ??= '这个人很懒什么都没写';
    player.灵根 ??= await getRandomTalent();
    await playerEfficiency(userId);
    if (player.linggenshow !== 0) {
        player.灵根.type = '无';
        player.灵根.name = '未知';
        player.灵根.法球倍率 = '0';
        player.修炼效率提升 = 0;
    }
    if (!notUndAndNull(player.level_id)) {
        void Send(Text('存档错误'));
        return;
    }
    if (!notUndAndNull(player.sex)) {
        void Send(Text('存档错误'));
        return;
    }
    let nd = '无';
    if (player.隐藏灵根) {
        nd = player.隐藏灵根.name;
    }
    const zd = ['攻击', '防御', '生命加成', '防御加成', '攻击加成'];
    const num = [];
    const p = [];
    const kxjs = [];
    let count = 0;
    for (const j of zd) {
        if (player[j] === 0) {
            p[count] = '';
            kxjs[count] = 0;
            count++;
            continue;
        }
        const base = Number(player[j] || 0);
        p[count] = Math.floor(Math.log(base) / Math.LN10);
        num[count] = base * 10 ** -p[count];
        kxjs[count] = `${num[count].toFixed(2)} x 10`;
        count++;
    }
    const levelList = await getDataList('Level1');
    const physiqueList = await getDataList('Level2');
    const level = levelList.find(item => item.level_id === player.level_id).level;
    const power2 = ((player.攻击 + player.防御 * 1.1 + player.血量上限 * 0.5) / 10000).toFixed(2);
    const level2 = physiqueList.find(item => item.level_id === player.Physique_id).level;
    const needExp = levelList.find(item => item.level_id === player.level_id).exp;
    const needExp2 = physiqueList.find(item => item.level_id === player.Physique_id).exp;
    let occupation = player.occupation;
    let occupationLevel;
    let occupationLevelName;
    let occupationExp;
    let occupationNeedExp;
    if (!notUndAndNull(player.occupation)) {
        occupation = '无';
        occupationLevelName = '-';
        occupationExp = 0;
        occupationNeedExp = 1;
    }
    else {
        occupationLevel = player.occupation_level;
        occupationExp = player.occupation_exp;
        const list = await getDataList('experience');
        const level = list.find(item => item.id === occupationLevel) || {};
        occupationLevelName = level?.name || '无';
        occupationNeedExp = level?.experience || 0;
    }
    let thisAssociation;
    if (!notUndAndNull(player.宗门)) {
        thisAssociation = {
            宗门名称: '无',
            职位: '无'
        };
    }
    else {
        thisAssociation = player.宗门;
    }
    const pinji = ['劣', '普', '优', '精', '极', '绝', '顶'];
    equipment.武器 ??= { atk: 0, def: 0, HP: 0, bao: 0 };
    if (!notUndAndNull(equipment.武器.pinji)) {
        武器评级 = '无';
    }
    else {
        武器评级 = pinji[equipment.武器.pinji];
    }
    equipment.护具 ??= { atk: 0, def: 0, HP: 0, bao: 0 };
    if (!notUndAndNull(equipment.护具.pinji)) {
        护具评级 = '无';
    }
    else {
        护具评级 = pinji[equipment.护具.pinji];
    }
    equipment.法宝 ??= { atk: 0, def: 0, HP: 0, bao: 0 };
    if (!notUndAndNull(equipment.法宝.pinji)) {
        法宝评级 = '无';
    }
    else {
        法宝评级 = pinji[equipment.法宝.pinji];
    }
    const rankLianqi = levelList.find(item => item.level_id === player.level_id).level;
    const expmaxLianqi = levelList.find(item => item.level_id === player.level_id).exp;
    const rankLlianti = physiqueList.find(item => item.level_id === player.Physique_id).level;
    const expmaxLlianti = needExp2;
    const rankLiandan = occupationLevelName;
    const expmaxLiandan = occupationNeedExp;
    const strandHp = Strand(player.当前血量, player.血量上限);
    const strandLianqi = Strand(player.修为, expmaxLianqi);
    const strandLlianti = Strand(player.血气, expmaxLlianti);
    const strandLiandan = Strand(occupationExp, expmaxLiandan);
    const power = GetPower(player.攻击, player.防御, player.血量上限, player.暴击率);
    const powerMini = bigNumberTransform(power);
    const bao = Math.floor(player.暴击率 * 100) + '%';
    const equipmentCopy = {
        武器: {
            ...equipment.武器,
            bao: Math.floor((equipment.武器.bao || 0) * 100) + '%'
        },
        护具: {
            ...equipment.护具,
            bao: Math.floor((equipment.护具.bao || 0) * 100) + '%'
        },
        法宝: {
            ...equipment.法宝,
            bao: Math.floor((equipment.法宝.bao || 0) * 100) + '%'
        }
    };
    const lingshiDisplay = bigNumberTransform(lingshi);
    let hunyin = '未知';
    const a = userId;
    let qinmidu = [];
    try {
        qinmidu = await readQinmidu();
    }
    catch {
        await writeQinmidu([]);
    }
    for (let i = 0; i < qinmidu.length; i++) {
        if (qinmidu[i].QQ_A === a || qinmidu[i].QQ_B === a) {
            if (qinmidu[i].婚姻 > 0) {
                if (qinmidu[i].QQ_A === a) {
                    const b = await readPlayer(qinmidu[i].QQ_B);
                    hunyin = b?.名号 || hunyin;
                }
                else {
                    const aPlayer = await readPlayer(qinmidu[i].QQ_A);
                    hunyin = aPlayer?.名号 || hunyin;
                }
                break;
            }
        }
    }
    const action = player.练气皮肤;
    const playerData = {
        neidan: nd,
        pifu: action,
        user_id: userId,
        player,
        rank_lianqi: rankLianqi,
        expmax_lianqi: expmaxLianqi,
        rank_llianti: rankLlianti,
        expmax_llianti: expmaxLlianti,
        rank_liandan: rankLiandan,
        expmax_liandan: expmaxLiandan,
        equipment,
        talent: Math.floor(Number(player.修炼效率提升 || 0) * 100),
        player_action: status,
        this_association: thisAssociation,
        strand_hp: strandHp,
        strand_lianqi: strandLianqi,
        strand_llianti: strandLlianti,
        strand_liandan: strandLiandan,
        PowerMini: powerMini,
        bao,
        nickname: player.名号,
        linggen: player.灵根,
        declaration: player.宣言,
        needEXP: needExp,
        needEXP2: needExp2,
        exp: player.修为,
        exp2: player.血气,
        zdl: power,
        镇妖塔层数: player.镇妖塔层数,
        sh: player.神魄段数,
        mdz: player.魔道值,
        hgd: player.favorability,
        jczdl: power2,
        level: level,
        level2: level2,
        lingshi: lingshiDisplay,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        player_atk: kxjs[0],
        player_atk2: p[0],
        player_def: kxjs[1],
        player_def2: p[1],
        生命加成: kxjs[2],
        生命加成_t: p[2],
        防御加成: kxjs[3],
        防御加成_t: p[3],
        攻击加成: kxjs[4],
        攻击加成_t: p[4],
        player_bao: player.暴击率,
        player_bao2: player.暴击伤害,
        occupation: occupation,
        occupation_level: occupationLevelName,
        occupation_exp: occupationExp,
        occupation_needEXP: occupationNeedExp,
        arms: equipmentCopy.武器,
        armor: equipmentCopy.护具,
        treasure: equipmentCopy.法宝,
        association: thisAssociation,
        learned_gongfa: learnedGongfa,
        婚姻状况: hunyin,
        武器评级: 武器评级,
        护具评级: 护具评级,
        法宝评级: 法宝评级,
        avatar: getAvatar(userId)
    };
    return await screenshot('player', e.UserId, playerData);
}
async function getAssociationImage(e) {
    let item;
    const userId = e.UserId;
    const Send = useSend(e);
    const redis = getIoRedis();
    const ifExistPlay = (await redis.exists(keys.player(userId))) > 0;
    if (!ifExistPlay) {
        return;
    }
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player || !notUndAndNull(player.宗门)) {
        return;
    }
    if (!notUndAndNull(player.level_id)) {
        void Send(Text('请先#同步信息'));
        return;
    }
    const zongmenName = typeof player.宗门 === 'string' ? player.宗门 : player.宗门?.宗门名称;
    const assRaw = await getDataJSONParseByKey(keys.association(zongmenName || ''));
    if (!assRaw) {
        void Send(Text('宗门数据获取失败'));
        return;
    }
    if (!isKeys(assRaw, ['宗主', 'power', '最低加入境界', '副宗主', '长老', '内门弟子', '外门弟子', '维护时间', '宗门驻地', '宗门等级', '宗门神兽'])) {
        void Send(Text('宗门数据结构异常'));
        return;
    }
    const ass = assRaw;
    const mainqqData = await getIoRedis().get(keys.player(String(ass.宗主)));
    const mainqq = JSON.parse(mainqqData || '{}');
    const xian = ass.power;
    let weizhi;
    if (xian === 0) {
        weizhi = '凡界';
    }
    else {
        weizhi = '仙界';
    }
    const levelList = await getDataList('Level1');
    const level = levelList.find(item => item.level_id === ass.最低加入境界).level;
    const fuzong = [];
    for (item in ass.副宗主 || {}) {
        const qq = ass.副宗主[item];
        const str = await getIoRedis().get(keys.player(qq));
        const pData = JSON.parse(str || '{}');
        const name = pData?.名号 || '未知';
        fuzong[item] = `道号：${name}账号：${qq}`;
    }
    const zhanglao = [];
    for (item in ass.长老 || {}) {
        const qq = ass.长老[item];
        const str = await getIoRedis().get(keys.player(qq));
        const pData = JSON.parse(str || '{}');
        const name = pData?.名号 || '未知';
        zhanglao[item] = `道号：${name}账号：${qq}`;
    }
    const neimen = [];
    for (item in ass.内门弟子 || {}) {
        const qq = ass.内门弟子[item];
        const str = await getIoRedis().get(keys.player(qq));
        const pData = JSON.parse(str || '{}');
        const name = pData?.名号 || '未知';
        neimen[item] = `道号：${name}账号：${qq}`;
    }
    const waimen = [];
    for (item in ass.外门弟子 || {}) {
        const qq = ass.外门弟子[item];
        const str = await getIoRedis().get(keys.player(qq));
        const pData = JSON.parse(str || '{}');
        const name = pData?.名号 || '未知';
        waimen[item] = `道号：${name}账号：${qq}`;
    }
    let state = '需要维护';
    const now = new Date();
    const nowTime = now.getTime();
    if (Number(ass.维护时间) > nowTime - 1000 * 60 * 60 * 24 * 7) {
        state = '不需要维护';
    }
    let xiulian;
    const blessList = await getDataList('Bless');
    const dongTan = (blessList || []).find(item => item.name === ass.宗门驻地);
    if (ass.宗门驻地 === 0) {
        xiulian = Number(ass.宗门等级) * 0.05 * 100;
    }
    else {
        try {
            xiulian = Number(ass.宗门等级) * 0.05 * 100 + Number(dongTan?.efficiency || 0) * 100;
        }
        catch {
            xiulian = Number(ass.宗门等级) * 0.05 * 100 + 0.5;
        }
    }
    xiulian = Math.trunc(xiulian);
    if (ass.宗门神兽 === 0) {
        ass.宗门神兽 = '无';
    }
    const associationData = {
        user_id: userId,
        ass: ass,
        mainname: mainqq.名号,
        mainqq: ass.宗主,
        xiulian: xiulian,
        weizhi: weizhi,
        level: level,
        mdz: player.魔道值,
        zhanglao: zhanglao,
        fuzong: fuzong,
        neimen: neimen,
        waimen: waimen,
        state: state
    };
    return await screenshot('association', e.UserId, associationData);
}
async function getEquipmentImage(e) {
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const bao = Math.trunc(Math.floor(player.暴击率 * 100));
    const equipment = await getDataJSONParseByKey(keys.equipment(userId));
    if (!equipment) {
        return;
    }
    const playerData = {
        user_id: userId,
        mdz: player.魔道值,
        nickname: player.名号,
        arms: equipment.武器,
        armor: equipment.护具,
        treasure: equipment.法宝,
        player_atk: player.攻击,
        player_def: player.防御,
        player_bao: bao,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        pifu: Number(player.装备皮肤 || 0)
    };
    return await screenshot('equipment', e.UserId, playerData);
}
async function getNajieImage(e) {
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const najie = await readNajie(userId);
    if (!najie) {
        return;
    }
    const lingshi = Math.trunc(najie.灵石);
    const lingshi2 = Math.trunc(najie.灵石上限 || 0);
    const strandHp = Strand(player.当前血量, player.血量上限);
    const strandLingshi = Strand(najie.灵石, najie.灵石上限 || 0);
    const playerData = {
        user_id: userId,
        player: player,
        najie: najie,
        mdz: player.魔道值,
        nickname: player.名号,
        najie_lv: najie.等级 || 1,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        najie_maxlingshi: lingshi2,
        najie_lingshi: lingshi,
        najie_equipment: najie.装备,
        najie_danyao: najie.丹药,
        najie_daoju: najie.道具,
        najie_gongfa: najie.功法,
        najie_caoyao: najie.草药,
        najie_cailiao: najie.材料,
        strand_hp: strandHp,
        strand_lingshi: strandLingshi,
        pifu: player.练气皮肤 || 0
    };
    return await screenshot('najie', e.UserId, playerData);
}
async function getStateImage(e, allLevel) {
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const levelId = player.level_id;
    const levelList = await getDataList('Level1');
    let levelListFiltered = levelList;
    if (!allLevel) {
        for (let i = 1; i <= 60; i++) {
            if (i > levelId - 6 && i < levelId + 6) {
                continue;
            }
            levelListFiltered = levelListFiltered.filter(item => item.level_id !== i);
        }
    }
    const stateData = {
        user_id: userId,
        Level_list: levelListFiltered
    };
    return await screenshot('state', e.UserId, stateData);
}
async function getStatezhiyeImage(e, allLevel) {
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const levelId = player.occupation_level || 0;
    const levelList = await getDataList('experience');
    let levelListFiltered = levelList;
    if (!allLevel) {
        for (let i = 0; i <= 60; i++) {
            if (i > levelId - 6 && i < levelId + 6) {
                continue;
            }
            levelListFiltered = levelListFiltered.filter(item => item.id !== i);
        }
    }
    const stateData = {
        user_id: userId,
        Level_list: levelListFiltered
    };
    return await screenshot('statezhiye', e.UserId, stateData);
}
async function getStatemaxImage(e, allLevel) {
    const userId = e.UserId;
    const player = await getDataJSONParseByKey(keys.player(userId));
    if (!player) {
        return;
    }
    const levelId = player.Physique_id;
    const levelMaxList = await getDataList('Level2');
    let levelMaxListFiltered = levelMaxList;
    if (!allLevel) {
        for (let i = 1; i <= 60; i++) {
            if (i > levelId - 6 && i < levelId + 6) {
                continue;
            }
            levelMaxListFiltered = levelMaxListFiltered.filter(item => item.level_id !== i);
        }
    }
    return await screenshot('statemax', e.UserId, {
        user_id: userId,
        LevelMax_list: levelMaxListFiltered
    });
}
async function getAdminsetImage(e) {
    const config = await getConfig('xiuxian', 'xiuxian');
    const adminSet = {
        CDassociation: config.CD.association,
        CDjoinassociation: config.CD.joinassociation,
        CDassociationbattle: config.CD.associationbattle,
        CDrob: config.CD.rob,
        CDgambling: config.CD.gambling,
        CDcouple: config.CD.couple,
        CDgarden: config.CD.garden,
        CDlevel_up: config.CD.level_up,
        CDsecretplace: config.CD.secretplace,
        CDtimeplace: config.CD.timeplace,
        CDforbiddenarea: config.CD.forbiddenarea,
        CDreborn: config.CD.reborn,
        CDtransfer: config.CD.transfer,
        CDhonbao: config.CD.honbao,
        CDboss: config.CD.boss,
        percentagecost: config.percentage.cost,
        percentageMoneynumber: config.percentage.Moneynumber,
        percentagepunishment: config.percentage.punishment,
        sizeMoney: config.size.Money,
        switchplay: config.sw.play,
        switchMoneynumber: config.sw.play,
        switchcouple: config.sw.couple,
        switchXiuianplay_key: config.sw.Xiuianplay_key,
        biguansize: config.biguan.size,
        biguantime: config.biguan.time,
        biguancycle: config.biguan.cycle,
        worksize: config.work.size,
        worktime: config.work.time,
        workcycle: config.work.cycle,
        SecretPlaceone: config.SecretPlace.one,
        SecretPlacetwo: config.SecretPlace.two,
        SecretPlacethree: config.SecretPlace.three
    };
    return await screenshot('adminset', e.UserId, adminSet);
}
async function getRankingPowerImage(e, data, usrPaiming, thisPlayer) {
    const userId = e.UserId;
    const levelList = await getDataList('Level1');
    const level = levelList.find(item => item.level_id === thisPlayer.level_id)?.level;
    const rankingPowerData = {
        user_id: userId,
        mdz: thisPlayer.魔道值,
        nickname: thisPlayer.名号,
        exp: thisPlayer.修为,
        level: level,
        usr_paiming: usrPaiming,
        allplayer: data
    };
    return await screenshot('ranking_power', e.UserId, rankingPowerData);
}
async function getRankingMoneyImage(e, data, usrPaiming, thisPlayer, thisNajie) {
    const userId = e.UserId;
    const najieLingshi = Math.trunc(thisNajie.灵石);
    const lingshi = Math.trunc(thisPlayer.灵石 + thisNajie.灵石);
    const rankingMoneyData = {
        user_id: userId,
        nickname: thisPlayer.名号,
        lingshi: lingshi,
        najie_lingshi: najieLingshi,
        usr_paiming: usrPaiming,
        allplayer: data
    };
    return await screenshot('ranking_money', e.UserId, rankingMoneyData);
}
async function goWeizhi(e, weizhi) {
    const Send = useSend(e);
    const image = await screenshot('secret_place', e.UserId, {
        didian_list: weizhi
    });
    if (Buffer.isBuffer(image)) {
        void Send(Image(image));
        return;
    }
    void Send(Text('获取图片失败，请稍后再试'));
}
async function getMonthCard(userId, data) {
    return await screenshot('Monthcard', userId, data);
}

export { getAdminsetImage, getAssociationImage, getDanfangImage, getDanyaoImage, getDaojuImage, getEquipmentImage, getForumImage, getGongfaImage, getMonthCard, getNajieImage, getNingmenghomeImage, getPlayerImage, getPowerImage, getRankingMoneyImage, getRankingPowerImage, getStateImage, getStatemaxImage, getStatezhiyeImage, getSupermarketImage, getTuzhiImage, getValuablesImage, getWuqiImage, getXianChongImage, goWeizhi };
