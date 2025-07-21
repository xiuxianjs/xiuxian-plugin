import { renderComponentToBuffer } from 'jsxp'
// import { compileTemplate } from './render'
// import { MyDirPath } from '../app.config'
// import { join } from 'path'
import adminset from '../resources/html/adminset/adminset.js'

const map = {
  adminset
}

class Pic {
  // pic: Picture
  // constructor() {
  //   this.pic = new Picture()
  //   this.pic.puppeteer.start()
  // }
  async screenshot(name, uid, data) {
    // const templatePath = join(MyDirPath, `/resources/html/${name}/${name}.html`)
    // const outputPath = compileTemplate(templatePath, data, name, uid)
    // logger.info(outputPath)
    // const img = await this.pic.puppeteer.render(outputPath)
    return await renderComponentToBuffer(`data/${uid}`, map[name], data)
  }
}
export default new Pic()
