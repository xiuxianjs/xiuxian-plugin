import YAML from 'yaml'
import fs from 'fs'
import Association from '@src/config/Association.yaml'
import help from '@src/config/help.yaml'
import help2 from '@src/config/help2.yaml'
import set from '@src/config/set.yaml'
import shituhelp from '@src/config/shituhelp.yaml'
import namelist from '@src/config/namelist.yaml'
import task from '@src/config/task.yaml'
import version from '@src/config/version.yaml'
import xiuxian from '@src/config/xiuxian.yaml'
import { join } from 'path'

const paths = {
  Association,
  help,
  help2,
  set,
  shituhelp,
  namelist,
  task,
  version,
  xiuxian
}

class Config {
  /**
   * 获取用户自己配置的配置文件信息
   * @param app
   * @param name
   */
  getConfig(_app: string, name: keyof typeof paths) {
    const fileURL = paths[name]
    const data = YAML.parse(fs.readFileSync(fileURL, 'utf8'))
    // 先检查是否存在 自定义配置
    const curPath = join(
      process.cwd(),
      'config',
      'alemonjs-xiuxian',
      `${name}.yaml`
    )
    // 如果存在则读取自定义配置
    if (fs.existsSync(curPath)) {
      const curData = YAML.parse(fs.readFileSync(curPath, 'utf8'))
      return {
        ...data,
        ...curData
      }
    }
    return data
  }
}
export default new Config()
