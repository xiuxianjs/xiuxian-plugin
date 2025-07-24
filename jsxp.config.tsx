import React from 'react'
import { defineConfig } from 'jsxp'
// import userData from './views/user.json'
<<<<<<< HEAD
// import hlpeData from './views/help.json'
=======
import hlpeData from './views/help.json'
>>>>>>> d03654506386c448b3d9a6931399785c240009f6
import equipment from './views/equipment.json'
// import Player from '@src/resources/html/player/player'
import Help from '@src/resources/html/help/help'
import Equipment from '@src/resources/html/equipment/equipment'
export default defineConfig({
  routes: {
    // '/player': {
    //   component: <Player {...userData} />
<<<<<<< HEAD
    // },
    // '/help': {
    //   component: <Help {...hlpeData} />
=======
>>>>>>> d03654506386c448b3d9a6931399785c240009f6
    // }
    '/help': {
      component: <Help {...hlpeData} />
    },
    '/equipment': {
      component: <Equipment {...equipment} />
    }
  }
})
