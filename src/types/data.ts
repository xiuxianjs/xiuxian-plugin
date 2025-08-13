// 自动生成/手工维护的全局数据资源类型映射
// 目的：为 data (DataList 实例) 提供类型提示，替换隐式 any 访问
// 本文件中 XiuxianDataShape 尽量覆盖 src/model/DataList 中出现的所有字段
// 如后续新增 JSON 资源，请同步在此补充，保持编译期可发现性

export interface LevelStageItem {
  level_id: number
  level: string
  exp: number
  [k: string]
}
export interface PhysiqueStageItem {
  level_id: number
  level: string
  exp: number
  [k: string]
}
export interface CommodityItem {
  name: string
  class: string
  type?: string
  出售价?: number
  pinji?: number
  [k: string]
}
export interface TalentItem {
  type: string
  name: string
  法球倍率?: number | string
  [k: string]
}
export interface GongfaItem {
  name: string
  class: string
  品级?: string
  type?: string
  [k: string]
}
// 旧的简单丹药条目定义（保留以兼容历史引用）
export interface DanyaoItemDef {
  name: string
  class: string
  品级?: string
  type?: string
  加成?: number
  pinji?: number
  [k: string]
}
export interface EquipmentTuzhiItem {
  name: string
  class?: string // 原始图纸 JSON 可能未包含 class
  进阶?: string
  pinji?: number
  [k: string]
}
export interface PetItem {
  id?: number
  name: string
  class: string
  type: string
  atk?: number
  def?: number
  HP?: number
  初始加成?: number
  每级增加?: number
  加成?: number
  灵魂绑定?: number
  品级?: string
  desc?: string
  等级?: number
  等级上限?: number
  获取难度?: number
  出售价?: number
  [k: string]
}
export interface PetFoodItem {
  name: string
  class: string
  加成?: number
  [k: string]
}
export interface ForgingMaterial {
  name: string
  class: string
  品级?: string
  [k: string]
}

// 兼容遗留：先前使用的 UnknownEntry 别名，如不再需要可在各文件直接替换为 Record<string,unknown>
// （保留注释，实际不再导出/使用，避免 lint 警告）
// type UnknownEntry = Record<string, unknown>

// 战斗技能列表（资源 /resources/data/item/技能列表*.json 内结构）
export interface BattleSkillItem {
  class: string
  cnt: number
  pr: number
  name: string
  msg1: string
  msg2: string
  beilv: number
  other: number
  [k: string]
}

// Update 记录
export interface UpdateRecordItemLite {
  user: { name: string; avatar: string }
  text: string
  time: string
  [k: string]
}

// 额外资源类型（与 data_extra.ts 做最小耦合，引入所需）
import type {
  MonsterItem,
  EquipmentItem,
  DanyaoFullItem,
  AuctionItem,
  PlaceItem,
  SecretAreaItem,
  StrengthenItem,
  ForgingEquipItem,
  HiddenTalentItem,
  UpdateRecordItem,
  NPCGroupItem,
  ShopItem,
  ExchangeItem,
  RealmShopGroupItem,
  ScoreShopItem,
  LimitedEquipItem,
  OccupationItem,
  DanfangItem,
  BapinItem,
  HallItem,
  PermanentPetItem,
  SkillItem
} from './data_extra'

export interface XiuxianDataShape {
  // 基础列表
  talent_list: TalentItem[]
  monster_list: MonsterItem[]
  commodities_list: CommodityItem[]
  Level_list: LevelStageItem[]
  LevelMax_list: PhysiqueStageItem[]
  equipment_list: EquipmentItem[]
  danyao_list: DanyaoFullItem[]
  newdanyao_list: DanyaoFullItem[]
  daoju_list: CommodityItem[]
  gongfa_list: GongfaItem[]
  caoyao_list: CommodityItem[]
  didian_list: PlaceItem[]
  bless_list: PlaceItem[]
  guildSecrets_list: SecretAreaItem[]
  forbiddenarea_list: SecretAreaItem[]
  Fairyrealm_list: PlaceItem[]
  timeplace_list: PlaceItem[]
  timegongfa_list: GongfaItem[]
  timeequipmen_list: LimitedEquipItem[]
  timedanyao_list: DanyaoFullItem[]
  occupation_list: OccupationItem[]
  occupation_exp_list: Array<{ id: number; name: string; experience: number }>
  danfang_list: DanfangItem[]
  tuzhi_list: EquipmentTuzhiItem[]
  // 拍卖 / 特殊商店
  shitujifen: ScoreShopItem[]
  bapin: BapinItem[]
  xingge: AuctionItem[]
  tianditang: HallItem[]
  changzhuxianchon: PermanentPetItem[]
  xianchon: PetItem[]
  xianchonkouliang: PetFoodItem[]
  npc_list: NPCGroupItem[]
  shop_list: ShopItem[]
  qinlong: RealmShopGroupItem[]
  qilin: RealmShopGroupItem[]
  xuanwu: RealmShopGroupItem[]
  mojie: RealmShopGroupItem[]
  duihuan: ExchangeItem[]
  shenjie: RealmShopGroupItem[]
  // 技能 / 强化 / 锻造
  jineng1: SkillItem[]
  jineng2: SkillItem[]
  qianghua: StrengthenItem[]
  duanzhaocailiao: ForgingMaterial[]
  duanzhaowuqi: ForgingEquipItem[]
  duanzhaohuju: ForgingEquipItem[]
  duanzhaobaowu: ForgingEquipItem[]
  yincang: HiddenTalentItem[]
  zalei: ForgingEquipItem[]
  jineng: SkillItem[]
  updateRecord: UpdateRecordItem[] | UpdateRecordItemLite[]
  // 兜底索引
  [k: string]
}

export type DataAccessor = XiuxianDataShape & { [k: string] }
