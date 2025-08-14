import { initPostlog } from './model/posthog'
import './task/index'
export default defineChildren({
  onCreated() {
    logger.info('修仙扩展启动')
    initPostlog()
  }
})
