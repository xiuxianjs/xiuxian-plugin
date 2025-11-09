import { getAppConfig } from './model';
import { initPostlog } from './model/posthog';
import { initDefaultAdmin } from './route/core/auth';
import { startAllTasks } from './task/index';
export default defineChildren({
  onCreated() {
    logger.info('修仙扩展启动');
    // 初始化日志
    initPostlog();
    // 初始化默认管理员
    initDefaultAdmin().catch(error => {
      logger.error('初始化默认管理员失败:', error);
    });
    // task是否关闭启动，使用框架层配置
    const value = getAppConfig();

    const task = value?.task === false ? false : true;
    const openTask = value?.open_task === false ? false : task;

    // 当设置 task 但不为 true 时，定时任务不生效
    if (openTask) {
      // 启动定时任务
      startAllTasks().catch(error => {
        logger.error('启动定时任务失败:', error);
      });
    }
  }
});
