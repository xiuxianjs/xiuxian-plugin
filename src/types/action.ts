// 任务/action 相关的通用类型定义
export interface PlaceThing {
  name: string;
  class: string;
  pinji?: string | number;
  数量?: number;
}

export interface PlaceAddress {
  name: string;
  Grade?: number;
  one?: PlaceThing[];
  two?: PlaceThing[];
  three?: PlaceThing[];
}

export interface ActionPlayerLite {
  名号: string;
  攻击: number;
  防御: number;
  当前血量: number;
  暴击率?: number;
  灵根?: { 法球倍率?: number };
  仙宠?: { type?: string };
  level_id?: number;
  Physique_id?: number;
  幸运?: number;
  addluckyNo?: number;
  islucky?: number;
  血量上限?: number;
}

export interface SecretPlacePlusItem {
  name: string;
  class: string;
}
export interface SecretPlacePlusAddress {
  name: string;
  one: SecretPlacePlusItem[];
  two: SecretPlacePlusItem[];
  three: SecretPlacePlusItem[];
}

// 约定：字符串 '0' 表示开启中的状态；'1' 表示关闭或空闲（保持与现有代码一致）
export interface ActionRecord {
  action: string; // 动作名称
  end_time: number; // 截止时间戳 (ms)
  time: number; // 持续时长 (ms)
  // 下面是各类状态开关，历史代码中使用字符串 '0' | '1'
  plant?: '0' | '1';
  shutup?: '0' | '1';
  working?: '0' | '1';
  Place_action?: '0' | '1';
  Place_actionplus?: '0' | '1';
  power_up?: '0' | '1';
  mojie?: '0' | '1';
  xijie?: '0' | '1';
  mine?: '0' | '1';
  cishu?: number;
  group_id?: string;
  // 位置/秘境等扩展信息
  Place_address?: string;
  is_jiesuan?: number;
  // 允许额外字段（保持兼容），使用 unknown 再在使用点断言
  playerA?: ActionPlayerLite;
  thing?: PlaceThing[];
}

export interface MonsterLike {
  名号: string;
  攻击: number;
  防御: number;
  当前血量: number;
  暴击率: number;
}
export interface ShenjieTierItem {
  name: string;
  class: string;
}
export interface ShenjiePlace {
  one: ShenjieTierItem[];
  two: ShenjieTierItem[];
  three: ShenjieTierItem[];
}
