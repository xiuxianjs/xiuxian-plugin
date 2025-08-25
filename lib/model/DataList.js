import ____$z from '../resources/data/item/灵根列表.json.js';
import ____$y from '../resources/data/item/怪物列表.json.js';
import ____$x from '../resources/data/item/商品列表.json.js';
import ____$w from '../resources/data/Level/练气境界.json.js';
import ____$v from '../resources/data/item/积分商城.json.js';
import ____$u from '../resources/data/Level/炼体境界.json.js';
import ____$t from '../resources/data/item/装备列表.json.js';
import ____$s from '../resources/data/item/丹药列表.json.js';
import _____ from '../resources/data/item/炼丹师丹药.json.js';
import ____$r from '../resources/data/item/道具列表.json.js';
import ____$q from '../resources/data/item/功法列表.json.js';
import ____$p from '../resources/data/item/草药列表.json.js';
import ____$o from '../resources/data/item/地点列表.json.js';
import ____$n from '../resources/data/item/洞天福地.json.js';
import ____$m from '../resources/data/item/宗门秘境.json.js';
import ____$l from '../resources/data/item/禁地列表.json.js';
import ____$k from '../resources/data/item/仙境列表.json.js';
import ____$j from '../resources/data/Timelimit/限定仙府.json.js';
import ____$i from '../resources/data/Timelimit/限定功法.json.js';
import ____$h from '../resources/data/Timelimit/限定装备.json.js';
import ____$g from '../resources/data/Timelimit/限定丹药.json.js';
import ____$f from '../resources/data/occupation/职业列表.json.js';
import experience from '../resources/data/occupation/experience.json.js';
import ____$e from '../resources/data/occupation/炼丹配方.json.js';
import ____$d from '../resources/data/occupation/装备图纸.json.js';
import __$2 from '../resources/data/item/八品.json.js';
import _______ from '../resources/data/item/星阁拍卖行列表.json.js';
import ___ from '../resources/data/item/天地堂.json.js';
import ____$c from '../resources/data/item/常驻仙宠.json.js';
import ____$b from '../resources/data/item/仙宠列表.json.js';
import ______$1 from '../resources/data/item/仙宠口粮列表.json.js';
import npc__ from '../resources/data/item/npc列表.json.js';
import shop__ from '../resources/data/item/shop列表.json.js';
import __$1 from '../resources/data/Timelimit/青龙.json.js';
import __ from '../resources/data/Timelimit/麒麟.json.js';
import ______ from '../resources/data/Timelimit/玄武朱雀白虎.json.js';
import ____$a from '../resources/data/item/魔界列表.json.js';
import ____$9 from '../resources/data/item/兑换列表.json.js';
import ____$8 from '../resources/data/item/神界列表.json.js';
import ____1 from '../resources/data/item/技能列表1.json.js';
import ____2 from '../resources/data/item/技能列表2.json.js';
import ____$7 from '../resources/data/item/强化列表.json.js';
import ____$6 from '../resources/data/item/锻造材料.json.js';
import ____$5 from '../resources/data/item/锻造武器.json.js';
import ____$4 from '../resources/data/item/锻造护具.json.js';
import ____$3 from '../resources/data/item/锻造宝物.json.js';
import ____$2 from '../resources/data/item/隐藏灵根.json.js';
import ____$1 from '../resources/data/item/锻造杂类.json.js';
import ____ from '../resources/data/item/技能列表.json.js';
import updateRecord from '../resources/data/updateRecord.json.js';
import { __PATH } from './keys.js';
import { getIoRedis } from '@alemonjs/db';

const DATA_LIST = {
    Talent: ____$z,
    Monster: ____$y,
    Commodity: ____$x,
    Level1: ____$w,
    ScoreShop: ____$v,
    Level2: ____$u,
    Equipment: ____$t,
    Danyao: ____$s,
    NewDanyao: _____,
    Daoju: ____$r,
    Gongfa: ____$q,
    Caoyao: ____$p,
    Didian: ____$o,
    Bless: ____$n,
    GuildSecrets: ____$m,
    ForbiddenArea: ____$l,
    FairyRealm: ____$k,
    TimePlace: ____$j,
    TimeGongfa: ____$i,
    TimeEquipment: ____$h,
    TimeDanyao: ____$g,
    Occupation: ____$f,
    experience,
    Danfang: ____$e,
    Tuzhi: ____$d,
    Bapin: __$2,
    Xingge: _______,
    Tianditang: ___,
    Changzhuxianchon: ____$c,
    Xianchon: ____$b,
    Xianchonkouliang: ______$1,
    NPC: npc__,
    Shop: shop__,
    Qinglong: __$1,
    Qilin: __,
    Xuanwu: ______,
    Mojie: ____$a,
    ExchangeItem: ____$9,
    Shenjie: ____$8,
    Jineng1: ____1,
    Jineng2: ____2,
    Qianghua: ____$7,
    Duanzhaocailiao: ____$6,
    Duanzhaowuqi: ____$5,
    Duanzhaohuju: ____$4,
    Duanzhaobaowu: ____$3,
    Yincang: ____$2,
    Zalei: ____$1,
    Jineng: ____,
    UpdateRecord: updateRecord
};
const hasDataList = (key) => {
    return !!DATA_LIST[key];
};
const getDataList = async (key) => {
    const redis = getIoRedis();
    const size = await redis.exists(key);
    if (size > 0) {
        try {
            const redisData = await redis.get(key);
            return JSON.parse(redisData);
        }
        catch (error) {
            logger.warn(`Failed to parse redis data for key ${key}: ${error}`);
            return DATA_LIST[key];
        }
    }
    return DATA_LIST[key];
};
const setDataList = async (key, data) => {
    const redis = getIoRedis();
    try {
        await redis.set(key, JSON.stringify(data));
    }
    catch (error) {
        logger.error(`Failed to set redis data for key ${key}: ${error}`);
    }
};
var DataListx = {
    player: __PATH.player_path,
    equipment: __PATH.equipment_path,
    najie: __PATH.najie_path,
    lib: __PATH.lib_path,
    association: __PATH.association,
    occupation: __PATH.occupation,
    lib_path: __PATH.lib_path,
    Timelimit: __PATH.Timelimit,
    Level: __PATH.Level,
    Occupation: __PATH.occupation,
    talent_list: ____$z,
    monster_list: ____$y,
    commodities_list: ____$x,
    Level_list: ____$w,
    shitujifen: ____$v,
    LevelMax_list: ____$u,
    equipment_list: ____$t,
    danyao_list: ____$s,
    newdanyao_list: _____,
    daoju_list: ____$r,
    gongfa_list: ____$q,
    caoyao_list: ____$p,
    didian_list: ____$o,
    bless_list: ____$n,
    guildSecrets_list: ____$m,
    forbiddenarea_list: ____$l,
    Fairyrealm_list: ____$k,
    timeplace_list: ____$j,
    timegongfa_list: ____$i,
    timeequipmen_list: ____$h,
    timedanyao_list: ____$g,
    occupation_list: ____$f,
    occupation_exp_list: experience,
    danfang_list: ____$e,
    tuzhi_list: ____$d,
    npc_list: npc__,
    shop_list: shop__,
    bapin: __$2,
    xingge: _______,
    tianditang: ___,
    changzhuxianchon: ____$c,
    xianchon: ____$b,
    xianchonkouliang: ______$1,
    qinlong: __$1,
    qilin: __,
    xuanwu: ______,
    mojie: ____$a,
    jineng1: ____1,
    jineng2: ____2,
    jineng: ____
};

export { DATA_LIST, DataListx as default, getDataList, hasDataList, setDataList };
