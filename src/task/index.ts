import { ExchangeTask } from './clear/ExchangeTask';
import { ForumTask } from './clear/ForumTask';
import { Shoptask } from './update/Shoptask';
import { ShopGradetask } from './update/ShopGradetask';
import { AuctionofficialTask } from '@src/task/AuctionofficialTask';
import { MsgTask } from '@src/task/msgTask';
import { TiandibangTask } from '@src/task/ranking/Tiandibang';
import { scheduleJob } from 'node-schedule';
import { getConfig } from '@src/model';
import { TaskMap } from '@src/model/task';
import { ActionsTask } from './actions/actionsTask';
import { TaskKeys } from '@src/config/xiuxian';

// 任务函数映射
const taskFunctions: {
  [key in TaskKeys]: (() => Promise<void>) | (() => void);
} = {
  ActionsTask: ActionsTask,
  ShopTask: Shoptask,
  ExchangeTask: ExchangeTask,
  AuctionofficialTask: AuctionofficialTask,
  ForumTask: ForumTask,
  MsgTask: MsgTask,
  ShopGradetask: ShopGradetask,
  TiandibangTask: TiandibangTask
};

// 停止指定任务
export const stopTask = (taskName: string) => {
  const job = TaskMap.get(taskName);

  try {
    if (job) {
      job.cancel();
      TaskMap.delete(taskName);
      logger.debug(`任务 ${taskName} 已停止`);

      return true;
    }

    return false;
  } catch (error) {
    logger.error(`停止任务 ${taskName} 失败:`, error);

    return false;
  }
};

// 停止所有任务
export const stopAllTasks = () => {
  const stoppedTasks: string[] = [];

  for (const [taskName, job] of TaskMap.entries()) {
    try {
      job.cancel();
      stoppedTasks.push(taskName);
    } catch (error) {
      logger.error(`停止任务 ${taskName} 失败:`, error);
    }
  }
  TaskMap.clear();
  logger.debug(`已停止所有任务: ${stoppedTasks.join(', ')}`);

  return stoppedTasks;
};

// 启动指定任务
export const startSingleTask = async (taskName: string) => {
  try {
    // 检查任务是否已经启动
    if (TaskMap.has(taskName)) {
      logger.warn(`任务 ${taskName} 已经在运行中`);

      return { success: false, message: `任务 ${taskName} 已经在运行中` };
    }

    logger.debug(`开始启动任务: ${taskName}`);

    // 获取任务配置
    const taskConfig = (await getConfig('', 'xiuxian'))?.task;

    if (!taskConfig?.[taskName]) {
      logger.warn(`任务 ${taskName} 配置不存在`);

      // 使用本地的配置

      return;
    }

    // 获取任务函数
    const taskFunction = taskFunctions[taskName as keyof typeof taskFunctions];

    if (!taskFunction) {
      logger.warn(`任务 ${taskName} 函数不存在`);

      return;
    }

    const newJob = scheduleJob(taskConfig[taskName], taskFunction);

    TaskMap.set(taskName, newJob);

    logger.debug(`任务 ${taskName} 启动完成`);

    return { success: true, message: `任务 ${taskName} 启动成功` };
  } catch (error) {
    logger.error(`启动任务 ${taskName} 失败:`, error);

    return { success: false, message: `启动任务 ${taskName} 失败: ${error}` };
  }
};

// 启动所有任务
export const startAllTasks = async () => {
  try {
    // 获取任务配置
    const taskConfig = (await getConfig('', 'xiuxian'))?.task;

    if (!taskConfig) {
      throw new Error('任务配置不存在');
    }

    const startedTasks: string[] = [];
    const failedTasks: string[] = [];

    // 启动所有配置的任务
    for (const [taskName] of Object.entries(taskConfig)) {
      if (!TaskMap.has(taskName)) {
        const result = await startSingleTask(taskName);

        if (result?.success) {
          startedTasks.push(taskName);
        } else {
          failedTasks.push(taskName);
        }
      }
    }

    return {
      success: true,
      message: `启动完成。成功: ${startedTasks.length}个, 失败: ${failedTasks.length}个`,
      data: { startedTasks, failedTasks }
    };
  } catch (error) {
    logger.error('启动所有定时任务失败:', error);

    return { success: false, message: `启动所有任务失败: ${error}` };
  }
};

// 重启指定任务
export const restartTask = async (taskName: string) => {
  try {
    logger.debug(`开始重启任务: ${taskName}`);

    // 停止指定任务
    stopTask(taskName);

    // 启动任务
    const result = await startSingleTask(taskName);

    return result?.success;
  } catch (error) {
    logger.error(`重启任务 ${taskName} 失败:`, error);

    return false;
  }
};

// 重启所有任务
export const restartAllTasks = async () => {
  try {
    logger.debug('开始重启所有定时任务...');

    // 停止所有任务
    stopAllTasks();

    // 启动所有任务
    const result = await startAllTasks();

    return result.success;
  } catch (error) {
    logger.error('重启所有定时任务失败:', error);

    return false;
  }
};
