// 更细化的补充数据类型，逐步替换 DataList 中的 Record<string, unknown>[]

export interface MonsterItem {
  id: number
  名号: string
  class: string // "怪物"
  type: string // 体型/分类，如 小型 大型
  攻击: number
  防御: number
  当前血量: number
  暴击率: number
  [k: string]: unknown
}

export interface EquipmentItem {
  id: number
  name: string
  class: '装备'
  type: string // 武器 护具 法宝 等
  atk: number
  def: number
  HP: number
  bao: number
  出售价?: number
  [k: string]: unknown
}

export interface DanyaoFullItem {
  id: number
  name: string
  class: '丹药'
  type: string // 血气/修为/其它分类
  xueqi?: number
  exp?: number
  出售价?: number
  [k: string]: unknown
}

export interface SimpleNamedItem {
  name?: string
  名号?: string
  class?: string
  type?: string
  [k: string]: unknown
}

export interface PlaceItem extends SimpleNamedItem {
  id?: number
  desc?: string
}

export interface SecretAreaItem extends SimpleNamedItem {
  等级限制?: number
  进入条件?: string
}

export interface AuctionItem extends SimpleNamedItem {
  出售价?: number
  pinji?: number | string
}

export interface StrengthenItem extends SimpleNamedItem {
  费用?: number
  目标?: string
}

export interface ForgingEquipItem extends SimpleNamedItem {
  品级?: string
  基础属性?: string
}

export interface HiddenTalentItem {
  name: string
  说明?: string
  [k: string]: unknown
}

export interface UpdateRecordItem {
  user: { name: string; avatar: string }
  text: string
  time: string
  [k: string]: unknown
}

export interface TalentRootRef {
  name: string
  法球倍率?: number
  [k: string]: unknown
}

export interface NPCLevelEntry {
  id: number
  name: string
  atk: number
  def: number
  blood: number
  baoji: number
  灵根?: TalentRootRef
  [k: string]: unknown
}

export interface NPCGroupItem {
  id: number
  name: string
  one?: NPCLevelEntry[]
  two?: NPCLevelEntry[]
  three?: NPCLevelEntry[]
  [k: string]: unknown
}

export interface ShopGoodsItem {
  name: string
  class: string
  数量: number
  [k: string]: unknown
}
export interface ShopItem {
  id: number
  name: string
  Grade: number
  state: number
  price: number
  one?: ShopGoodsItem[]
  two?: ShopGoodsItem[]
  three?: ShopGoodsItem[]
  [k: string]: unknown
}

export interface ExchangeThingItem {
  name: string
  class: string
  数量: number
  [k: string]: unknown
}
export interface ExchangeItem {
  name: string
  thing: ExchangeThingItem[]
  [k: string]: unknown
}

export interface RealmShopGoods {
  id: number
  name: string
  class: string
  type?: string
  desc?: string
  修炼加成?: number
  出售价?: number
  [k: string]: unknown
}
export interface RealmShopGroupItem {
  name: string
  one?: RealmShopGoods[]
  two?: RealmShopGoods[]
  three?: RealmShopGoods[]
  [k: string]: unknown
}

export interface ScoreShopItem {
  id: number
  name: string
  class: string
  type?: string
  desc?: string
  积分: number
  xueqi?: number
  exp?: number
  [k: string]: unknown
}

export interface LimitedEquipItem {
  id: number
  name: string
  class: string // 装备/法宝等
  type: string
  atk?: number
  def?: number
  HP?: number
  bao?: number
  出售价?: number
  [k: string]: unknown
}

export interface OccupationItem {
  id?: number
  name: string
  type?: string
  desc?: string
  经验加成?: number
  [k: string]: unknown
}

export interface DanfangItem {
  id?: number
  name: string
  需要材料?: string
  成功概率?: number
  品级?: string
  [k: string]: unknown
}

export interface BapinItem {
  id?: number
  name: string
  class?: string
  type?: string
  [k: string]: unknown
}

export interface HallItem {
  id?: number
  name: string
  class?: string
  type?: string
  desc?: string
  [k: string]: unknown
}

export interface PermanentPetItem {
  id?: number
  name: string
  class: string
  type?: string
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
  [k: string]: unknown
}

export interface SkillItem {
  id?: number
  name: string
  class?: string
  type?: string
  desc?: string
  伤害倍率?: number
  冷却?: number
  [k: string]: unknown
}
