import React from 'react'
import { defineConfig } from 'jsxp'
// 自动批量引入 views 下所有 json 和 html 组件
import BlessPlaceData from './views/BlessPlace.json'
import BlessPlace from '@src/resources/html/BlessPlace'
import danfangData from './views/danfang.json'
import Danfang from '@src/resources/html/danfang'
import danyaoData from './views/danyao.json'
import Danyao from '@src/resources/html/danyao'
import daojuData from './views/daoju.json'
import Daoju from '@src/resources/html/daoju'
import equipmentData from './views/equipment.json'
import Equipment from '@src/resources/html/equipment'
import forumData from './views/forum.json'
import Forum from '@src/resources/html/forum'
import gongfaData from './views/gongfa.json'
import Gongfa from '@src/resources/html/gongfa'
import helpData from './views/help.json'
import Help from '@src/resources/html/help'
import immortalGeniusData from './views/immortal_genius.json'
import ImmortalGenius from '@src/resources/html/genius'
import jindiData from './views/jindi.json'
import Jindi from '@src/resources/html/jindi'
import moneyCheckData from './views/moneyCheck.json'
import MoneyCheck from '@src/resources/html/moneyCheck'
import najieData from './views/najie.json'
import Najie from '@src/resources/html/najie'
import ningmenghomeData from './views/ningmenghome.json'
import Ningmenghome from '@src/resources/html/ningmenghome'
import playerData from './views/player.json'
import Player from '@src/resources/html/User'
import playercopyData from './views/playercopy.json'
import Playercopy from '@src/resources/html/playercopy'
import rankingMoneyData from './views/ranking_money.json'
import RankingMoney from '@src/resources/html/ranking_money'
import rankingPowerData from './views/ranking_power.json'
import RankingPower from '@src/resources/html/ranking_power'
import secretPlaceData from './views/secret_place.json'
import SecretPlace from '@src/resources/html/secret_place'
import shenbingData from './views/shenbing.json'
import Shenbing from '@src/resources/html/shenbing'
import stateData from './views/state.json'
import State from '@src/resources/html/state'
import statemaxData from './views/statemax.json'
import Statemax from '@src/resources/html/statemax'
import statezhiyeData from './views/statezhiye.json'
import Statezhiye from '@src/resources/html/statezhiye'
import supermarketData from './views/supermarket.json'
import Supermarket from '@src/resources/html/supermarket'
import tianditangData from './views/tianditang.json'
import Tianditang from '@src/resources/html/tianditang'
import tuzhiData from './views/tuzhi.json'
import Tuzhi from '@src/resources/html/tuzhi'
import updateRecordData from './views/updateRecord.json'
import UpdateRecord from '@src/resources/html/updateRecord'
import user from './views/user.json'
import User from '@src/resources/html/User'
import valuablesData from './views/valuables.json'
import Valuables from '@src/resources/html/valuables'
import wuqiData from './views/wuqi.json'
import Wuqi from '@src/resources/html/wuqi'
import xianchongData from './views/xianchong.json'
import Xianchong from '@src/resources/html/xianchong'
import zongmengData from './views/zongmeng.json'
import Zongmeng from '@src/resources/html/zongmeng'
import association from './views/association.json'
import Association from '@src/resources/html/association'
import adminset from './views/adminset.json'
import Adminset from '@src/resources/html/adminset'
import temp from './views/temp.json'
import Temp from '@src/resources/html/temp'
import combatResult from './views/CombatResult.json'
import CombatResult from '@src/resources/html/CombatResult'
export default defineConfig({
  routes: {
    '/combatResult': { component: <CombatResult {...combatResult} /> },
    '/temp': { component: <Temp {...temp} /> },
    '/adminset': { component: <Adminset {...adminset} /> },
    '/association': { component: <Association {...association} /> },
    '/BlessPlace': { component: <BlessPlace {...BlessPlaceData} /> },
    '/danfang': { component: <Danfang {...danfangData} /> },
    '/danyao': { component: <Danyao {...danyaoData} /> },
    '/daoju': { component: <Daoju {...daojuData} /> },
    '/equipment': { component: <Equipment {...equipmentData} /> },
    '/forum': { component: <Forum {...forumData} /> },
    '/gongfa': { component: <Gongfa {...gongfaData} /> },
    '/help': { component: <Help {...helpData} /> },
    '/immortal_genius': {
      component: <ImmortalGenius {...immortalGeniusData} />
    },
    '/jindi': { component: <Jindi {...jindiData} /> },
    '/moneyCheck': { component: <MoneyCheck {...moneyCheckData} /> },
    '/najie': { component: <Najie {...najieData} /> },
    '/ningmenghome': { component: <Ningmenghome {...ningmenghomeData} /> },
    '/player': { component: <Player {...playerData} /> },
    '/playercopy': { component: <Playercopy {...playercopyData} /> },
    '/ranking_money': { component: <RankingMoney {...rankingMoneyData} /> },
    '/ranking_power': { component: <RankingPower {...rankingPowerData} /> },
    '/secret_place': { component: <SecretPlace {...secretPlaceData} /> },
    '/shenbing': { component: <Shenbing {...shenbingData} /> },
    '/state': { component: <State {...stateData} /> },
    '/statemax': { component: <Statemax {...statemaxData} /> },
    '/statezhiye': { component: <Statezhiye {...statezhiyeData} /> },
    '/supermarket': { component: <Supermarket {...supermarketData} /> },
    '/tianditang': { component: <Tianditang {...tianditangData} /> },
    '/tuzhi': { component: <Tuzhi {...tuzhiData} /> },
    '/updateRecord': { component: <UpdateRecord {...updateRecordData} /> },
    '/user': { component: <User {...user} /> },
    '/valuables': { component: <Valuables {...valuablesData} /> },
    '/wuqi': { component: <Wuqi {...wuqiData} /> },
    '/xianchong': { component: <Xianchong {...xianchongData} /> },
    '/zongmeng': { component: <Zongmeng {...zongmengData} /> }
  }
})
