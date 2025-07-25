import fs from 'fs'
import path from 'path'
import { __PATH } from './paths'
// 类型定义
type JSONData = Record<string, any> | Array<any>

class Association {
  /**
   * 获取宗门数据
   * @param file_name  宗门名称
   */
  getAssociation(file_name: string): JSONData | 'error' {
    const dir: string = path.join(
      __PATH.association + '/' + file_name + '.json'
    )
    try {
      const data = fs.readFileSync(dir, 'utf8')
      return JSON.parse(data)
    } catch (error) {
      logger.error('读取文件错误：' + error)
      return 'error'
    }
  }

  /**
   * 写入宗门数据
   * @param file_name  宗门名称
   * @param data
   */
  setAssociation(file_name: string, data: JSONData): void {
    const dir: string = path.join(
      __PATH.association + '/' + file_name + '.json'
    )
    const new_ARR = JSON.stringify(data) //json转string
    fs.writeFileSync(dir, new_ARR, 'utf-8')
    return
  }
}
export default new Association()
