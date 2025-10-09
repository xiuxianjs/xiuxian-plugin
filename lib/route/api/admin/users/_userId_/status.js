import { validatePermission, Permission, getUserById } from '../../../../core/auth.js';
import { getIoRedis } from '@alemonjs/db';
import '../../../../../model/api.js';
import { keys } from '../../../../../model/keys.js';
import '../../../../../model/DataList.js';
import 'jsxp';
import 'md5';
import 'react';
import '../../../../../resources/img/state.jpg.js';
import '../../../../../resources/styles/tw.scss.js';
import '../../../../../resources/font/tttgbnumber.ttf.js';
import 'classnames';
import '../../../../../resources/img/player.jpg.js';
import '../../../../../resources/img/player_footer.png.js';
import '../../../../../resources/img/user_state.png.js';
import '../../../../../resources/img/fairyrealm.jpg.js';
import '../../../../../resources/img/card.jpg.js';
import '../../../../../resources/img/road.jpg.js';
import '../../../../../resources/img/user_state2.png.js';
import '../../../../../resources/html/help.js';
import '../../../../../resources/img/najie.jpg.js';
import '../../../../../resources/img/shituhelp.jpg.js';
import '../../../../../resources/img/icon.png.js';
import '../../../../../resources/styles/temp.scss.js';
import 'fs';
import 'dayjs';
import 'buffer';
import 'alemonjs';
import '../../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import 'lodash-es';
import '../../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../../model/message.js';

const redis = getIoRedis();
const PUT = async (ctx) => {
    try {
        const res = await validatePermission(ctx, [Permission.USER_UPDATE]);
        if (!res) {
            return;
        }
        const userId = ctx.params.userId;
        const body = ctx.request.body;
        if (!userId) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '用户ID不能为空',
                data: null
            };
            return;
        }
        if (!body?.status) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '状态不能为空',
                data: null
            };
            return;
        }
        const { status } = body;
        if (!['active', 'inactive', 'suspended'].includes(status)) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '无效的状态值',
                data: null
            };
            return;
        }
        const user = await getUserById(userId);
        if (!user) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '用户不存在',
                data: null
            };
            return;
        }
        const updatedUser = {
            ...user,
            status
        };
        await redis.set(keys.serverUser(userId), JSON.stringify(updatedUser));
        const { password: _, ...userWithoutPassword } = updatedUser;
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '用户状态更新成功',
            data: userWithoutPassword
        };
    }
    catch (error) {
        logger.error('更新用户状态错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { PUT };
