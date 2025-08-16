import { initPostlog } from './model/posthog'
import { initDefaultAdmin } from './route/core/auth'
import './task/index'

export default defineChildren({
  onCreated() {
    logger.info('修仙扩展启动')
    initPostlog()
    initDefaultAdmin()
  }
})
