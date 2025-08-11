import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './paths'
import type { AssociationData } from '@src/types'

class Association {
  /**
   * 获取宗门数据
   * @param file_name  宗门名称
   * @deprecated
   */
  async getAssociation(file_name: string): Promise<AssociationData | 'error'> {
    const redis = getIoRedis()
    const data = await redis.get(`${__PATH.association}:${file_name}`)
    if (!data) {
      // 如果没有数据，返回空对象
      return 'error'
    }
    try {
      return JSON.parse(data) as AssociationData
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
  async setAssociation(
    file_name: string,
    data: AssociationData
  ): Promise<void> {
    const redis = getIoRedis()
    await redis.set(`${__PATH.association}:${file_name}`, JSON.stringify(data))
    return
  }
}
export default new Association()
