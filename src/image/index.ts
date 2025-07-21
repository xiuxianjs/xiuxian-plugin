import { renderComponentToBuffer } from 'jsxp'
import adminset from '../resources/html/adminset/adminset.js'

const map = {
  adminset
}

class Pic {
  async screenshot(name: string, uid: number | string, data) {
    return await renderComponentToBuffer(`data/${uid}`, map[name], data)
  }
}
export default new Pic()
