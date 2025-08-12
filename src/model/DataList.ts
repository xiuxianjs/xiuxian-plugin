import 灵根列表 from '../resources/data/item/灵根列表.json'
import 怪物列表 from '../resources/data/item/怪物列表.json'
import 商品列表 from '../resources/data/item/商品列表.json'
import 练气境界 from '../resources/data/Level/练气境界.json'
import 积分商城 from '../resources/data/item/积分商城.json'
import 炼体境界 from '../resources/data/Level/炼体境界.json'
import 装备列表 from '../resources/data/item/装备列表.json'
import 丹药列表 from '../resources/data/item/丹药列表.json'
import 炼丹师丹药 from '../resources/data/item/炼丹师丹药.json'
import 道具列表 from '../resources/data/item/道具列表.json'
import 功法列表 from '../resources/data/item/功法列表.json'
import 草药列表 from '../resources/data/item/草药列表.json'
import 地点列表 from '../resources/data/item/地点列表.json'
import 洞天福地 from '../resources/data/item/洞天福地.json'
import 宗门秘境 from '../resources/data/item/宗门秘境.json'
import 禁地列表 from '../resources/data/item/禁地列表.json'
import 仙境列表 from '../resources/data/item/仙境列表.json'
import 限定仙府 from '../resources/data/Timelimit/限定仙府.json'
import 限定功法 from '../resources/data/Timelimit/限定功法.json'
import 限定装备 from '../resources/data/Timelimit/限定装备.json'
import 限定丹药 from '../resources/data/Timelimit/限定丹药.json'
import 职业列表 from '../resources/data/occupation/职业列表.json'
import experience from '../resources/data/occupation/experience.json'
import 炼丹配方 from '../resources/data/occupation/炼丹配方.json'
import 装备图纸 from '../resources/data/occupation/装备图纸.json'
import 八品 from '../resources/data/item/八品.json'
import 星阁拍卖行列表 from '../resources/data/item/星阁拍卖行列表.json'
import 天地堂 from '../resources/data/item/天地堂.json'
import 常驻仙宠 from '../resources/data/item/常驻仙宠.json'
import 仙宠列表 from '../resources/data/item/仙宠列表.json'
import 仙宠口粮列表 from '../resources/data/item/仙宠口粮列表.json'
import npc列表 from '../resources/data/item/npc列表.json'
import shop列表 from '../resources/data/item/shop列表.json'
import 青龙 from '../resources/data/Timelimit/青龙.json'
import 麒麟 from '../resources/data/Timelimit/麒麟.json'
import 玄武朱雀白虎 from '../resources/data/Timelimit/玄武朱雀白虎.json'
import 魔界列表 from '../resources/data/item/魔界列表.json'
import 兑换列表 from '../resources/data/item/兑换列表.json'
import 神界列表 from '../resources/data/item/神界列表.json'
import 技能列表1 from '../resources/data/item/技能列表1.json'
import 技能列表2 from '../resources/data/item/技能列表2.json'
import 强化列表 from '../resources/data/item/强化列表.json'
import 锻造材料 from '../resources/data/item/锻造材料.json'
import 锻造武器 from '../resources/data/item/锻造武器.json'
import 锻造护具 from '../resources/data/item/锻造护具.json'
import 锻造宝物 from '../resources/data/item/锻造宝物.json'
import 隐藏灵根 from '../resources/data/item/隐藏灵根.json'
import 锻造杂类 from '../resources/data/item/锻造杂类.json'
import 技能列表 from '../resources/data/item/技能列表.json'
import updateRecord from '../resources/data/updateRecord.json'
import type {
  XiuxianDataShape,
  TalentItem,
  LevelStageItem,
  PhysiqueStageItem,
  CommodityItem,
  GongfaItem,
  EquipmentTuzhiItem,
  PetItem,
  PetFoodItem,
  ForgingMaterial
} from '../types/data'
import type {
  MonsterItem,
  PlaceItem,
  SecretAreaItem,
  AuctionItem,
  StrengthenItem,
  ForgingEquipItem,
  HiddenTalentItem,
  UpdateRecordItem,
  EquipmentItem,
  DanyaoFullItem,
  NPCGroupItem,
  ShopItem,
  ExchangeItem,
  RealmShopGroupItem
} from '../types/data_extra'
import type {
  ScoreShopItem,
  LimitedEquipItem,
  OccupationItem,
  DanfangItem,
  BapinItem,
  HallItem,
  PermanentPetItem,
  SkillItem
} from '../types/data_extra'
import { __PATH } from './paths.js'

