import { validateToken } from '../core/auth.js';
import { getIoRedis } from '@alemonjs/db';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { getConfig, setConfig } from '../../model/Config.js';
import '../../config/help/association.yaml.js';
import '../../config/help/base.yaml.js';
import '../../config/help/extensions.yaml.js';
import '../../config/help/admin.yaml.js';
import '../../config/help/professor.yaml.js';
import '../../config/xiuxian.yaml.js';
import '../../model/XiuxianData.js';
import '../../model/xiuxian_impl.js';
import '../../model/danyao.js';
import 'alemonjs';
import '../../model/settions.js';
import 'lodash-es';
import '../../model/equipment.js';
import '../../model/shop.js';
import '../../model/trade.js';
import '../../model/qinmidu.js';
import '../../model/shitu.js';
import '../../model/temp.js';
import 'dayjs';
import '../../model/api.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../resources/img/state.jpg.js';
import '../../resources/styles/tw.scss.js';
import '../../resources/font/tttgbnumber.ttf.js';
import '../../resources/img/player.jpg.js';
import '../../resources/img/player_footer.png.js';
import '../../resources/img/user_state.png.js';
import 'classnames';
import '../../resources/img/fairyrealm.jpg.js';
import '../../resources/img/card.jpg.js';
import '../../resources/img/road.jpg.js';
import '../../resources/img/user_state2.png.js';
import '../../resources/html/help.js';
import '../../resources/img/najie.jpg.js';
import '../../resources/img/shituhelp.jpg.js';
import '../../resources/img/icon.png.js';
import '../../resources/styles/temp.scss.js';
import 'crypto';

const redis = getIoRedis();
const GET = async (ctx) => {
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
        const configPath = path.join(process.cwd(), 'src/config/xiuxian.yaml');
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = yaml.load(configContent);
        const taskConfig = config.task || {};
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取定时任务配置成功',
            data: taskConfig
        };
    }
    catch (error) {
        console.error('获取定时任务配置错误:', error);
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
        const { taskConfig } = ctx.request.body;
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
        console.error('更新定时任务配置错误:', error);
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
        await redis.set('task:restart', 'true');
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '定时任务重启指令已发送',
            data: {
                timestamp: new Date().toISOString()
            }
        };
    }
    catch (error) {
        console.error('重启定时任务错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, POST, PUT };
