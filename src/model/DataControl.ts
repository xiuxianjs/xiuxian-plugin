import { __PATH } from './paths.js'
import { redis } from '@src/api/api.js'
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
) => {
  const dir = `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`
  return redis.exists(dir)
}

/**
 * @param key
 * @param from
 * @param name
 * @returns
 */
export const readDataByPath = async (
  key: keyof typeof __PATH,
  from: string,
  name: string
) => {
  try {
    const data = await redis.get(
      `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`
    )
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
  redis.set(
    `${__PATH[key]}${from ? `:${from}` : ''}${name ? `:${name}` : ''}`,
    JSON.stringify(data)
  )
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
  async existData(file_path_type: FilePathType, file_name: string) {
    const res = await redis.exists(
      `${filePathMap[file_path_type]}:${file_name}`
    )
    return res === 1
  }

  /**
   * 获取文件数据(user_qq为空查询item下的file_name文件)
   * @param file_name  [player,equipment,najie]
   * @param user_qq
   * @deprecated
   */
  async getData(file_name: FilePathType | string, user_qq?: string) {
    if (user_qq) {
      const data = await redis.get(`${filePathMap[file_name]}:${user_qq}`)
      return data ? JSON.parse(data) : null
    } else {
      const data = await redis.get(`${filePathMap[file_name]}`)
      return data ? JSON.parse(data) : null
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
    redis.set(
      `${filePathMap[file_name]}${user_qq ? `:${user_qq}` : ''}`,
      JSON.stringify(data)
    )
    return
  }
}
export default new DataControl()
