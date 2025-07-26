import { __PATH } from './paths'
import { redis } from '@src/api/api'
// 类型定义
type JSONData = Record<string, any> | Array<any>

class Association {
  /**
   * 获取宗门数据
   * @param file_name  宗门名称
   * @deprecated
   */
  async getAssociation(file_name: string): Promise<JSONData | 'error'> {
    const data = await redis.get(`${__PATH.association}:${file_name}`)
    if (!data) {
      // 如果没有数据，返回空对象
      return {}
    }
    try {
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
   * @deprecated
   */
  async setAssociation(file_name: string, data: JSONData): Promise<void> {
    await redis.set(`${__PATH.association}:${file_name}`, JSON.stringify(data))
    return
  }
}
export default new Association()
