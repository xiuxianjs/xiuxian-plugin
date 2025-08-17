import { DATA_LIST } from '../../model/DataList.js';
import { validateRole } from '../core/auth.js';

const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const { name } = ctx.query;
        if (!name) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '数据类型不能为空',
                data: null
            };
            return;
        }
        const data = DATA_LIST[name];
        if (!data) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '数据类型不存在',
                data: null
            };
            return;
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取数据成功',
            data: data
        };
    }
    catch (error) {
        logger.error('获取数据列表错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET };
