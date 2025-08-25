import { getAppCofig } from './model';
import { initPostlog } from './model/posthog';
import { initDefaultAdmin } from './route/core/auth';
import { startAllTasks } from './task/index';
export default defineChildren({
  onCreated () {
    logger.info('修仙扩展启动');
    // 初始化日志
    initPostlog();
    // 初始化默认管理员
    initDefaultAdmin();
    // task是否关闭启动，使用框架层配置
    const value = getAppCofig();
    // 当设置 task 但不为 true 时，定时任务不生效
    if (typeof value?.task !== 'boolean' || value.task) {
      // 启动定时任务
      startAllTasks().catch(error => {
        logger.error('启动定时任务失败:', error);
      });
    }
  }
});
