import React from 'react'
import { defineConfig } from 'jsxp'
import userData from './views/user.json'
import Player from '@src/resources/html/player'
// import daoju from './views/daoju.json'
// import Daoju from '@src/resources/html/daoju'
export default defineConfig({
  routes: {
    '/player': {
      component: <Player {...userData} />
    }
    // '/daoju': {
    //   component: <Daoju {...daoju} />
    // }
  }
})
