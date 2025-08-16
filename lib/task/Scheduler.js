import { runRankingTask } from './RankingTask.js';
import { getIoRedis } from '@alemonjs/db';
import 'fs';
import 'path';
import 'js-yaml';

const redis = getIoRedis();
let taskTimers = {};
let isRunning = false;
async function startScheduledTasks() {
    if (isRunning) {
        console.log('定时任务已在运行中');
        return;
    }
    console.log('启动定时任务调度器...');
    isRunning = true;
    await startRankingTask();
    checkForRestart();
    console.log('定时任务调度器启动完成');
}
async function checkForRestart() {
    setInterval(async () => {
        try {
            const restartSignal = await redis.get('task:restart');
            if (restartSignal === 'true') {
                console.log('检测到任务重启信号，重新启动任务...');
                await redis.del('task:restart');
                await restartTasks();
            }
        }
        catch (error) {
            console.error('检查任务重启信号失败:', error);
        }
    }, 5000);
}
async function restartTasks() {
    console.log('重启定时任务...');
    stopScheduledTasks();
    isRunning = false;
    await startScheduledTasks();
}
function stopScheduledTasks() {
    console.log('停止定时任务调度器...');
    isRunning = false;
    Object.values(taskTimers).forEach(timer => {
        clearInterval(timer);
    });
    taskTimers = {};
    console.log('定时任务调度器已停止');
}
async function startRankingTask() {
    console.log('启动排名计算任务，间隔: 30分钟');
    runRankingTask().catch(error => {
        console.error('排名计算任务执行失败:', error);
    });
    taskTimers.RANKING = setInterval(async () => {
        try {
            console.log('执行排名计算任务...');
            await runRankingTask();
            console.log('排名计算任务执行完成');
        }
        catch (error) {
            console.error('排名计算任务执行失败:', error);
        }
    }, 30 * 60 * 1000);
}
async function executeRankingTask() {
    try {
        console.log('手动执行排名计算任务...');
        await runRankingTask();
        console.log('排名计算任务执行完成');
        return true;
    }
    catch (error) {
        console.error('排名计算任务执行失败:', error);
        return false;
    }
}
function getTaskStatus() {
    return {
        isRunning,
        tasks: Object.keys(taskTimers).map(key => ({
            name: key,
            isActive: !!taskTimers[key]
        }))
    };
}

export { executeRankingTask, getTaskStatus, startScheduledTasks, stopScheduledTasks };
