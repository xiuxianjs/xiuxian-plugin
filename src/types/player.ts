// 玩家相关类型定义

export interface TalentInfo {
  type: string
  name: string
  法球倍率: number | string
  eff?: number
}

export interface XianchongInfo {
  name: string
  type: string
  加成: number
  灵魂绑定?: number
}

export interface Player {
  名号: string
  level_id: number
  Physique_id: number
  修为: number
  灵石: number
  血气: number
  当前血量: number
  血量上限: number
  攻击: number
  防御: number
  攻击加成: number
  防御加成: number
  生命加成: number
  暴击率: number
  暴击伤害: number
  镇妖塔层数: number
  神魄段数: number
  favorability: number
  id?: string // 部分逻辑需要通过 id 读取装备
  神石?: number // 神石数量（战斗减伤判定使用）
  法球倍率?: number // 直接挂载在玩家上的法球倍率（部分旧代码直接访问）
  宣言?: string
  灵根: TalentInfo
  隐藏灵根?: TalentInfo
  仙宠: XianchongInfo
  学习的功法: any[]
  修炼效率提升: number
  宗门?: string | { 宗门名称: string; 职位: string }
  sex?: string
  linggenshow?: number
  power_place?: number
  锻造天赋?: number
  occupation?: any
  occupation_level?: number
  occupation_exp?: number
  // 幸运 / 魔道相关（在各任务与服用道具时使用）
  islucky?: number
  addluckyNo?: number
  幸运?: number
  魔道值?: number
  [key: string]: any // 添加索引签名以兼容动态属性
}

export interface Equipment {
  武器: EquipmentItem
  护具: EquipmentItem
  法宝: EquipmentItem
}

export interface EquipmentItem {
  atk: number
  def: number
  HP: number
  bao: number
  name?: string
  grade?: string
  pinji?: number
}

export interface NajieItem {
  name: string
  class: string
  acount?: number
  grade?: string
  pinji?: number
  出售价?: number
  数量?: number
  islockd?: number
  atk?: number
  def?: number
  HP?: number
  bao?: number
  type?: string
}

export interface Najie {
  仙宠: NajieItem[]
  道具: NajieItem[]
  丹药: NajieItem[]
  功法: NajieItem[]
  武器: NajieItem[]
  护具: NajieItem[]
  法宝: NajieItem[]
  材料: NajieItem[]
  草药: NajieItem[]
  装备: NajieItem[]
  灵石: number
  灵石上限?: number
  等级?: number
}

// 锻造炉相关类型
export interface Tripod {
  qq: string
  煅炉: number
  容纳量: number
  材料: string[]
  数量: number[]
  TIME: number
  时长: number
  状态: number
  预计时长: number
}

export interface StrandResult {
  style: { width: string }
  num: string
}

export interface DanyaoStatus {
  biguan: number
  biguanxl: number
  xingyun: number
  lianti: number
  ped: number
  modao: number
  beiyong1: number
  beiyong2: number
  beiyong3: number
  beiyong4: number
  beiyong5: number
}
