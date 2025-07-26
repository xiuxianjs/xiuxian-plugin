import fs, { mkdirSync } from 'fs'
import path, { join } from 'path'
import { __PATH } from './paths.js'
// 类型定义
type JSONData = Record<string, any> | Array<any>

type FilePathType =
  | 'player'
  | 'equipment'
  | 'najie'
  | 'lib'
  | 'Timelimit'
  | 'Level'
  | 'association'
  | 'occupation'

const filePathMap = {
  player: __PATH.player_path,
  equipment: __PATH.equipment_path,
  najie: __PATH.najie_path,
  lib: __PATH.lib_path,
  Timelimit: __PATH.Timelimit, // 限定
  Level: __PATH.Level, // 境界
  association: __PATH.association,
  occupation: __PATH.occupation
}

/**
 * @param key
 * @param from
 * @param name
 * @returns
 */
export const existDataByPath = (
  key: keyof typeof __PATH,
  from: string,
  name: string
): boolean => {
  const dir = join(__PATH[key], from, `${name}.json`)
  return fs.existsSync(dir)
}

/**
 * @param key
 * @param from
 * @param name
 * @returns
 */
export const readDataByPath = (
  key: keyof typeof __PATH,
  from: string,
  name: string
) => {
  try {
    const dir = join(__PATH[key], from, `${name}.json`)
    const data = fs.readFileSync(dir, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    logger.error('读取文件错误：' + error)
    return null
  }
}

/**
 *
 * @param key
 * @param from
 * @param name
 * @param data
 */
export const writeDataByPath = (
  key: keyof typeof __PATH,
  from: string,
  name: string,
  data: any
): void => {
  const dir = join(__PATH[key], from, `${name}.json`)
  const newData = JSON.stringify(data, null, '\t')
  if (fs.existsSync(dir)) {
    fs.writeFileSync(dir, newData, 'utf8')
  } else {
    mkdirSync(path.dirname(dir), { recursive: true })
    fs.writeFileSync(dir, newData, 'utf8')
  }
}

/**
 * @deprecated
 */
class DataControl {
  /**
   * 检测存档存在
   * @param file_path_type ["player" , "association" ]
   * @param file_name
   * @deprecated
   */
  existData(file_path_type: FilePathType, file_name: string): boolean {
    const dir = path.join(
      filePathMap[file_path_type] + '/' + file_name + '.json'
    )
    if (fs.existsSync(dir)) {
      return true
    }
    return false
  }

  /**
   * 获取文件数据(user_qq为空查询item下的file_name文件)
   * @param file_name  [player,equipment,najie]
   * @param user_qq
   * @deprecated
   */
  getData(
    file_name: FilePathType | string,
    user_qq?: string
  ): JSONData | 'error' {
    let dir: string
    if (user_qq) {
      //带user_qq的查询数据文件
      dir = path.join(
        filePathMap[file_name as FilePathType] + '/' + user_qq + '.json'
      )
    } else {
      //不带参数的查询item下文件
      dir = path.join(__PATH.lib_path + '/' + file_name + '.json')
    }
    try {
      const data = fs.readFileSync(dir, 'utf8')
      //将字符串数据转变成json格式
      return JSON.parse(data)
    } catch (error) {
      logger.error('读取文件错误：' + error)
      return 'error'
    }
  }

  /**
   * 写入数据
   * @param file_name [player,equipment,najie]
   * @param user_qq
   * @param data
   * @deprecated
   */
  setData(
    file_name: FilePathType | string,
    user_qq: string | null,
    data: JSONData
  ): void {
    let dir: string
    if (user_qq) {
      dir = path.join(
        filePathMap[file_name as FilePathType] + '/' + user_qq + '.json'
      )
    } else {
      dir = path.join(filePathMap.lib + '/' + file_name + '.json')
    }
    const new_ARR = JSON.stringify(data) //json转string
    if (fs.existsSync(dir)) {
      fs.writeFileSync(dir, new_ARR, 'utf-8')
    }
    return
  }
}

export default new DataControl()
