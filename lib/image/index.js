import { renderComponentToBuffer } from 'jsxp';
import XiuxianSettings from '../resources/html/adminset/adminset.js';
import Association from '../resources/html/association/association.js';
import Danfang from '../resources/html/danfang/danfang.js';
import Danyao from '../resources/html/danyao/danyao.js';
import Daoju from '../resources/html/daoju/daoju.js';
import Equipment from '../resources/html/equipment/equipment.js';
import FairyRealm from '../resources/html/fairyrealm/fairyrealm.js';
import ForbiddenArea from '../resources/html/forbidden_area/forbidden_area.js';
import Forum from '../resources/html/forum/forum.js';
import Genius from '../resources/html/genius/genius.js';
import Gongfa from '../resources/html/gongfa/gongfa.js';
import Help from '../resources/html/help/help.js';
import Immortal from '../resources/html/Immortal/genius.js';
import Log from '../resources/html/log/log.js';
import MoneyCheck from '../resources/html/moneyCheck/moneyCheck.js';
import Msg from '../resources/html/msg/msg.js';
import Najie from '../resources/html/najie/najie.js';
import Ningmenghome from '../resources/html/ningmenghome/ningmenghome.js';
import Player from '../resources/html/player/player.js';
import PlayerCopy from '../resources/html/playercopy/playercopy.js';
import RankingMoney from '../resources/html/ranking_money/ranking_money.js';
import RankingPower from '../resources/html/ranking_power/ranking_power.js';
import SearchForum from '../resources/html/searchforum/searchforum.js';
import SecretPlace$2 from '../resources/html/secret_place/secret_place.js';
import Shenbing from '../resources/html/shenbing/shenbing.js';
import Shifu from '../resources/html/shifu/shifu.js';
import Shitu from '../resources/html/shitu/shitu.js';
import ShituHelp from '../resources/html/shituhelp/shituhelp.js';
import Shitujifen from '../resources/html/shitujifen/shitujifen.js';
import Shop from '../resources/html/shop/shop.js';
import State from '../resources/html/state/state.js';
import StateMax from '../resources/html/statemax/statemax.js';
import Statezhiye from '../resources/html/statezhiye/statezhiye.js';
import Sudoku from '../resources/html/sudoku/sudoku.js';
import Supermarket from '../resources/html/supermarket/supermarket.js';
import Talent from '../resources/html/talent/talent.js';
import Temp from '../resources/html/temp/temp.js';
import TianDiTang from '../resources/html/tianditang/tianditang.js';
import TimePlace from '../resources/html/time_place/time_place.js';
import TuJian from '../resources/html/tujian/tujian.js';
import Tuzhi from '../resources/html/tuzhi/tuzhi.js';
import Valuables from '../resources/html/valuables/valuables.js';
import WuQi from '../resources/html/wuqi/wuqi.js';
import XianChong from '../resources/html/xianchong/xianchong.js';
import ZongMeng from '../resources/html/zongmeng/zongmeng.js';
import updateRecord from '../resources/html/updateRecord/updateRecord.js';
import SecretPlace$1 from '../resources/html/BlessPlace/BlessPlace.js';
import SecretPlace from '../resources/html/jindi/jindi.js';

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
    talent: Talent,
    temp: Temp,
    tianditang: TianDiTang,
    time_place: TimePlace,
    tujian: TuJian,
    tuzhi: Tuzhi,
    valuables: Valuables,
    wuqi: WuQi,
    xianchong: XianChong,
    zongmeng: ZongMeng,
    updateRecord,
    BlessPlace: SecretPlace$1,
    jindi: SecretPlace
};
class Pic {
    async screenshot(name, uid, data) {
        return await renderComponentToBuffer(`data/${name}/${uid}`, map[name], data);
    }
}
var puppeteer = new Pic();

export { puppeteer as default };
