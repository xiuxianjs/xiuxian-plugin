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
import 'fs';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../model/message.js';
import { parseJsonBody } from '../core/bodyParser.js';
import { validateRole } from '../core/auth.js';

const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const app = ctx.request.query.app;
        const config = await getConfig('', app);
        ctx.body = config;
    }
    catch (error) {
        logger.warn('获取配置失败', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '获取配置失败',
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
        const body = await parseJsonBody(ctx);
        if (!body || Object.keys(body).length === 0) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '请求体为空',
                data: null
            };
            return;
        }
        const name = body.name;
        const data = body.data;
        const setRes = await setConfig(name, data);
        if (!setRes) {
            ctx.status = 500;
            ctx.body = {
                code: 500,
                message: '配置保存失败',
                data: null
            };
            return;
        }
        ctx.body = {
            code: 200,
            message: '配置保存成功',
            data: null
        };
    }
    catch (_error) {
        logger.error(_error);
        ctx.status = 400;
        ctx.body = {
            code: 400,
            message: '请求体格式错误',
            data: null
        };
    }
};

export { GET, POST };
