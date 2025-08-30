import { TalentInfo } from './player';

// 榜单条目类型（简化，只列出必需字段，允许附加动态属性）
export interface TiandibangRow {
  名号: string;
  境界: number;
  攻击: number;
  防御: number;
  当前血量: number;
  暴击率: number;
  灵根: TalentInfo | Record<string, unknown>;
  法球倍率?: number | string;
  学习的功法;
  魔道值: number;
  神石: number;
  qq: string;
  次数: number;
  积分: number;
}
