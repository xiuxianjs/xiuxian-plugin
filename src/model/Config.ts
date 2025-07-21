import YAML from 'yaml'
import fs from 'fs'
import Association from '@src/config/help/Association.yaml'
import help from '@src/config/help/help.yaml'
import helpcopy from '@src/config/help/helpcopy.yaml'
import set from '@src/config/help/set.yaml'
import shituhelp from '@src/config/help/shituhelp.yaml'
import namelist from '@src/config/parameter/namelist.yaml'
import task from '@src/config/task/task.yaml'
import version from '@src/config/version/version.yaml'
import xiuxian from '@src/config/xiuxian/xiuxian.yaml'

const paths = {
  Association,
  help,
  helpCopy: helpcopy,
  set,
  shituhelp: shituhelp,
  nameList: namelist,
  task,
  version,
  xiuxian
}

// const appMap = {
//   help: 'help',
//   parameter: 'parameter',
//   task: 'task',
//   version: 'version',
//   xiuxian: 'xiuxian'
// }

class Config {
  /**
   * 获取用户自己配置的配置文件信息
   * @param app
   * @param name
   */
  getConfig(_app: string, name: keyof typeof paths) {
    const fileURL = paths[name]
    const data = YAML.parse(fs.readFileSync(fileURL, 'utf8'))
    return data
  }
}
export default new Config()
