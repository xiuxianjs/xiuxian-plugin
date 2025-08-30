import { AuctionofficialTask } from './AuctionofficialTask.js';
import { ExchangeTask } from './ExchangeTask.js';
import { ForumTask } from './ForumTask.js';
import { MojiTask } from './mojietask.js';
import { PlayerControlTask } from './PlayerControlTask.js';
import { SecretPlaceplusTask } from './SecretPlaceplusTask.js';
import { OccupationTask } from './OccupationTask.js';
import { MsgTask } from './msgTask.js';
import { ShenjieTask } from './shenjietask.js';
import { Shoptask } from './Shoptask.js';
import { ShopGradetask } from './ShopGradetask.js';
import { Taopaotask } from './Taopaotask.js';
import { SecretPlaceTask } from './SecretPlaceTask.js';
import { TiandibangTask } from './Tiandibang.js';
import { Xijietask } from './Xijietask.js';
import { scheduleJob } from 'node-schedule';
import '../model/api.js';
import '../model/keys.js';
import '@alemonjs/db';
import { getConfig } from '../model/Config.js';
import 'alemonjs';
import 'dayjs';
import '../model/DataList.js';
import '../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../resources/img/state.jpg.js';
import '../resources/styles/tw.scss.js';
import '../resources/font/tttgbnumber.ttf.js';
import '../resources/img/player.jpg.js';
import '../resources/img/player_footer.png.js';
import '../resources/img/user_state.png.js';
import 'classnames';
import '../resources/img/fairyrealm.jpg.js';
import '../resources/img/card.jpg.js';
import '../resources/img/road.jpg.js';
import '../resources/img/user_state2.png.js';
import '../resources/html/help.js';
import '../resources/img/najie.jpg.js';
import '../resources/img/shituhelp.jpg.js';
import '../resources/img/icon.png.js';
import '../resources/styles/temp.scss.js';
import 'fs';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../model/currency.js';
import 'crypto';
import 'posthog-node';
import { TaskMap } from '../model/task.js';
import '../model/message.js';

const taskFunctions = {
    ShopTask: Shoptask,
    ExchangeTask: ExchangeTask,
    AuctionofficialTask: AuctionofficialTask,
    ForumTask: ForumTask,
    MojiTask: MojiTask,
    PlayerControlTask: PlayerControlTask,
    SecretPlaceplusTask: SecretPlaceplusTask,
    OccupationTask: OccupationTask,
    MsgTask: MsgTask,
    ShenjieTask: ShenjieTask,
    ShopGradetask: ShopGradetask,
    Taopaotask: Taopaotask,
    SecretPlaceTask: SecretPlaceTask,
    TiandibangTask: TiandibangTask,
    Xijietask: Xijietask
};
const stopTask = (taskName) => {
    const job = TaskMap.get(taskName);
    try {
        if (job) {
            job.cancel();
            TaskMap.delete(taskName);
            logger.debug(`任务 ${taskName} 已停止`);
            return true;
        }
        return false;
    }
    catch (error) {
        logger.error(`停止任务 ${taskName} 失败:`, error);
        return false;
    }
};
const stopAllTasks = () => {
    const stoppedTasks = [];
    for (const [taskName, job] of TaskMap.entries()) {
        try {
            job.cancel();
            stoppedTasks.push(taskName);
        }
        catch (error) {
            logger.error(`停止任务 ${taskName} 失败:`, error);
        }
    }
    TaskMap.clear();
    logger.debug(`已停止所有任务: ${stoppedTasks.join(', ')}`);
    return stoppedTasks;
};
const startSingleTask = async (taskName) => {
    try {
        if (TaskMap.has(taskName)) {
            logger.warn(`任务 ${taskName} 已经在运行中`);
            return { success: false, message: `任务 ${taskName} 已经在运行中` };
        }
        logger.debug(`开始启动任务: ${taskName}`);
        const taskConfig = (await getConfig('', 'xiuxian'))?.task;
        if (!taskConfig?.[taskName]) {
            throw new Error(`任务 ${taskName} 配置不存在`);
        }
        const taskFunction = taskFunctions[taskName];
        if (!taskFunction) {
            throw new Error(`任务 ${taskName} 函数不存在`);
        }
        const newJob = scheduleJob(taskConfig[taskName], taskFunction);
        TaskMap.set(taskName, newJob);
        logger.debug(`任务 ${taskName} 启动完成`);
        return { success: true, message: `任务 ${taskName} 启动成功` };
    }
    catch (error) {
        logger.error(`启动任务 ${taskName} 失败:`, error);
        return { success: false, message: `启动任务 ${taskName} 失败: ${error}` };
    }
};
const startAllTasks = async () => {
    try {
        const taskConfig = (await getConfig('', 'xiuxian'))?.task;
        if (!taskConfig) {
            throw new Error('任务配置不存在');
        }
        const startedTasks = [];
        const failedTasks = [];
        for (const [taskName] of Object.entries(taskConfig)) {
            if (!TaskMap.has(taskName)) {
                const result = await startSingleTask(taskName);
                if (result.success) {
                    startedTasks.push(taskName);
                }
                else {
                    failedTasks.push(taskName);
                }
            }
        }
        return {
            success: true,
            message: `启动完成。成功: ${startedTasks.length}个, 失败: ${failedTasks.length}个`,
            data: { startedTasks, failedTasks }
        };
    }
    catch (error) {
        logger.error('启动所有定时任务失败:', error);
        return { success: false, message: `启动所有任务失败: ${error}` };
    }
};
const restartTask = async (taskName) => {
    try {
        logger.debug(`开始重启任务: ${taskName}`);
        stopTask(taskName);
        const result = await startSingleTask(taskName);
        return result.success;
    }
    catch (error) {
        logger.error(`重启任务 ${taskName} 失败:`, error);
        return false;
    }
};
const restartAllTasks = async () => {
    try {
        logger.debug('开始重启所有定时任务...');
        stopAllTasks();
        const result = await startAllTasks();
        return result.success;
    }
    catch (error) {
        logger.error('重启所有定时任务失败:', error);
        return false;
    }
};

export { restartAllTasks, restartTask, startAllTasks, startSingleTask, stopAllTasks, stopTask };
