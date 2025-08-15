import { __PATH } from './paths.js';
import { createRequire } from 'module';

const 体质概率 = 0.2;
const 伪灵根概率 = 0.37;
const 真灵根概率 = 0.29;
const 天灵根概率 = 0.08;
const 圣体概率 = 0.01;
const filePathMap = {
    player: __PATH.player_path,
    equipment: __PATH.equipment_path,
    najie: __PATH.najie_path,
    lib: __PATH.lib_path,
    Timelimit: __PATH.Timelimit,
    Level: __PATH.Level,
    association: __PATH.association,
    occupation: __PATH.occupation
};
const GAME_KEY = 'xiuxian@1.3.0:system:money_game';
const require = createRequire(import.meta.url);
const pkg = require('../../package.json');
const baseKey = 'xiuxian@1.3.0';
const NAJIE_CATEGORIES = [
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
];

export { GAME_KEY, NAJIE_CATEGORIES, baseKey, filePathMap, pkg, 伪灵根概率, 体质概率, 圣体概率, 天灵根概率, 真灵根概率 };
