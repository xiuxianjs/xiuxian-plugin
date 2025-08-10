// 汇总 src/model 下各模块的补充类型，便于外部引用与统一维护。
// 如新增模块，请在此补充导出（保持只含类型，不引入运行时代码）。

import type { Player, Equipment, Najie, NajieItem, Tripod } from './player'
import type {
  XiuxianDataShape,
  TalentItem,
  GongfaItem,
  EquipmentTuzhiItem,
  ForgingMaterial
} from './data'
import type {
  AuctionItem,
  DanyaoFullItem,
  EquipmentItem,
  ExchangeItem,
  ForgingEquipItem,
  HiddenTalentItem,
  MonsterItem,
  NPCGroupItem,
  OccupationItem,
  PlaceItem,
  RealmShopGroupItem,
  ScoreShopItem,
  SecretAreaItem,
  ShopItem,
  StrengthenItem,
  DanfangItem
} from './data_extra'
import type { AssociationData } from './domain'

// DataList 对外暴露的运行时实例类型（只读引用）
export interface IDataList extends XiuxianDataShape {
  player: string
  equipment: string
  najie: string
  lib: string
  association: string
  occupation: string
  lib_path: string
  Timelimit: string
  Level: string
  Occupation: string
  // 再次兜底
  [k: string]: unknown
}

// Redis 基础 JSON 递归结构
export type JSONPrimitive = string | number | boolean | null
export type JSONValue = JSONPrimitive | JSONValue[] | { [k: string]: JSONValue }
export type JSONData = { [k: string]: JSONValue } | JSONValue[]

// Association 模块
export interface AssociationAPI {
  getAssociation(name: string): Promise<AssociationData | 'error'>
  setAssociation(name: string, data: AssociationData): Promise<void>
}

// DataControl 模块（已废弃，对外仅保留旧签名类型，方便迁移）
export interface DataControlAPI {
  existData(file_path_type: string, file_name: string): Promise<boolean>
  getData(file_name: string, user_qq?: string): Promise<unknown>
  setData(file_name: string, user_qq: string | null, data: JSONData): void
}

// Najie / 背包相关
export type NajieCategory =
  | '装备'
  | '丹药'
  | '道具'
  | '功法'
  | '草药'
  | '材料'
  | '仙宠'
  | '仙宠口粮'

export interface NajieServiceAPI {
  updateBagThing(
    usr_qq: string,
    thing_name: string,
    thing_class: NajieCategory,
    thing_pinji: number | undefined,
    lock: number
  ): Promise<boolean>
  existNajieThing(
    usr_qq: string,
    thing_name: string,
    thing_class: NajieCategory,
    thing_pinji?: number
  ): Promise<number | false>
  addNajieThing(
    usr_qq: string,
    name: string | NajieItem,
    thing_class: NajieCategory,
    x: number,
    pinji?: number
  ): Promise<void>
}

// 交易 / 拍卖
export interface ExchangeThingSnapshot {
  name?: string
  名号?: string
  class?: string
  type?: string
  出售价?: number
  pinji?: number | string
  [k: string]: unknown
}
export interface ExchangeRecord {
  thing: ExchangeThingSnapshot
  start_price: number
  last_price: number
  amount: number
  last_offer_price: number
  last_offer_player: number | string
  groupList: string[]
  [k: string]: unknown
}

// 战斗
export interface BattleResult {
  msg: string[]
  A_xue: number
  B_xue: number
}

// 装备模块
export interface EquipmentModuleAPI {
  readEquipment(id: string): Promise<Equipment | null>
  writeEquipment(id: string, equipment: Equipment): Promise<void>
}

// 丹药模块
export interface DanyaoItem extends DanyaoFullItem {
  count: number
}
export interface DanyaoModuleAPI {
  readDanyao(userId: string): Promise<DanyaoItem[]>
  writeDanyao(userId: string, list: DanyaoItem[]): Promise<void>
}

// 师徒 / 亲密度 / 临时数据等简单声明（聚合）
export interface ShituRecord {
  师傅: string
  收徒: number
  未出师徒弟: number
  任务阶段: number
  renwu1: number
  renwu2: number
  renwu3: number
  师徒BOOS剩余血量: number
  已出师徒弟: string[]
  师徒?: string
}
export interface QinmiduRecord {
  QQ_A: string
  QQ_B: string
  亲密度: number
  婚姻: number
}
export interface TempRecord {
  [k: string]: unknown
}

// 进度 / 经验
export interface ExpRow {
  id: number
  experience: number
}
export interface LevelExpState {
  level: number
  exp: number
}

// 玩家效率
export interface PlayerEfficiencyResult {
  灵石每小时: number
  修为每小时: number
  阴德每小时: number
}

// setu
export interface SetuOptions {
  r18?: boolean
  keyword?: string
  num?: number
}
export interface SetuItem {
  pid: number
  title: string
  author: string
  url: string
  tags: string[]
  r18: boolean
}

// 通用导出集合（纯类型）
export type {
  Player,
  Equipment,
  Najie,
  Tripod,
  TalentItem,
  GongfaItem,
  AuctionItem,
  MonsterItem,
  EquipmentItem,
  DanyaoFullItem,
  ExchangeItem,
  ForgingEquipItem,
  HiddenTalentItem,
  NPCGroupItem,
  OccupationItem,
  PlaceItem,
  RealmShopGroupItem,
  ScoreShopItem,
  SecretAreaItem,
  ShopItem,
  StrengthenItem,
  DanfangItem,
  EquipmentTuzhiItem,
  ForgingMaterial
}
