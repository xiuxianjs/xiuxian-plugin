import { renderComponentIsHtmlToBuffer } from 'jsxp';
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
import UserBody from '../resources/html/UserBody.js';
import RankingMoney from '../resources/html/ranking_money.js';
import RankingPower from '../resources/html/ranking_power.js';
import SearchForum from '../resources/html/searchforum.js';
import SecretPlace$1 from '../resources/html/secret_place.js';
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
import SecretPlace from '../resources/html/BlessPlace.js';
import SecretPlace$2 from '../resources/html/jindi.js';
import CombatResult from '../resources/html/CombatResult.js';
import { mkdirSync, writeFileSync } from 'fs';
import Message from '../resources/html/message.js';
import Monthcard from '../resources/html/monthCard.js';
import Message$1 from '../resources/html/Message/index.js';

const map = {
    MessageBox: Message$1,
    help: Help,
    shituhelp: ShituHelp,
    log: Log,
    msg: Msg,
    player: Player,
    najie: Najie,
    association: Association,
    shifu: Shifu,
    temp: Temp,
    adminset: XiuxianSettings,
    danfang: Danfang,
    danyao: Danyao,
    daoju: Daoju,
    equipment: Equipment,
    fairyrealm: FairyRealm,
    forbidden_area: ForbiddenArea,
    immortal_genius: Immortal,
    genius: Genius,
    gongfa: Gongfa,
    ranking_money: RankingMoney,
    ranking_power: RankingPower,
    searchforum: SearchForum,
    shitu: Shitu,
    shitujifen: Shitujifen,
    state: State,
    statemax: StateMax,
    time_place: TimePlace,
    tuzhi: Tuzhi,
    updateRecord,
    valuables: Valuables,
    wuqi: WuQi,
    xianchong: XianChong,
    zongmeng: ZongMeng,
    shenbing: Shenbing,
    statezhiye: Statezhiye,
    ningmenghome: Ningmenghome,
    playercopy: UserBody,
    supermarket: Supermarket,
    forum: Forum,
    jindi: SecretPlace$2,
    sudoku: Sudoku,
    shop: Shop,
    moneyCheck: MoneyCheck,
    secret_place: SecretPlace$1,
    tianditang: TianDiTang,
    BlessPlace: SecretPlace,
    CombatResult,
    message: Message,
    Monthcard
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
        return await renderComponentIsHtmlToBuffer(component, data);
    }
    let hash = '';
    try {
        hash = md5(JSON.stringify(data));
    }
    catch {
        return await renderComponentIsHtmlToBuffer(component, data);
    }
    const cacheKey = `${keyBase}`;
    const existed = shotCache.get(cacheKey);
    if (existed && existed.hash === hash) {
        return existed.buffer;
    }
    const buffer = await renderComponentIsHtmlToBuffer(component, data);
    shotCache.set(cacheKey, { hash, buffer, at: Date.now() });
    if (shotCache.size > 200) {
        const entries = [...shotCache.entries()].sort((a, b) => a[1].at - b[1].at);
        for (let i = 0; i < 50; i++) {
            const k = entries[i]?.[0];
            if (k) {
                shotCache.delete(k);
            }
        }
    }
    return buffer;
}
var index = {
    screenshot
};

export { index as default, screenshot };
