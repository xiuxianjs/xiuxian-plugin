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
import type { SkillItem } from './data_extra'

// 新增：事件与消息相关类型、提取自 model/api 与 common
import type { DataMention } from 'alemonjs'

export type AnyIncomingEvent =
  | import('alemonjs').EventsMessageCreateEnum
  | import('alemonjs').PrivateEventMessageCreate
  | import('alemonjs').PublicEventInteractionCreate
  | import('alemonjs').PrivateEventInteractionCreate
export type MessageEnumsArray = ReturnType<typeof import('alemonjs').Text>[]
export type MessageInput = Buffer | string | Array<string | DataMention>

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
}
export interface ExchangeRecord {
  thing: ExchangeThingSnapshot
  price: number
  amount: number
  qq: string
  last_offer_player: number
}
export type ForumRecord = ExchangeRecord
// 新增：Image 视图层扩展条目类型
export interface ExchangeView extends ExchangeRecord {
  num?: number
  now_time: number
  name: ExchangeRecord['thing']
}
export interface ForumView extends ForumRecord {
  num?: number
  now_time: number
}

// 战斗
export interface BattleResult {
  msg: string[]
  A_xue: number
  B_xue: number
}
export interface BattleEntity {
  名号: string
  攻击: number
  防御: number
  当前血量: number
  暴击率: number
  灵根: { 法球倍率?: number; name?: string; type?: string } & Record<
    string,
    unknown
  >
  隐藏灵根?: { name: string }
  id?: string
  魔道值?: number
  level_id?: number
  神石?: number
  仙宠?: { type: string; 加成: number; name: string }
}

// 装备模块
export interface EquipmentModuleAPI {
  readEquipment(id: string): Promise<Equipment | null>
  writeEquipment(id: string, equipment: Equipment): Promise<void>
}

// 丹药模块（玩家拥有）
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
export interface TempRecord {}

// 进度 / 经验
export interface ExpRow {
  id: number
  experience: number
}
export interface LevelExpState {
  level: number
  exp: number
}

// 玩家效率（补充公式字段）
export interface PlayerEfficiencyResult {
  灵石每小时: number
  修为每小时: number
  阴德每小时: number
  公式?: { 灵石: string; 修为: string; 阴德: string }
}
// 新增：效率计算各项乘数分解
export interface EfficiencyFactors {
  levelMul: number
  physiqueMul: number
  talentMul: number
  gongfaMul: number
  petMul: number
  luckyMul: number
  customMul: number
}

// 经济增减
export interface EconomyDelta {
  coin?: number
  hp?: number
  exp?: number
  exp2?: number
  exp3?: number
  exp4?: number
}

// 骰子游戏
export interface DiceGameResult {
  win: boolean
  dice: number
}

