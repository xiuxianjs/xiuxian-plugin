import '@alemonjs/db';
import { useState } from 'alemonjs';
import '../../model/DataList.js';
import '../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../model/settions.js';
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
import { existsSync, readdirSync } from 'fs';
import 'crypto';
import { validateRole } from '../core/auth.js';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { parseJsonBody } from '../core/bodyParser.js';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESPONSE_DIR = path.resolve(__dirname, '../../response');
const require = createRequire(import.meta.url);
const pkg = require('../../../package.json');
const cwd = process.cwd();
const relativePath = path.relative(cwd, __filename);
const isInNodeModules = /node_modules/.test(relativePath);
const commandPrefix = !isInNodeModules ? 'main' : pkg.name;
const POST = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const body = await parseJsonBody(ctx);
        if (!body) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: 'menus is required',
                data: null
            };
            return;
        }
        const menus = body.menus;
        const targetDir = join(RESPONSE_DIR, ...menus);
        if (!existsSync(targetDir)) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '目录不存在',
                data: null
            };
            return;
        }
        const fileList = readdirSync(targetDir, { withFileTypes: true })
            .filter(file => {
            if (file.isDirectory()) {
                return true;
            }
            return file.isFile() && /^res\.(js|ts|jsx|tsx)$/.test(file.name);
        })
            .map(file => {
            if (file.isDirectory()) {
                return {
                    isDir: true,
                    isFile: false,
                    name: file.name
                };
            }
            const fileName = file.name.replace(/\.js|\.ts|\.jsx|\.tsx$/, '');
            const name = menus.join(':');
            const [state] = useState(`${commandPrefix}:response:${name}`);
            return {
                isDir: false,
                isFile: true,
                name: fileName,
                status: state === true || state === false ? state : false
            };
        });
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: 'success',
            data: fileList
        };
    }
    catch (error) {
        console.error('获取指令列表错误:', error);
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
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const body = await parseJsonBody(ctx);
        if (!body) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '请求体不能为空',
                data: null
            };
            return;
        }
        const command = body.menus;
        const sw = body.switch;
        if (!Array.isArray(command) || command.length === 0) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: 'menus参数格式错误',
                data: null
            };
            return;
        }
        command.pop();
        const name = command.join(':');
        const [state, setState] = useState(`${commandPrefix}:response:${name}`);
        if (state === sw) {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: '状态未发生变化',
                data: null
            };
            return;
        }
        setState(sw);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '状态更新成功',
            data: null
        };
    }
    catch (error) {
        console.error('更新指令状态错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { POST, PUT };
