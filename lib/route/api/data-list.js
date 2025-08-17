import { getDataList, hasDataList, setDataList } from '../../model/DataList.js';
import { validateRole } from '../core/auth.js';

const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const { name, page, pageSize, search } = ctx.query;
        if (!name) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '数据类型不能为空',
                data: {
                    list: []
                }
            };
            return;
        }
        const data = await getDataList(name);
        if (!data) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '数据类型不存在',
                data: {
                    list: []
                }
            };
            return;
        }
        let filteredData = data;
        if (search) {
            filteredData = data.filter((item) => {
                return Object.values(item).some(value => String(value).toLowerCase().includes(search.toLowerCase()));
            });
        }
        const currentPage = parseInt(page || '1');
        const currentPageSize = parseInt(pageSize || '10');
        const startIndex = (currentPage - 1) * currentPageSize;
        const endIndex = startIndex + currentPageSize;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: `获取${name}数据成功`,
            data: {
                list: paginatedData,
                pagination: {
                    current: currentPage,
                    pageSize: currentPageSize,
                    total: filteredData.length,
                    totalPages: Math.ceil(filteredData.length / currentPageSize)
                }
            }
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
const PUT = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const { name, data, batchMode } = ctx.request.body;
        if (!name) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '数据类型不能为空',
                data: null
            };
            return;
        }
        if (!Array.isArray(data)) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '数据格式错误，必须是数组',
                data: null
            };
            return;
        }
        if (!hasDataList(name)) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '数据类型不存在',
                data: null
            };
            return;
        }
        if (batchMode && data.length > 1000) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '批量更新数据量过大，请分批处理',
                data: null
            };
            return;
        }
        await setDataList(name, data);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '数据更新成功',
            data: {
                updatedCount: data.length,
                batchMode: batchMode || false
            }
        };
    }
    catch (error) {
        logger.error('更新数据列表错误:', error);
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
        const { name, updates, chunkSize = 100 } = ctx.request.body;
        if (!name) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '数据类型不能为空',
                data: null
            };
            return;
        }
        if (!Array.isArray(updates)) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '更新数据格式错误',
                data: null
            };
            return;
        }
        if (!hasDataList(name)) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '数据类型不存在',
                data: null
            };
            return;
        }
        const currentData = await getDataList(name);
        const chunks = [];
        for (let i = 0; i < updates.length; i += chunkSize) {
            chunks.push(updates.slice(i, i + chunkSize));
        }
        let updatedCount = 0;
        for (const chunk of chunks) {
            for (const update of chunk) {
                if (currentData[update.index]) {
                    currentData[update.index] = {
                        ...currentData[update.index],
                        ...update.data
                    };
                    updatedCount++;
                }
            }
        }
        await setDataList(name, currentData);
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '批量更新成功',
            data: {
                updatedCount,
                totalChunks: chunks.length,
                chunkSize
            }
        };
    }
    catch (error) {
        logger.error('批量更新数据错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, PATCH, PUT };
