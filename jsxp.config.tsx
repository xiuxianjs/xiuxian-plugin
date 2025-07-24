import React from 'react'
import { defineConfig } from 'jsxp'
import userData from './views/user.json'
import hlpeData from './views/help.json'
import equipment from './views/equipment.json'
import danyao from './views/danyao.json'
import Player from '@src/resources/html/player/player'
import Help from '@src/resources/html/help/help'
import Equipment from '@src/resources/html/equipment/equipment'
import Danyao from '@src/resources/html/danyao/danyao'
export default defineConfig({
  routes: {
    '/player': {
      component: <Player {...userData} />
    },
    // '/help': {
    //   component: <Help {...hlpeData} />
    // }
    // '/help': {
    //   component: <Help {...hlpeData} />
    // },
    // '/equipment': {
    //   component: <Equipment {...equipment} />
    // }
    '/danyao': {
      component: <Danyao {...danyao} />
    }
  }
})
