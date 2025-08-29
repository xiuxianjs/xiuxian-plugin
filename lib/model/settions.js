import { __PATH } from './keys.js';
export { GAME_KEY, KEY_RECORD, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS, KEY_WORLD_BOOS_STATUS_TWO } from './keys.js';
import { createRequire } from 'module';

const 体质概率 = 0.2;
const 伪灵根概率 = 0.37;
const 真灵根概率 = 0.29;
const 天灵根概率 = 0.08;
const 圣体概率 = 0.01;
const filePathMap = {
    player: __PATH.player_path,
    equipment: __PATH.equipment_path,
    najie: __PATH.najie_path
};
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');
const NAJIE_CATEGORIES = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];
const 宗门灵石池上限 = [2000000, 5000000, 8000000, 11000000, 15000000, 20000000, 25000000, 30000000];
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27];

export { NAJIE_CATEGORIES, filePathMap, pkg, 伪灵根概率, 体质概率, 圣体概率, 天灵根概率, 宗门人数上限, 宗门灵石池上限, 真灵根概率 };
