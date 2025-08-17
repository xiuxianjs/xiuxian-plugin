import { DATA_LIST, DataListType } from '@src/model/DataList'
import { Context } from 'koa'
import { validateRole } from '@src/route/core/auth'

/**
 * 查询数据列表
 * @param ctx
 * @returns
 */
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin')
    if (!res) {
      return
    }

    const { name } = ctx.query as {
      name: DataListType
    }

    if (!name) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '数据类型不能为空',
        data: null
      }
      return
    }

    const data = DATA_LIST[name]
    if (!data) {
      ctx.status = 404
      ctx.body = {
        code: 404,
        message: '数据类型不存在',
        data: null
      }
      return
    }

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '获取数据成功',
      data: data
    }
  } catch (error) {
    logger.error('获取数据列表错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}