// DataList 原始直接挂载各 JSON；这里加上显式类型，保持与 XiuxianDataShape 对应
export class DataList implements XiuxianDataShape {
  // 允许动态访问（原代码大量通过字符串下标访问）
  [k: string]: unknown
  player: string = __PATH.player_path
  equipment: string = __PATH.equipment_path
  najie: string = __PATH.najie_path
  lib: string = __PATH.lib_path
  association: string = __PATH.association
  occupation: string = __PATH.occupation
  lib_path: string = __PATH.lib_path
  Timelimit: string = __PATH.Timelimit
  Level: string = __PATH.Level
  Occupation: string = __PATH.occupation
  talent_list: TalentItem[] = 灵根列表 as TalentItem[]
  monster_list: MonsterItem[] = 怪物列表 as MonsterItem[]
  commodities_list: CommodityItem[] = 商品列表 as CommodityItem[]
  Level_list: LevelStageItem[] = 练气境界 as LevelStageItem[]
  shitujifen: ScoreShopItem[] = 积分商城 as ScoreShopItem[]
  LevelMax_list: PhysiqueStageItem[] = 炼体境界 as PhysiqueStageItem[]
  equipment_list: EquipmentItem[] = 装备列表 as EquipmentItem[]
  danyao_list: DanyaoFullItem[] = 丹药列表 as DanyaoFullItem[]
  newdanyao_list: DanyaoFullItem[] = 炼丹师丹药 as DanyaoFullItem[]
  daoju_list: CommodityItem[] = 道具列表 as CommodityItem[]
  gongfa_list: GongfaItem[] = 功法列表 as GongfaItem[]
  caoyao_list: CommodityItem[] = 草药列表 as CommodityItem[]
  didian_list: PlaceItem[] = 地点列表 as PlaceItem[]
  bless_list: PlaceItem[] = 洞天福地 as PlaceItem[]
  guildSecrets_list: SecretAreaItem[] = 宗门秘境 as SecretAreaItem[]
  forbiddenarea_list: SecretAreaItem[] = 禁地列表 as SecretAreaItem[]
  Fairyrealm_list: PlaceItem[] = 仙境列表 as PlaceItem[]
  timeplace_list: PlaceItem[] = 限定仙府 as PlaceItem[]
  timegongfa_list: GongfaItem[] = 限定功法 as GongfaItem[]
  timeequipmen_list: LimitedEquipItem[] = 限定装备 as LimitedEquipItem[]
  timedanyao_list: DanyaoFullItem[] = 限定丹药 as DanyaoFullItem[]
  occupation_list: OccupationItem[] = 职业列表 as OccupationItem[]
  occupation_exp_list = experience as Array<{
    id: number
    name: string
    experience: number
    rate: number
  }>
  danfang_list: DanfangItem[] = 炼丹配方 as DanfangItem[]
  tuzhi_list: EquipmentTuzhiItem[] = 装备图纸 as EquipmentTuzhiItem[]
  bapin: BapinItem[] = 八品 as BapinItem[]
  xingge: AuctionItem[] = 星阁拍卖行列表 as AuctionItem[]
  tianditang: HallItem[] = 天地堂 as HallItem[]
  changzhuxianchon: PermanentPetItem[] = 常驻仙宠 as PermanentPetItem[]
  xianchon: PetItem[] = 仙宠列表 as PetItem[]
  xianchonkouliang: PetFoodItem[] = 仙宠口粮列表 as PetFoodItem[]
  npc_list: NPCGroupItem[] = npc列表 as NPCGroupItem[]
  shop_list: ShopItem[] = shop列表 as ShopItem[]
  qinlong: RealmShopGroupItem[] = 青龙 as RealmShopGroupItem[]
  qilin: RealmShopGroupItem[] = 麒麟 as RealmShopGroupItem[]
  xuanwu: RealmShopGroupItem[] = 玄武朱雀白虎 as RealmShopGroupItem[]
  mojie: RealmShopGroupItem[] = 魔界列表 as RealmShopGroupItem[]
  duihuan: ExchangeItem[] = 兑换列表 as ExchangeItem[]
  shenjie: RealmShopGroupItem[] = 神界列表 as RealmShopGroupItem[]
  jineng1: SkillItem[] = 技能列表1 as SkillItem[]
  jineng2: SkillItem[] = 技能列表2 as SkillItem[]
  qianghua: StrengthenItem[] = 强化列表 as StrengthenItem[]
  duanzhaocailiao: ForgingMaterial[] = 锻造材料 as ForgingMaterial[]
  duanzhaowuqi: ForgingEquipItem[] = 锻造武器 as ForgingEquipItem[]
  duanzhaohuju: ForgingEquipItem[] = 锻造护具 as ForgingEquipItem[]
  duanzhaobaowu: ForgingEquipItem[] = 锻造宝物 as ForgingEquipItem[]
  yincang: HiddenTalentItem[] = 隐藏灵根 as HiddenTalentItem[]
  zalei: ForgingEquipItem[] = 锻造杂类 as ForgingEquipItem[]
  jineng: SkillItem[] = 技能列表 as SkillItem[]
  updateRecord: UpdateRecordItem[] = updateRecord as UpdateRecordItem[]
}

export default new DataList()
