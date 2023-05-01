import fs from 'node:fs'
import YAML from 'yaml'
import { MyDirPath } from '../../../app.config.js'
class DefsetUpdata {
  /*动态生成配置读取*/
  getConfig = (parameter) => {
    const { app, name } = parameter
    /*获得配置地址*/
    const file = `${MyDirPath}/config/${app}/${name}.yaml`
    /*读取配置*/
    const data = YAML.parse(fs.readFileSync(file, 'utf8'))
    return data
  }
}
export default new DefsetUpdata()
