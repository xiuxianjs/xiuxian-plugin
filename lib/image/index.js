import { renderComponentToBuffer } from 'jsxp';
import md5 from 'md5';
import XiuxianSettings from '../resources/html/adminset.js';
import Association from '../resources/html/association.js';
import Danfang from '../resources/html/danfang.js';
import Danyao from '../resources/html/danyao.js';
import Daoju from '../resources/html/daoju.js';
import Equipment from '../resources/html/equipment.js';
import FairyRealm from '../resources/html/fairyrealm.js';
import ForbiddenArea from '../resources/html/forbidden_area.js';
import Forum from '../resources/html/forum.js';
import Genius from '../resources/html/genius.js';
import Gongfa from '../resources/html/gongfa.js';
import Help from '../resources/html/help.js';
import Immortal from '../resources/html/Immortal.js';
import Log from '../resources/html/log.js';
import MoneyCheck from '../resources/html/moneyCheck.js';
import Msg from '../resources/html/msg.js';
import Najie from '../resources/html/najie.js';
import Ningmenghome from '../resources/html/ningmenghome.js';
import Player from '../resources/html/User.js';
import PlayerCopy from '../resources/html/playercopy.js';
import RankingMoney from '../resources/html/ranking_money.js';
import RankingPower from '../resources/html/ranking_power.js';
import SearchForum from '../resources/html/searchforum.js';
import SecretPlace$2 from '../resources/html/secret_place.js';
import Shenbing from '../resources/html/shenbing.js';
import Shifu from '../resources/html/shifu.js';
import Shitu from '../resources/html/shitu.js';
import ShituHelp from '../resources/html/shituhelp.js';
import Shitujifen from '../resources/html/shitujifen.js';
import Shop from '../resources/html/shop.js';
import State from '../resources/html/state.js';
import StateMax from '../resources/html/statemax.js';
import Statezhiye from '../resources/html/statezhiye.js';
import Sudoku from '../resources/html/sudoku.js';
import Supermarket from '../resources/html/supermarket.js';
import Temp from '../resources/html/temp.js';
import TianDiTang from '../resources/html/tianditang.js';
import TimePlace from '../resources/html/time_place.js';
import Tuzhi from '../resources/html/tuzhi.js';
import Valuables from '../resources/html/valuables.js';
import WuQi from '../resources/html/wuqi.js';
import XianChong from '../resources/html/xianchong.js';
import ZongMeng from '../resources/html/zongmeng.js';
import updateRecord from '../resources/html/updateRecord.js';
import SecretPlace$1 from '../resources/html/BlessPlace.js';
import SecretPlace from '../resources/html/jindi.js';
import CombatResult from '../resources/html/CombatResult.js';
import { mkdirSync, writeFileSync } from 'fs';

const map = {
    adminset: XiuxianSettings,
    association: Association,
    danfang: Danfang,
    danyao: Danyao,
    daoju: Daoju,
    equipment: Equipment,
    fairyrealm: FairyRealm,
    forbidden_area: ForbiddenArea,
    forum: Forum,
    genius: Genius,
    gongfa: Gongfa,
    help: Help,
    immortal_genius: Immortal,
    log: Log,
    moneyCheck: MoneyCheck,
    msg: Msg,
    najie: Najie,
    ningmenghome: Ningmenghome,
    player: Player,
    playercopy: PlayerCopy,
    ranking_money: RankingMoney,
    ranking_power: RankingPower,
    searchforum: SearchForum,
    secret_place: SecretPlace$2,
    shenbing: Shenbing,
    shifu: Shifu,
    shitu: Shitu,
    shituhelp: ShituHelp,
    shitujifen: Shitujifen,
    shop: Shop,
    state: State,
    statemax: StateMax,
    statezhiye: Statezhiye,
    sudoku: Sudoku,
    supermarket: Supermarket,
    temp: Temp,
    tianditang: TianDiTang,
    time_place: TimePlace,
    tuzhi: Tuzhi,
    valuables: Valuables,
    wuqi: WuQi,
    xianchong: XianChong,
    zongmeng: ZongMeng,
    updateRecord,
    BlessPlace: SecretPlace$1,
    jindi: SecretPlace,
    CombatResult
};
const shotCache = new Map();
async function screenshot(name, uid, data, enableCache = false) {
    const keyBase = `data/${name}/${uid}`;
    if (process.env.NODE_ENV === 'development') {
        const dir = './views';
        mkdirSync(dir, { recursive: true });
        writeFileSync(`${dir}/${name}.json`, JSON.stringify(data, null, 2));
    }
    const component = map[name];
    if (!enableCache) {
        return await renderComponentToBuffer(keyBase, component, data);
    }
    let hash = '';
    try {
        hash = md5(JSON.stringify(data));
    }
    catch {
        return await renderComponentToBuffer(keyBase, component, data);
    }
    const cacheKey = `${keyBase}`;
    const existed = shotCache.get(cacheKey);
    if (existed && existed.hash === hash) {
        return existed.buffer;
    }
    const buffer = await renderComponentToBuffer(keyBase, component, data);
    shotCache.set(cacheKey, { hash, buffer, at: Date.now() });
    if (shotCache.size > 200) {
        const entries = [...shotCache.entries()].sort((a, b) => a[1].at - b[1].at);
        for (let i = 0; i < 50; i++) {
            const k = entries[i]?.[0];
            if (k)
                shotCache.delete(k);
        }
    }
    return buffer;
}
var index = {
    screenshot
};

export { index as default, screenshot };
