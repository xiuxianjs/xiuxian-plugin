import YAML from 'yaml'
import fs from 'fs'
import { join } from 'path'
import { __PATH_CONFIG } from './paths'
import { createRequire } from 'module'

const pkg = createRequire(import.meta.url)('../../package.json') as {
  name: string
}

const configPath = join(process.cwd(), 'config')

/**
 *
 * @param _app
 * @param name
 * @returns
 */
export function getConfig(_app: string, name: keyof typeof __PATH_CONFIG) {
  const fileURL = __PATH_CONFIG[name]
  const data = YAML.parse(fs.readFileSync(fileURL, 'utf8'))
  // 先检查是否存在 自定义配置
  const curPath = join(configPath, pkg.name, `${name}.yaml`)
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

/**
 * @deprecated 请使用 getConfig 方法
 */
class Config {
  /**
   * 获取用户自己配置的配置文件信息
   * @param app
   * @param name
   */
  getConfig = getConfig
}
export default new Config()
