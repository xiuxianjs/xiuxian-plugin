import { NajieCategory } from '@src/types';
import { __PATH } from './keys';
import { createRequire } from 'module';
import {
  GAME_KEY,
  KEY_RECORD,
  KEY_RECORD_TWO,
  KEY_WORLD_BOOS_STATUS,
  KEY_WORLD_BOOS_STATUS_TWO
} from './constants';

// 概率常量保持与原文件一致
export const 体质概率 = 0.2;
export const 伪灵根概率 = 0.37;
export const 真灵根概率 = 0.29;
export const 天灵根概率 = 0.08;
export const 圣体概率 = 0.01;

export const filePathMap = {
  player: __PATH.player_path,
  equipment: __PATH.equipment_path,
  najie: __PATH.najie_path
};

const require = createRequire(import.meta.url);

export const pkg = require('../../package.json') as {
  name: string;
  version: string;
};

// 重新导出常量
export { GAME_KEY, KEY_RECORD, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS, KEY_WORLD_BOOS_STATUS_TWO };

export const NAJIE_CATEGORIES: readonly NajieCategory[] = [
  '装备',
  '丹药',
  '道具',
  '功法',
  '草药',
  '材料',
  '仙宠',
  '仙宠口粮'
] as const;
