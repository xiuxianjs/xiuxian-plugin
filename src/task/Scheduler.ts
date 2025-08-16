import { runRankingTask } from './RankingTask'
import { getIoRedis } from '@alemonjs/db'
import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

const redis = getIoRedis()

// 任务状态
let taskTimers: { [key: string]: NodeJS.Timeout } = {}
let isRunning = false

// 获取任务配置
async function getTaskConfig() {
  try {
    // 先从Redis缓存获取
    const cachedConfig = await redis.get('config:task')
    if (cachedConfig) {
      return JSON.parse(cachedConfig)
    }

    // 从配置文件读取
    const configPath = path.join(process.cwd(), 'src/config/xiuxian.yaml')
    const configContent = fs.readFileSync(configPath, 'utf8')
    const config = yaml.load(configContent) as any

    return config.task || {}
  } catch (error) {
    console.error('获取任务配置失败:', error)
    return {}
  }
}

// 启动定时任务
export async function startScheduledTasks() {
  if (isRunning) {
    console.log('定时任务已在运行中')
    return
  }

  console.log('启动定时任务调度器...')
  isRunning = true

  // 启动排名计算任务
  await startRankingTask()

  // 检查是否需要重启任务
  checkForRestart()

  console.log('定时任务调度器启动完成')
}

// 检查任务重启信号
async function checkForRestart() {
  setInterval(async () => {
    try {
      const restartSignal = await redis.get('task:restart')
      if (restartSignal === 'true') {
        console.log('检测到任务重启信号，重新启动任务...')
        await redis.del('task:restart')
        await restartTasks()
      }
    } catch (error) {
      console.error('检查任务重启信号失败:', error)
    }
  }, 5000) // 每5秒检查一次
}

// 重启任务
async function restartTasks() {
  console.log('重启定时任务...')

  // 停止当前任务
  stopScheduledTasks()

  // 重新启动任务
  isRunning = false
  await startScheduledTasks()
}

// 停止定时任务
export function stopScheduledTasks() {
  console.log('停止定时任务调度器...')
  isRunning = false

  // 清除所有定时器
  Object.values(taskTimers).forEach(timer => {
    clearInterval(timer)
  })
  taskTimers = {}

  console.log('定时任务调度器已停止')
}

// 启动排名计算任务
async function startRankingTask() {
  console.log('启动排名计算任务，间隔: 30分钟')

  // 立即执行一次
  runRankingTask().catch(error => {
    console.error('排名计算任务执行失败:', error)
  })

  // 设置定时执行
  taskTimers.RANKING = setInterval(
    async () => {
      try {
        console.log('执行排名计算任务...')
        await runRankingTask()
        console.log('排名计算任务执行完成')
      } catch (error) {
        console.error('排名计算任务执行失败:', error)
      }
    },
    30 * 60 * 1000
  ) // 30分钟
}

// 手动执行排名任务
export async function executeRankingTask() {
  try {
    console.log('手动执行排名计算任务...')
    await runRankingTask()
    console.log('排名计算任务执行完成')
    return true
  } catch (error) {
    console.error('排名计算任务执行失败:', error)
    return false
  }
}

// 获取任务状态
export function getTaskStatus() {
  return {
    isRunning,
    tasks: Object.keys(taskTimers).map(key => ({
      name: key,
      isActive: !!taskTimers[key]
    }))
  }
}
