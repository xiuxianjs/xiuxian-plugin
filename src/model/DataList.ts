import 灵根列表 from '../resources/data/item/灵根列表.json';
import 怪物列表 from '../resources/data/item/怪物列表.json';
import 商品列表 from '../resources/data/item/商品列表.json';
import 练气境界 from '../resources/data/Level/练气境界.json';
import 积分商城 from '../resources/data/item/积分商城.json';
import 炼体境界 from '../resources/data/Level/炼体境界.json';
import 装备列表 from '../resources/data/item/装备列表.json';
import 丹药列表 from '../resources/data/item/丹药列表.json';
import 炼丹师丹药 from '../resources/data/item/炼丹师丹药.json';
import 道具列表 from '../resources/data/item/道具列表.json';
import 功法列表 from '../resources/data/item/功法列表.json';
import 草药列表 from '../resources/data/item/草药列表.json';
import 地点列表 from '../resources/data/item/地点列表.json';
import 洞天福地 from '../resources/data/item/洞天福地.json';
import 宗门秘境 from '../resources/data/item/宗门秘境.json';
import 禁地列表 from '../resources/data/item/禁地列表.json';
import 仙境列表 from '../resources/data/item/仙境列表.json';
import 限定仙府 from '../resources/data/Timelimit/限定仙府.json';
import 限定功法 from '../resources/data/Timelimit/限定功法.json';
import 限定装备 from '../resources/data/Timelimit/限定装备.json';
import 限定丹药 from '../resources/data/Timelimit/限定丹药.json';
import 职业列表 from '../resources/data/occupation/职业列表.json';
import experience from '../resources/data/occupation/experience.json';
import 炼丹配方 from '../resources/data/occupation/炼丹配方.json';
import 装备图纸 from '../resources/data/occupation/装备图纸.json';
import 八品 from '../resources/data/item/八品.json';
import 星阁拍卖行列表 from '../resources/data/item/星阁拍卖行列表.json';
import 天地堂 from '../resources/data/item/天地堂.json';
import 常驻仙宠 from '../resources/data/item/常驻仙宠.json';
import 仙宠列表 from '../resources/data/item/仙宠列表.json';
import 仙宠口粮列表 from '../resources/data/item/仙宠口粮列表.json';
import npc列表 from '../resources/data/item/npc列表.json';
import shop列表 from '../resources/data/item/shop列表.json';
import 青龙 from '../resources/data/Timelimit/青龙.json';
import 麒麟 from '../resources/data/Timelimit/麒麟.json';
import 玄武朱雀白虎 from '../resources/data/Timelimit/玄武朱雀白虎.json';
import 魔界列表 from '../resources/data/item/魔界列表.json';
import 兑换列表 from '../resources/data/item/兑换列表.json';
import 神界列表 from '../resources/data/item/神界列表.json';
import 技能列表1 from '../resources/data/item/技能列表1.json';
import 技能列表2 from '../resources/data/item/技能列表2.json';
import 强化列表 from '../resources/data/item/强化列表.json';
import 锻造材料 from '../resources/data/item/锻造材料.json';
import 锻造武器 from '../resources/data/item/锻造武器.json';
import 锻造护具 from '../resources/data/item/锻造护具.json';
import 锻造宝物 from '../resources/data/item/锻造宝物.json';
import 隐藏灵根 from '../resources/data/item/隐藏灵根.json';
import 锻造杂类 from '../resources/data/item/锻造杂类.json';
import 技能列表 from '../resources/data/item/技能列表.json';
import updateRecord from '../resources/data/updateRecord.json';
import MonthMarket from '../resources/data/item/MothMarket.json';
import type { TalentItem, LevelStageItem, PhysiqueStageItem, CommodityItem, GongfaItem, EquipmentTuzhiItem, PetItem, PetFoodItem } from '../types/data';
import type {
  MonsterItem,
  PlaceItem,
  SecretAreaItem,
  AuctionItem,
  EquipmentItem,
  DanyaoFullItem,
  NPCGroupItem,
  ShopItem,
  RealmShopGroupItem
} from '../types/data_extra';
import type { ScoreShopItem, LimitedEquipItem, OccupationItem, DanfangItem, BapinItem, HallItem, PermanentPetItem, SkillItem } from '../types/data_extra';
import { __PATH } from './keys.js';
import { getIoRedis } from '@alemonjs/db';

