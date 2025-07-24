import { renderComponentToBuffer } from 'jsxp'
import adminset from '../resources/html/adminset/adminset'
import association from '../resources/html/association/association'
import danfang from '../resources/html/danfang/danfang'
import danyao from '../resources/html/danyao/danyao'
import daoju from '../resources/html/daoju/daoju'
import equipment from '../resources/html/equipment/equipment'
import fairyrealm from '../resources/html/fairyrealm/fairyrealm'
import forbidden_area from '../resources/html/forbidden_area/forbidden_area'
import forum from '../resources/html/forum/forum'
import genius from '../resources/html/genius/genius'
import gongfa from '../resources/html/gongfa/gongfa'
import help from '../resources/html/help/help'
import immortal_genius from '../resources/html/Immortal/genius'
import log from '../resources/html/log/log'
import moneyCheck from '../resources/html/moneyCheck/moneyCheck'
import msg from '../resources/html/msg/msg'
import najie from '../resources/html/najie/najie'
import ningmenghome from '../resources/html/ningmenghome/ningmenghome'
import player from '../resources/html/player/player'
import playercopy from '../resources/html/playercopy/playercopy'
import ranking_money from '../resources/html/ranking_money/ranking_money'
import ranking_power from '../resources/html/ranking_power/ranking_power'
import searchforum from '../resources/html/searchforum/searchforum'
import secret_place from '../resources/html/secret_place/secret_place'
import shenbing from '../resources/html/shenbing/shenbing'
import shifu from '../resources/html/shifu/shifu'
import shitu from '../resources/html/shitu/shitu'
import shituhelp from '../resources/html/shituhelp/shituhelp'
import shitujifen from '../resources/html/shitujifen/shitujifen'
import shop from '../resources/html/shop/shop'
import state from '../resources/html/state/state'
import statemax from '../resources/html/statemax/statemax'
import statezhiye from '../resources/html/statezhiye/statezhiye'
import sudoku from '../resources/html/sudoku/sudoku'
import supermarket from '../resources/html/supermarket/supermarket'
import talent from '../resources/html/talent/talent'
import temp from '../resources/html/temp/temp'
import tianditang from '../resources/html/tianditang/tianditang'
import time_place from '../resources/html/time_place/time_place'
import tujian from '../resources/html/tujian/tujian'
import tuzhi from '../resources/html/tuzhi/tuzhi'
import valuables from '../resources/html/valuables/valuables'
import wuqi from '../resources/html/wuqi/wuqi'
import xianchong from '../resources/html/xianchong/xianchong'
import zongmeng from '../resources/html/zongmeng/zongmeng'
import updateRecord from '../resources/html/updateRecord/updateRecord'
const map = {
  adminset,
  association,
  danfang,
  danyao,
  daoju,
  equipment,
  fairyrealm,
  forbidden_area,
  forum,
  genius,
  gongfa,
  help,
  immortal_genius,
  log,
  moneyCheck,
  msg,
  najie,
  ningmenghome,
  player,
  playercopy,
  ranking_money,
  ranking_power,
  searchforum,
  secret_place,
  shenbing,
  shifu,
  shitu,
  shituhelp,
  shitujifen,
  shop,
  state,
  statemax,
  statezhiye,
  sudoku,
  supermarket,
  talent,
  temp,
  tianditang,
  time_place,
  tujian,
  tuzhi,
  valuables,
  wuqi,
  xianchong,
  zongmeng,
  updateRecord
}
class Pic {
  async screenshot(name: keyof typeof map, uid: number | string, data) {
    return await renderComponentToBuffer(`data/${name}/${uid}`, map[name], data)
  }
}
export default new Pic()
