import { Context } from 'koa'
import { validateToken } from '@src/route/core/auth'
import { getIoRedis } from '@alemonjs/db'
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { getConfig, setConfig } from '@src/model'

const redis = getIoRedis()

// 获取定时任务配置
export const GET = async (ctx: Context) => {
  try {
    // 验证管理员权限
    const token = ctx.request.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '需要登录',
        data: null
      }
      return
    }

    const user = await validateToken(token)
    if (!user || user.role !== 'admin') {
      ctx.status = 403
      ctx.body = {
        code: 403,
        message: '权限不足',
        data: null
      }
      return
    }

    // 读取配置文件
    const configPath = path.join(process.cwd(), 'src/config/xiuxian.yaml')
    const configContent = fs.readFileSync(configPath, 'utf8')
    const config = yaml.load(configContent) as any

    // 获取任务配置
    const taskConfig = config.task || {}

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '获取定时任务配置成功',
      data: taskConfig
    }
  } catch (error) {
    console.error('获取定时任务配置错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}

// 更新定时任务配置
export const POST = async (ctx: Context) => {
  try {
    // 验证管理员权限
    const token = ctx.request.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '需要登录',
        data: null
      }
      return
    }

    const user = await validateToken(token)
    if (!user || user.role !== 'admin') {
      ctx.status = 403
      ctx.body = {
        code: 403,
        message: '权限不足',
        data: null
      }
      return
    }

    const { taskConfig } = ctx.request.body as { taskConfig: any }

    if (!taskConfig) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '任务配置不能为空',
        data: null
      }
      return
    }

    // 读取原配置文件
    // const configPath = path.join(process.cwd(), 'src/config/xiuxian.yaml')
    // const configContent = fs.readFileSync(configPath, 'utf8')
    // const config = yaml.load(configContent) as any

    const config = await getConfig('', 'xiuxian')
    // 更新任务配置
    // config.task = taskConfig

    // 写回配置文件
    // const newConfigContent = yaml.dump(config, {
    //   indent: 2,
    //   lineWidth: -1,
    //   noRefs: true
    // })
    // fs.writeFileSync(configPath, newConfigContent, 'utf8')

    // 缓存配置到Redis
    // await redis.set('config:task', JSON.stringify(taskConfig))

    await setConfig('xiuxian', {
      ...config,
      task: taskConfig
    })

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '更新定时任务配置成功',
      data: {
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('更新定时任务配置错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}

// 重启定时任务
export const PUT = async (ctx: Context) => {
  try {
    // 验证管理员权限
    const token = ctx.request.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        message: '需要登录',
        data: null
      }
      return
    }

    const user = await validateToken(token)
    if (!user || user.role !== 'admin') {
      ctx.status = 403
      ctx.body = {
        code: 403,
        message: '权限不足',
        data: null
      }
      return
    }

    // 触发任务重启
    await redis.set('task:restart', 'true')

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '定时任务重启指令已发送',
      data: {
        timestamp: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('重启定时任务错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}
