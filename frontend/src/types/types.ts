export interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    levelDistribution: { [key: string]: number };
  };
  associations: {
    total: number;
    totalMembers: number;
    totalPower: number;
    totalLingshi: number;
  };
  najie: {
    total: number;
    totalLingshi: number;
    totalItems: number;
    categoryStats: { [key: string]: number };
  };
  rankings: {
    lastUpdate: string;
    topAssociations: TopAssociation[];
    topPlayers: TopPlayer[];
  };
  system: {
    uptime: string;
    lastBackup: string;
    activeTasks: number;
  };
}

export interface ConfigItem {
  key: string;
  name: string;
  value: string | number | boolean | unknown[];
  type: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description: string;
  category: string;
}

export interface ConfigCategory {
  name: string;
  icon: string;
  items: ConfigItem[];
}

export interface Association {
  name: string;
  宗门名称: string;
  宗门等级: number;
  宗主: string;
  power: number;
  所有成员: string[];
  副宗主: string[];
  长老: string[];
  内门弟子: string[];
  外门弟子: string[];
  灵石池: number;
  宗门驻地: string | number;
  宗门神兽: string | number;
  最低加入境界: number;
  创立时间: [string, number];
  维护时间: number;
  大阵血量: number;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    newToday: number;
    levelDistribution: { [key: string]: number };
  };
  associations: {
    total: number;
    totalMembers: number;
    totalPower: number;
    totalLingshi: number;
  };
  najie: {
    total: number;
    totalLingshi: number;
    totalItems: number;
    categoryStats: { [key: string]: number };
  };
  rankings: {
    lastUpdate: string;
    topAssociations: TopAssociation[];
    topPlayers: TopPlayer[];
  };
  system: {
    uptime: string;
    lastBackup: string;
    activeTasks: number;
  };
}

export interface TopPlayer {
  id: string;
  name: string;
  level: number;
  association?: string;
  power: number;
  rank: number;
}

export interface TopAssociation {
  id: string;
  name: string;
  members: number;
  power: number;
  lingshi: number;
  rank: number;
}

export interface NajieItem {
  name: string;
  grade?: string;
  pinji?: number;
  数量?: number;
  atk?: number;
  def?: number;
  HP?: number;
}

export interface Najie {
  userId: string;
  装备: NajieItem[];
  丹药: NajieItem[];
  道具: NajieItem[];
  功法: NajieItem[];
  草药: NajieItem[];
  材料: NajieItem[];
  仙宠: NajieItem[];
  仙宠口粮: NajieItem[];
  灵石: number;
  灵石上限?: number;
  等级?: number;
  // 损坏数据相关字段
  数据状态?: string;
  原始数据?: string;
  错误信息?: string;
}

export interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RankingItem {
  id: string;
  name: string;
  value: number;
  rank: number;
  extra?: any;
}

export interface RankingStats {
  lastUpdate: string;
  associationCount: number;
  playerCount: number;
  topAssociations: RankingItem[];
  topPlayers: RankingItem[];
}

export interface TaskInfo {
  name: string;
  description: string;
  schedule: string;
  status: 'running' | 'stopped' | 'error';
  lastRun?: string;
  nextRun?: string;
  type: 'system' | 'game' | 'maintenance';
}

export interface GameUser {
  id: string;
  名号: string;
  sex: string;
  宣言: string;
  avatar: string;
  level_id: number;
  Physique_id: number;
  race: number;
  修为: number;
  血气: number;
  灵石: number;
  灵根: {
    id: number;
    name: string;
    type: string;
    eff: number;
    法球倍率: number;
  };
  神石: number;
  favorability: number;
  breakthrough: boolean;
  linggen: unknown[];
  linggenshow: number;
  学习的功法: unknown[];
  修炼效率提升: number;
  连续签到天数: number;
  攻击加成: number;
  防御加成: number;
  生命加成: number;
  power_place: number;
  当前血量: number;
  lunhui: number;
  lunhuiBH: number;
  轮回点: number;
  occupation: unknown[];
  occupation_level: number;
  镇妖塔层数: number;
  神魄段数: number;
  魔道值: number;
  仙宠: unknown[];
  练气皮肤: number;
  装备皮肤: number;
  幸运: number;
  addluckyNo: number;
  师徒任务阶段: number;
  师徒积分: number;
  攻击: number;
  防御: number;
  血量上限: number;
  暴击率: number;
  暴击伤害: number;
  // 损坏数据相关字段
  数据状态?: string;
  原始数据?: string;
  错误信息?: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
  createdAt: number;
  lastLoginAt?: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    role: string;
    createdAt: number;
    lastLoginAt?: number;
  };
  token?: string;
}
