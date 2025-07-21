import { Picture } from 'jsxp'
import { compileTemplate } from './render'
import { MyDirPath } from '../app.config'
import { join } from 'path'

class Pic {
  pic: Picture
  constructor() {
    this.pic = new Picture()
    this.pic.puppeteer.start()
  }

  async screenshot(name, uid, data) {
    const templatePath = join(MyDirPath, `/resources/html/${name}/${name}.html`)
    const outputPath = compileTemplate(templatePath, data, name, uid)
    console.log(outputPath)

    const img = await this.pic.puppeteer.render(outputPath)
    return img
  }
}
export default new Pic()