// 玩家行为 / 时间与签到
export interface LastSignTime {
  Y: number
  M: number
  D: number
  h: number
  m: number
  s: number
}
export interface PlayerActionData {
  action: string
  time?: number
  end_time?: number
  plant?: {
    name: string
    start: number
    duration: number
  }
  mine?: { name: string; start: number; duration: number }
  is_jiesuan?: number
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

// 新增 NameListConfig 类型供 api.ts 复用。
export interface NameListConfig {
  whitecrowd: Array<string | number>
  blackid: Array<string | number>
}

// === 新增：Shop 模块相关类型 ===
export interface ShopThing {
  name: string
  数量: number
}
export interface ShopSlot {
  one: ShopThing[]
  name: string
}
export type ShopData = ShopSlot[]

// === 新增：Image 模块内部使用类型 ===
export type ScreenshotResult = Buffer | string | false | undefined
export interface NamedItem {
  name: string
  class?: string
  type?: string
}
export interface ExchangeEntry {
  num?: number
  now_time: number
  name: NamedItem
}
export interface ForumEntry {
  num?: number
  now_time: number
  class?: string
}
export interface PlayerStatus {
  action: string
  time: string | null
}
export type SendFn = (msg: unknown) => unknown
export interface AssociationInfo {
  宗主: string
  power: number
  最低加入境界: number
  副宗主: Record<string, string>
  长老: Record<string, string>
  内门弟子: Record<string, string>
  外门弟子: Record<string, string>
  维护时间: number
  宗门驻地: number | string
  宗门等级: number
  宗门神兽: string | number
}

// === 新增：Cultivation 模块 ===
export interface FoundThing {
  name: string
}

// === 新增：Pub 模块 ===
export type CustomRecord =
  | Array<Record<string, unknown>>
  | Record<string, unknown>

// === 新增：Redis 模块 ===
export type ActionType =
  | 'shangjing'
  | 'lastsign_time'
  | 'action'
  | 'game_action'
  | 'lastxijie_time'

// === 新增：DataControl 文件路径类型 ===
export type FilePathType =
  | 'player'
  | 'equipment'
  | 'najie'
  | 'lib'
  | 'Timelimit'
  | 'Level'
  | 'association'
  | 'occupation'

// === 新增：Repository ===
export interface NajieRepository {
  get(id: string): Promise<Najie | null>
  save(id: string, value: Najie): Promise<void>
  addLingShi(id: string, delta: number): Promise<number | null>
}
export interface OccupationExpRow {
  id: number
  experience: number
}
export interface PlayerRepository {
  get(id: string): Promise<Player | null>
  save(id: string, player: Player): Promise<void>
  exists(id: string): Promise<boolean>
  addOccupationExp(
    id: string,
    delta: number
  ): Promise<{ level: number; exp: number } | null>
}

// === Pets 模块辅助类型 ===
export interface SourcePetLike {
  name: string
  等级?: number
  初始加成?: number
  每级增加?: number
  加成?: number
}

// 在此补充 OwnedPetItem 类型（宠物在背包中的形态）
export interface OwnedPetItem {
  name: string
  class: '仙宠'
  等级: number
  每级增加: number
  加成: number
  数量: number
  islockd: number
}
export type PetList = OwnedPetItem[]

// === 新增：Money 模块风控类型 ===
export interface RiskProfile {
  forceLose: boolean
}

// === Battle 模块（原内部） ===
export interface Skill extends SkillItem {
  cnt: number
  pr: number
  msg1: string
  msg2: string
  beilv: number
  other: number
}
export type EquipmentSlots = '武器' | '护具' | '法宝'

// === Redis 辅助标量类型 ===
export type RedisScalar = string | null

// === 锻造/资源映射 LIB_MAP 相关泛型（duanzaofu.ts） ===
export const LIB_MAP = {
  npc列表: 'npc_list',
  shop列表: 'shop_list',
  丹药列表: 'danyao_list',
  仙境列表: 'Fairyrealm_list',
  仙宠列表: 'xianchon',
  仙宠口粮列表: 'xianchonkouliang',
  兑换列表: 'duihuan',
  八品: 'bapin',
  功法列表: 'gongfa_list',
  商品列表: 'commodities_list',
  地点列表: 'didian_list',
  天地堂: 'tianditang',
  宗门秘境: 'guildSecrets_list',
  常驻仙宠: 'changzhuxianchon',
  强化列表: 'qianghua',
  怪物列表: 'monster_list',
  技能列表: 'jineng',
  技能列表1: 'jineng1',
  技能列表2: 'jineng2',
  星阁拍卖行列表: 'xingge',
  洞天福地: 'bless_list',
  灵根列表: 'talent_list',
  炼丹师丹药: 'newdanyao_list',
  神界列表: 'shenjie',
  禁地列表: 'forbiddenarea_list',
  积分商城: 'shitujifen',
  草药列表: 'caoyao_list',
  装备列表: 'equipment_list',
  道具列表: 'daoju_list',
  锻造宝物: 'Duanzhaobaowu',
  锻造护具: 'Duanzhaohuju',
  锻造杂类: 'Zalei',
  锻造材料: 'Duanzhaocailiao',
  锻造武器: 'Duanzhaowuqi',
  隐藏灵根: 'Yincang',
  魔界列表: 'Mojie'
} as const
export type LibHumanReadable = keyof typeof LIB_MAP

// Najie 模块补充：装备与仙宠在纳戒中的结构化形态
export interface EquipmentLike extends NajieItem {
  atk?: number
  def?: number
  HP?: number
  bao?: number
  pinji?: number
  type?: '武器' | '护具' | '法宝'
}
export interface XianchongSource {
  name: string
  class?: string
  等级?: number
  每级增加?: number
  初始加成?: number
  加成?: number
}
export interface XianchongLike extends NajieItem {
  等级?: number
  每级增加?: number
  加成?: number
}
