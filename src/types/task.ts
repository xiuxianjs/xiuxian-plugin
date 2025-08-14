// 任务目录专用的补充类型 (不修改现有任务源码，只提供更精细的声明)
// 若后续需要在任务文件中应用，可按需导入。

import type { TalentInfo } from './player'
import type { ActionState, PlaceThing, PlaceAddress } from './action'
import type { ShopItem } from './data_extra'
import type { Player } from './player'

/****************************** 公共辅助 ******************************/
/** 任务阶段统一时间戳（毫秒） */
export type Timestamp = number
/** 用户 ID / QQ ID */
export type UserId = string | number
/** 群组 ID */
export type GroupId = string | number

/****************************** 拍卖 (AuctionofficialTask) ******************************/
export interface AuctionThing {
  name: string
  class: string
  pinji?: string | number
  [k: string]: any
}
/** 拍卖运行期缓存结构（Redis: xiuxian:AuctionofficialTask） */
export interface AuctionSession {
  thing: AuctionThing // 拍卖物品
  amount: number // 数量
  last_offer_player: number // 最后一次出价玩家 QQ
  last_price: number // 当前最高价
  last_offer_price: number // 最后一笔出价发生的时间戳（命名沿用旧字段）
  groupList: GroupId[] // 需要广播的群
  [k: string]: any
}

export type NajieCategory =
  | '装备'
  | '丹药'
  | '道具'
  | '功法'
  | '草药'
  | '材料'
  | '仙宠'
  | '仙宠口粮'

/****************************** 交易 / 论坛 (ExchangeTask / ForumTask) ******************************/
export interface ExchangeEntry {
  now_time: Timestamp
  qq: string
  aconut: number // 数量（原拼写保留）
  name: {
    name: string
    class: NajieCategory
    pinji?: string
    [k: string]: any
  }
}
export interface ForumEntry {
  now_time: Timestamp
  qq: string
  whole: number // 灵石数量
  [k: string]: any
}

/****************************** 洗劫 / 逃跑 流程 (Xijietask / Taopaotask) ******************************/
/** 洗劫阶段：0=准备/战斗判定，-1=搜刮，-2=逃跑，1=结束关闭 */
export type RaidPhase = '-2' | '-1' | '0' | '1' | -2 | -1 | 0 | 1 | number
export interface RaidLoot extends PlaceThing {
  数量: number
}
// 使用交叉+局部重定义以兼容 ActionState 中宽泛 A_player.灵根 定义
export interface RaidActionState extends Omit<ActionState, 'A_player'> {
  xijie?: RaidPhase
  /** 当前目标据点简单信息 */
  Place_address?: { name: string; Grade: number }
  /** 参与战斗的玩家快照（与任务中构造的 A_player 一致） */
  A_player?: {
    名号: string
    攻击: number
    防御: number
    当前血量: number
    魔值?: number
    暴击率?: number
    灵根?: TalentInfo | { 法球倍率?: number; name?: string; type?: string }
  }
  /** 已在二阶段或三阶段收集到的物品 */
  thing?: RaidLoot[]
  /** 剩余判定次数（逃跑/追击回合） */
  cishu?: number
}

/****************************** 魔界 / 神界 探索 (mojietask / shenjietask) ******************************/
/** 探索阶段：0=进行中(多次结算), -1=特殊神界模式, 1=结束 */
export type ExplorePhase = '-1' | '0' | '1' | -1 | 0 | 1 | number
export interface ExploreActionState extends ActionState {
  mojie?: ExplorePhase // 兼容 shenjietask 里使用同字段做阶段控制
  cishu?: number // 剩余次数
}

/****************************** 秘境 探索 (SecretPlaceTask / SecretPlaceplusTask) ******************************/
export interface SecretPlaceAddress extends PlaceAddress {
  Grade?: number
  one?: PlaceThing[]
  two?: PlaceThing[]
  three?: PlaceThing[]
}
export interface SecretPlaceActionState extends ActionState {
  Place_action?: string | number // 普通秘境执行中标识
  Place_actionplus?: string | number // PLUS/多次探索模式标识
  Place_address?: SecretPlaceAddress
  cishu?: number // plus 模式剩余次数
}

/****************************** 职业 / 闭关 / 采矿 (OccupationTask / PlayerControlTask) ******************************/
export interface OccupationActionState extends ActionState {
  plant?: string | number // 种植 / 炼丹师特殊闭关扩展
  mine?: string | number // 采矿状态
}

