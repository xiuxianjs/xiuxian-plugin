import { validateRole, validateToken } from '../core/auth.js';
import '../../model/api.js';
import '../../model/keys.js';
import '@alemonjs/db';
import { getConfig, setConfig } from '../../model/Config.js';
import 'alemonjs';
import 'dayjs';
import '../../model/DataList.js';
import '../../model/settions.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'fs';
import 'buffer';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import { TaskMap } from '../../model/task.js';
import '../../model/message.js';
import { restartAllTasks, stopAllTasks, startAllTasks, restartTask, stopTask, startSingleTask } from '../../task/index.js';

const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const config = await getConfig('', 'xiuxian');
        const taskConfig = config?.task || {};
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取定时任务配置成功',
            data: taskConfig
        };
    }
    catch (error) {
        logger.error('获取定时任务配置错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const POST = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const body = ctx.request.body;
        const { taskConfig } = body;
        if (!taskConfig) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '任务配置不能为空',
                data: null
            };
            return;
        }
        const config = await getConfig('', 'xiuxian');
        await setConfig('xiuxian', {
            ...config,
            task: taskConfig
        });
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '更新定时任务配置成功',
            data: {
                timestamp: new Date().toISOString()
            }
        };
    }
    catch (error) {
        logger.error('更新定时任务配置错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const PATCH = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const taskStatus = {};
        for (const [taskName, job] of TaskMap.entries()) {
            taskStatus[taskName] = {
                running: true,
                nextInvocation: job.nextInvocation()
            };
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取任务状态成功',
            data: taskStatus
        };
    }
    catch (error) {
        logger.error('获取任务状态错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};
const PUT = async (ctx) => {
    try {
        const token = ctx.request.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: '需要登录',
                data: null
            };
            return;
        }
        const user = await validateToken(token);
        if (!user || user.role !== 'admin') {
            ctx.status = 403;
            ctx.body = {
                code: 403,
                message: '权限不足',
                data: null
            };
            return;
        }
        const body = ctx.request.body;
        const { action, taskName } = body;
        let success = false;
        let message = '';
        let data = {};
        switch (action) {
            case 'start': {
                if (!taskName) {
                    ctx.status = 400;
                    ctx.body = {
                        code: 400,
                        message: '启动任务需要指定任务名称',
                        data: null
                    };
                    return;
                }
                const startResult = await startSingleTask(taskName);
                success = startResult.success;
                message = startResult.message;
                data = { taskName, action: 'start' };
                break;
            }
            case 'stop': {
                if (!taskName) {
                    ctx.status = 400;
                    ctx.body = {
                        code: 400,
                        message: '停止任务需要指定任务名称',
                        data: null
                    };
                    return;
                }
                success = stopTask(taskName);
                message = success ? `任务 ${taskName} 停止成功` : `任务 ${taskName} 停止失败`;
                data = { taskName, action: 'stop' };
                break;
            }
            case 'restart': {
                if (!taskName) {
                    ctx.status = 400;
                    ctx.body = {
                        code: 400,
                        message: '重启任务需要指定任务名称',
                        data: null
                    };
                    return;
                }
                success = await restartTask(taskName);
                message = success ? `任务 ${taskName} 重启成功` : `任务 ${taskName} 重启失败`;
                data = { taskName, action: 'restart' };
                break;
            }
            case 'startAll': {
                const startAllResult = await startAllTasks();
                success = startAllResult.success;
                message = startAllResult.message;
                data = { action: 'startAll', ...startAllResult.data };
                break;
            }
            case 'stopAll': {
                const stoppedTasks = stopAllTasks();
                success = true;
                message = `已停止所有任务: ${stoppedTasks.join(', ')}`;
                data = { action: 'stopAll', stoppedTasks };
                break;
            }
            case 'restartAll': {
                success = await restartAllTasks();
                message = success ? '所有定时任务重启成功' : '定时任务重启失败';
                data = { action: 'restartAll' };
                break;
            }
            default:
                ctx.status = 400;
                ctx.body = { code: 400, message: '无效的操作类型', data: null };
                return;
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message,
            data: {
                timestamp: new Date().toISOString(),
                success,
                ...data
            }
        };
    }
    catch (error) {
        logger.error('任务控制错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, PATCH, POST, PUT };
