// 任务/action 相关的通用类型定义
export interface PlaceThing {
  name: string
  class: string
  pinji?: string | number
  数量?: number
}

export interface PlaceAddress {
  name: string
  Grade?: number
  one?: PlaceThing[]
  two?: PlaceThing[]
  three?: PlaceThing[]
}

export interface ActionPlayerLite {
  名号: string
  攻击: number
  防御: number
  当前血量: number
  暴击率?: number
  灵根?: { 法球倍率?: number; [k: string]: any }
  仙宠?: { type?: string; [k: string]: any }
  level_id?: number
  Physique_id?: number
  幸运?: number
  addluckyNo?: number
  islucky?: number
  血量上限?: number
  [k: string]: any
}

export interface ActionState {
  group_id?: string
  end_time: number
  time?: number | string
  action?: string
  shutup?: number | string
  working?: number | string
  power_up?: number | string
  Place_action?: string | number
  Place_actionplus?: string | number
  Place_address?: PlaceAddress
  plant?: string | number
  mine?: string | number
  cishu?: number
  xijie?: string | number
  A_player?: ActionPlayerLite
  thing?: PlaceThing[]
  [k: string]: any
}

export interface SecretPlacePlusItem {
  name: string
  class: string
}
export interface SecretPlacePlusAddress {
  name: string
  one: SecretPlacePlusItem[]
  two: SecretPlacePlusItem[]
  three: SecretPlacePlusItem[]
}
export interface SecretPlacePlusAction extends ActionState {
  Place_actionplus?: number | string
  Place_address?: SecretPlacePlusAddress
  cishu: number
}
export interface MonsterLike {
  名号: string
  攻击: number
  防御: number
  当前血量: number
  暴击率: number
}
export interface ShenjieTierItem {
  name: string
  class: string
}
export interface ShenjiePlace {
  one: ShenjieTierItem[]
  two: ShenjieTierItem[]
  three: ShenjieTierItem[]
}
