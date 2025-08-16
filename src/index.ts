import { initPostlog } from './model/posthog'
import { initDefaultAdmin } from './route/core/auth'
import { startTask } from './task/index'
import { startScheduledTasks } from './task/Scheduler'

export default defineChildren({
  onCreated() {
    logger.info('修仙扩展启动')
    // 初始化日志
    initPostlog()
    // 初始化默认管理员
    initDefaultAdmin()

    // 启动定时任务
    startTask()

    // 启动定时任务
    startScheduledTasks().catch(error => {
      console.error('启动定时任务失败:', error)
    })
  }
})
