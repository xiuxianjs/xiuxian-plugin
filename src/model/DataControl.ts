import fs from 'fs'
import path from 'path'
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

class DataControl {
  /**
   * 检测存档存在
   * @param file_path_type ["player" , "association" ]
   * @param file_name
   */
  existData(file_path_type: FilePathType, file_name: string): boolean {
    let file_path = filePathMap[file_path_type]
    let dir = path.join(file_path + '/' + file_name + '.json')
    if (fs.existsSync(dir)) {
      return true
    }
    return false
  }

  /**
   * 获取文件数据(user_qq为空查询item下的file_name文件)
   * @param file_name  [player,equipment,najie]
   * @param user_qq
   */
  getData(
    file_name: FilePathType | string,
    user_qq?: string
  ): JSONData | 'error' {
    let file_path: string
    let dir: string
    let data: string
    if (user_qq) {
      //带user_qq的查询数据文件
      file_path = filePathMap[file_name as FilePathType]
      dir = path.join(file_path + '/' + user_qq + '.json')
    } else {
      //不带参数的查询item下文件
      file_path = __PATH.lib_path
      dir = path.join(file_path + '/' + file_name + '.json')
    }
    try {
      data = fs.readFileSync(dir, 'utf8')
      //将字符串数据转变成json格式
      const parsedData = JSON.parse(data)
      return parsedData
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
   */
  setData(
    file_name: FilePathType | string,
    user_qq: string | null,
    data: JSONData
  ): void {
    let file_path: string
    let dir: string
    if (user_qq) {
      file_path = filePathMap[file_name as FilePathType]
      dir = path.join(file_path + '/' + user_qq + '.json')
    } else {
      file_path = filePathMap.lib
      dir = path.join(file_path + '/' + file_name + '.json')
    }
    const new_ARR = JSON.stringify(data) //json转string
    if (fs.existsSync(dir)) {
      fs.writeFileSync(dir, new_ARR, 'utf-8')
    }
    return
  }
}

export default new DataControl()