/****************************** 临时消息 (msgTask / 探索多次写入 temp) ******************************/
export interface TempMessage {
  /** 文本内容 */
  msg?: string
  /** 群号（消息聚合依据） */
  qq_group?: string
  /** 个人 QQ（早期结构保留） */
  qq?: string | number
  [k: string]: any
}

/****************************** 商店动态 (Taopaotask / Shoptask / ShopGradetask) ******************************/
// 扩展 ShopItem 时改用可选并复用原 ShopGoodsItem 结构
export type DynamicShopItem = ShopItem & {
  one?: ShopItem['one']
  two?: ShopItem['two']
  three?: ShopItem['three']
}

/****************************** 天地榜 (Tiandibang) ******************************/
/** 榜单条目基础结构（来自原 response/Tiandibang/Tiandibang/tian.ts） */
export interface TiandibangRow {
  名号: string
  境界: number
  攻击: number
  防御: number
  当前血量: number
  暴击率: number
  灵根: TalentInfo | Record<string, unknown>
  法球倍率?: number | string
  学习的功法
  魔道值: number
  神石: number
  qq: string
  次数: number
  积分: number
  [k: string]: any
}

export interface TiandibangRankEntry extends TiandibangRow {
  名号: string
  境界: number
  攻击: number
  防御: number
  当前血量: number
  暴击率: number
  灵根: Player['灵根']
  法球倍率?: number | string
  学习的功法: Player['学习的功法']
  魔道值: number
  神石: number
  qq: string
  次数: number
  积分: number
}

/****************************** 玩家综合控制 (PlayerControlTask) ******************************/
/**
 * PlayerControlTask 运行期间使用的综合动作状态扩展。
 * 包含闭关(shutup)/降妖(working)/渡劫(power_up)等基础字段（来源于 ActionState），
 * 以及旧逻辑中累积次数 acount（统计某些随机事件出现次数，继续保留以兼容）。
 */
export interface ControlActionState extends ActionState {
  /** 旧逻辑中的累积辅助计数（可能为随机事件触发次数） */
  acount?: number
}

/****************************** 世界 Boss (BOSS / BOSS2) ******************************/
/** 世界 Boss 当前状态 */
export interface WorldBossStatus {
  Health: number
  Healthmax: number
  /** -1 表示尚未被击杀，其它为击杀时间戳 */
  KilledTime: number
  Reward: number // 击杀奖励结算基数
  [k: string]: any
}
/** Boss 伤害排行临时记录结构 */
export interface WorldBossPlayerRecord {
  QQ: Array<string | number>
  TotalDamage: number[]
  Name: string[]
  [k: string]: any
}

/****************************** 商店日常 (ShopGradetask / Shoptask) ******************************/
/** 定时衰减/刷新时使用的最小商店槽位（只关心会被改写的字段） */
export interface ShopMutableSlot {
  name: string
  Grade?: number
  state?: number
  price?: number
  one?: Array<{ name: string; 数量: number; [k: string]: any }>
  two?: Array<{ name: string; 数量: number; [k: string]: any }>
  three?: Array<{ name: string; 数量: number; [k: string]: any }>
  [k: string]: any
}

/****************************** 备份任务 (BackUptask) ******************************/
/** 占位：未来若有备份元数据可在此扩展 */
export interface BackupTaskMeta {
  lastRun?: number
  [k: string]: any
}

/****************************** 汇总联合类型（如需在外部做窄化） ******************************/
export type AnyTaskActionState =
  | RaidActionState
  | ExploreActionState
  | SecretPlaceActionState
  | OccupationActionState
  | ControlActionState
  | ActionState // 兜底

/****************************** Type Guard 辅助 ******************************/
export function isRaidActionState(a): a is RaidActionState {
  return (
    !!a &&
    typeof a === 'object' &&
    ('xijie' in a || 'Place_address' in a) &&
    'end_time' in a
  )
}
export function isExploreActionState(a): a is ExploreActionState {
  return !!a && typeof a === 'object' && 'mojie' in a
}
export function isSecretPlaceActionState(a): a is SecretPlaceActionState {
  return (
    !!a &&
    typeof a === 'object' &&
    ('Place_action' in a || 'Place_actionplus' in a)
  )
}
export function isOccupationActionState(a): a is OccupationActionState {
  return !!a && typeof a === 'object' && ('plant' in a || 'mine' in a)
}
export function isControlActionState(a): a is ControlActionState {
  return !!a && typeof a === 'object' && 'acount' in a
}