export const DATA_LIST = {
  // 使用英文名
  Talent: 灵根列表,
  Monster: 怪物列表,
  Commodity: 商品列表,
  Level1: 练气境界,
  ScoreShop: 积分商城,
  Level2: 炼体境界,
  Equipment: 装备列表,
  Danyao: 丹药列表,
  NewDanyao: 炼丹师丹药,
  Daoju: 道具列表,
  Gongfa: 功法列表,
  Caoyao: 草药列表,
  Didian: 地点列表,
  Bless: 洞天福地,
  GuildSecrets: 宗门秘境,
  ForbiddenArea: 禁地列表,
  FairyRealm: 仙境列表,
  TimePlace: 限定仙府,
  TimeGongfa: 限定功法,
  TimeEquipment: 限定装备,
  TimeDanyao: 限定丹药,
  Occupation: 职业列表,
  experience,
  Danfang: 炼丹配方,
  Tuzhi: 装备图纸,
  Bapin: 八品,
  Xingge: 星阁拍卖行列表,
  Tianditang: 天地堂,
  Changzhuxianchon: 常驻仙宠,
  Xianchon: 仙宠列表,
  Xianchonkouliang: 仙宠口粮列表,
  NPC: npc列表,
  Shop: shop列表,
  Qinglong: 青龙,
  Qilin: 麒麟,
  Xuanwu: 玄武朱雀白虎,
  Mojie: 魔界列表,
  ExchangeItem: 兑换列表,
  Shenjie: 神界列表,
  Jineng1: 技能列表1,
  Jineng2: 技能列表2,
  Qianghua: 强化列表,
  Duanzhaocailiao: 锻造材料,
  Duanzhaowuqi: 锻造武器,
  Duanzhaohuju: 锻造护具,
  Duanzhaobaowu: 锻造宝物,
  Yincang: 隐藏灵根,
  Zalei: 锻造杂类,
  Jineng: 技能列表,
  UpdateRecord: updateRecord,
  MonthMarket: MonthMarket
};

export type DataList = typeof DATA_LIST;

export type DataListKeys = keyof typeof DATA_LIST;

export const hasDataList = (key: DataListKeys) => {
  return !!DATA_LIST[key];
};

/**
 *
 * @param key
 * @returns
 */
export const getDataList = async <T extends DataListKeys>(key: T): Promise<DataList[T]> => {
  const redis = getIoRedis();
  // 先判断 redis 有无，没有则读本地的
  const size = await redis.exists(key);

  if (size > 0) {
    try {
      const redisData = await redis.get(key);

      if (!redisData) {
        return DATA_LIST[key];
      }

      return JSON.parse(redisData);
    } catch (error) {
      logger.warn(`Failed to parse redis data for key ${key}: ${error}`);

      return DATA_LIST[key];
    }
  }

  return DATA_LIST[key];
};

/**
 * 写入则是直接写进 redis
 */
export const setDataList = async (key: keyof typeof DATA_LIST, data) => {
  const redis = getIoRedis();

  try {
    await redis.set(key, JSON.stringify(data));
  } catch (error) {
    logger.error(`Failed to set redis data for key ${key}: ${error}`);
  }
};

export default {
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

  /**
   * list 读取优化
   */

  talent_list: 灵根列表 as TalentItem[],
  monster_list: 怪物列表 as MonsterItem[],
  commodities_list: 商品列表 as CommodityItem[],
  Level_list: 练气境界 as LevelStageItem[],
  shitujifen: 积分商城 as ScoreShopItem[],
  LevelMax_list: 炼体境界 as PhysiqueStageItem[],
  equipment_list: 装备列表 as EquipmentItem[],
  danyao_list: 丹药列表 as DanyaoFullItem[],
  newdanyao_list: 炼丹师丹药 as DanyaoFullItem[],
  daoju_list: 道具列表 as CommodityItem[],
  gongfa_list: 功法列表 as GongfaItem[],
  caoyao_list: 草药列表 as CommodityItem[],
  didian_list: 地点列表 as PlaceItem[],
  bless_list: 洞天福地 as PlaceItem[],
  guildSecrets_list: 宗门秘境 as SecretAreaItem[],
  forbiddenarea_list: 禁地列表 as SecretAreaItem[],
  Fairyrealm_list: 仙境列表 as PlaceItem[],
  timeplace_list: 限定仙府 as PlaceItem[],
  timegongfa_list: 限定功法 as GongfaItem[],
  timeequipmen_list: 限定装备 as LimitedEquipItem[],
  timedanyao_list: 限定丹药 as DanyaoFullItem[],
  occupation_list: 职业列表 as OccupationItem[],
  occupation_exp_list: experience as Array<{
    id: number;
    name: string;
    experience: number;
    rate: number;
  }>,
  danfang_list: 炼丹配方 as DanfangItem[],
  tuzhi_list: 装备图纸 as EquipmentTuzhiItem[],

  npc_list: npc列表 as NPCGroupItem[],
  shop_list: shop列表 as ShopItem[],

  bapin: 八品 as BapinItem[],
  xingge: 星阁拍卖行列表 as AuctionItem[],
  tianditang: 天地堂 as HallItem[],
  changzhuxianchon: 常驻仙宠 as PermanentPetItem[],
  xianchon: 仙宠列表 as PetItem[],
  xianchonkouliang: 仙宠口粮列表 as PetFoodItem[],

  qinlong: 青龙 as RealmShopGroupItem[],
  qilin: 麒麟 as RealmShopGroupItem[],
  xuanwu: 玄武朱雀白虎 as RealmShopGroupItem[],
  mojie: 魔界列表 as RealmShopGroupItem[],
  /**
   * 技能列表 (待处理)
   */
  jineng1: 技能列表1 as SkillItem[],
  jineng2: 技能列表2 as SkillItem[],
  jineng: 技能列表 as SkillItem[]
};
