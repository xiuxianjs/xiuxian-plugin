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

    /**
     * todo
     * 持久化配置。
     * 如果设置了暂停，每次启动进行。都不会对该任务进行启动。
     * 同时也要支持。设置暂停任务后。所有的进程都同步暂停。
     */

    // 当设置 task 但不为 true 时，定时任务不生效
    if (typeof value?.task !== 'boolean' || value.task) {
      // 启动定时任务
      startAllTasks().catch(error => {
        logger.error('启动定时任务失败:', error);
      });
    }
  }
});
