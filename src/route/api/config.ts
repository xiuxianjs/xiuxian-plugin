import { ConfigKey, getConfig, setConfig } from '@src/model'
import { Context } from 'koa'
import { parseJsonBody } from '@src/route/core/bodyParser'

export const GET = async (ctx: Context) => {
  const app = ctx.request.query.app as ConfigKey
  const config = await getConfig('', app)
  ctx.body = config
}

export const POST = async (ctx: Context) => {
  try {
    const body = await parseJsonBody(ctx)
    if (!body || Object.keys(body).length === 0) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '请求体为空',
        data: null
      }
      return
    }
    const name = body.name as ConfigKey
    const data = body.data as Record<string, unknown>
    const res = await setConfig(name, data)
    if (!res) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: '配置保存失败',
        data: null
      }
      return
    }
    ctx.body = {
      code: 200,
      message: '配置保存成功',
      data: null
    }
  } catch (_error) {
    ctx.status = 400
    ctx.body = {
      code: 400,
      message: '请求体格式错误',
      data: null
    }
  }
}
