import { Context } from 'koa'
import { validateRole, validateToken } from '@src/route/core/auth'
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { getConfig, setConfig } from '@src/model'

// 定义配置类型
interface XiuxianConfig {
  task?: {
    [key: string]: string
  }
  [key: string]: unknown
}

// 获取定时任务配置
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin')
    if (!res) {
      return
    }

    // 读取配置文件
    const configPath = path.join(process.cwd(), 'src/config/xiuxian.yaml')
    const configContent = fs.readFileSync(configPath, 'utf8')
    const config = yaml.load(configContent) as XiuxianConfig

    // 获取任务配置
    const taskConfig = config.task || {}

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '获取定时任务配置成功',
      data: taskConfig
    }
  } catch (error) {
    logger.error('获取定时任务配置错误:', error)
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
    const res = await validateRole(ctx, 'admin')
    if (!res) {
      return
    }

    const { taskConfig } = ctx.request.body as {
      taskConfig: { [key: string]: string }
    }

    if (!taskConfig) {
      ctx.status = 400
      ctx.body = {
        code: 400,
        message: '任务配置不能为空',
        data: null
      }
      return
    }

    const config = await getConfig('', 'xiuxian')

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
    logger.error('更新定时任务配置错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}

// 获取任务状态
export const PATCH = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin')
    if (!res) {
      return
    }

    // 获取任务状态
    const { TaskMap } = await import('@src/model/task')
    const taskStatus: {
      [key: string]: { running: boolean; nextInvocation?: Date }
    } = {}

    for (const [taskName, job] of TaskMap.entries()) {
      taskStatus[taskName] = {
        running: true, // node-schedule的Job默认是运行状态
        nextInvocation: job.nextInvocation()
      }
    }

    ctx.status = 200
    ctx.body = {
      code: 200,
      message: '获取任务状态成功',
      data: taskStatus
    }
  } catch (error) {
    logger.error('获取任务状态错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}

// 任务控制接口
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

    const { action, taskName } = ctx.request.body as {
      action:
        | 'start'
        | 'stop'
        | 'restart'
        | 'startAll'
        | 'stopAll'
        | 'restartAll'
      taskName?: string
    }

    // 导入任务控制函数
    const {
      startSingleTask,
      stopTask,
      restartTask,
      startAllTasks,
      stopAllTasks,
      restartAllTasks
    } = await import('@src/task/index')

    let success = false
    let message = ''
    let data: Record<string, unknown> = {}

    switch (action) {
      case 'start': {
        if (!taskName) {
          ctx.status = 400
          ctx.body = {
            code: 400,
            message: '启动任务需要指定任务名称',
            data: null
          }
          return
        }
        const startResult = await startSingleTask(taskName)
        success = startResult.success
        message = startResult.message
        data = { taskName, action: 'start' }
        break
      }

      case 'stop': {
        if (!taskName) {
          ctx.status = 400
          ctx.body = {
            code: 400,
            message: '停止任务需要指定任务名称',
            data: null
          }
          return
        }
        success = stopTask(taskName)
        message = success
          ? `任务 ${taskName} 停止成功`
          : `任务 ${taskName} 停止失败`
        data = { taskName, action: 'stop' }
        break
      }

      case 'restart': {
        if (!taskName) {
          ctx.status = 400
          ctx.body = {
            code: 400,
            message: '重启任务需要指定任务名称',
            data: null
          }
          return
        }
        success = await restartTask(taskName)
        message = success
          ? `任务 ${taskName} 重启成功`
          : `任务 ${taskName} 重启失败`
        data = { taskName, action: 'restart' }
        break
      }

      case 'startAll': {
        const startAllResult = await startAllTasks()
        success = startAllResult.success
        message = startAllResult.message
        data = { action: 'startAll', ...startAllResult.data }
        break
      }

      case 'stopAll': {
        const stoppedTasks = stopAllTasks()
        success = true
        message = `已停止所有任务: ${stoppedTasks.join(', ')}`
        data = { action: 'stopAll', stoppedTasks }
        break
      }

      case 'restartAll': {
        success = await restartAllTasks()
        message = success ? '所有定时任务重启成功' : '定时任务重启失败'
        data = { action: 'restartAll' }
        break
      }

      default:
        ctx.status = 400
        ctx.body = { code: 400, message: '无效的操作类型', data: null }
        return
    }

    ctx.status = 200
    ctx.body = {
      code: 200,
      message,
      data: {
        timestamp: new Date().toISOString(),
        success,
        ...data
      }
    }
  } catch (error) {
    logger.error('任务控制错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}
