import { initPostlog } from './model/posthog'
import { initDefaultAdmin } from './route/core/auth'
import { startAllTasks } from './task/index'

export default defineChildren({
  onCreated() {
    logger.info('修仙扩展启动')
    // 初始化日志
    initPostlog()
    // 初始化默认管理员
    initDefaultAdmin()
    // 启动定时任务
    startAllTasks().catch(error => {
      logger.error('启动定时任务失败:', error)
    })
  }
})
