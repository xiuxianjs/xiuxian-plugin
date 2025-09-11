import { validateRole } from '../core/auth.js';
import { getIoRedis } from '@alemonjs/db';
import { __PATH, keys } from '../../model/keys.js';
import { getDataJSONParseByKey } from '../../model/DataControl.js';

const redis = getIoRedis();
const GET = async (ctx) => {
    try {
        const res = await validateRole(ctx, 'admin');
        if (!res) {
            return;
        }
        const page = parseInt(ctx.request.query.page) || 1;
        const pageSize = parseInt(ctx.request.query.pageSize) || 20;
        const search = ctx.request.query.search || '';
        const associations = [];
        let total = 0;
        const scanPattern = `${__PATH.association}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        if (search) {
            for (const key of allKeys) {
                const associationName = key.replace(`${__PATH.association}:`, '');
                const associationData = await redis.get(key);
                if (associationData) {
                    try {
                        const association = JSON.parse(associationData);
                        const associationWithName = {
                            name: associationName,
                            ...association
                        };
                        const matchesSearch = !search ||
                            associationWithName.宗门名称?.toLowerCase().includes(search.toLowerCase()) ||
                            associationName.toLowerCase().includes(search.toLowerCase());
                        if (matchesSearch) {
                            total++;
                            const startIndex = (page - 1) * pageSize;
                            if (associations.length < pageSize && total > startIndex) {
                                associations.push(associationWithName);
                            }
                        }
                    }
                    catch (error) {
                        logger.error(`解析宗门数据失败 ${associationName}:`, error);
                    }
                }
            }
        }
        else {
            total = allKeys.length;
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedKeys = allKeys.slice(startIndex, endIndex);
            for (const key of paginatedKeys) {
                const associationName = key.replace(`${__PATH.association}:`, '');
                const associationData = await redis.get(key);
                if (associationData) {
                    try {
                        const association = JSON.parse(associationData);
                        const associationWithName = {
                            name: associationName,
                            ...association
                        };
                        associations.push(associationWithName);
                    }
                    catch (error) {
                        logger.error(`解析宗门数据失败 ${associationName}:`, error);
                    }
                }
            }
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取宗门列表成功',
            data: {
                list: associations,
                pagination: {
                    current: page,
                    pageSize: pageSize,
                    total: total,
                    totalPages: Math.ceil(total / pageSize)
                }
            }
        };
    }
    catch (error) {
        logger.error('获取宗门列表错误:', error);
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
        const { associationName } = body;
        if (!associationName) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: '宗门名称不能为空',
                data: null
            };
            return;
        }
        const ass = await getDataJSONParseByKey(keys.association(associationName));
        if (!ass) {
            ctx.status = 404;
            ctx.body = {
                code: 404,
                message: '宗门不存在',
                data: null
            };
            return;
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取宗门详情成功',
            data: {
                name: associationName,
                ...(typeof ass === 'object' ? ass : {})
            }
        };
    }
    catch (error) {
        logger.error('获取宗门详情错误:', error);
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
        const search = ctx.request.query.search || '';
        const scanPattern = `${__PATH.association}:*`;
        let cursor = 0;
        const allKeys = [];
        do {
            const result = await redis.scan(cursor, 'MATCH', scanPattern, 'COUNT', 100);
            cursor = parseInt(result[0]);
            allKeys.push(...result[1]);
        } while (cursor !== 0);
        let total = 0;
        let totalMembers = 0;
        let totalPower = 0;
        let totalLingshi = 0;
        let xianjieCount = 0;
        let fanjieCount = 0;
        if (search) {
            for (const key of allKeys) {
                const associationName = key.replace(`${__PATH.association}:`, '');
                const associationData = await redis.get(key);
                if (associationData) {
                    try {
                        const association = JSON.parse(associationData);
                        const associationWithName = {
                            name: associationName,
                            ...association
                        };
                        const matchesSearch = !search ||
                            associationWithName.宗门名称?.toLowerCase().includes(search.toLowerCase()) ||
                            associationName.toLowerCase().includes(search.toLowerCase());
                        if (matchesSearch) {
                            total++;
                            totalMembers += association.所有成员?.length || 0;
                            totalPower += association.power || 0;
                            totalLingshi += association.灵石池 || 0;
                            if (association.power > 0) {
                                xianjieCount++;
                            }
                            else {
                                fanjieCount++;
                            }
                        }
                    }
                    catch (error) {
                        logger.error(`解析宗门数据失败 ${associationName}:`, error);
                    }
                }
            }
        }
        else {
            total = allKeys.length;
            const sampleKeys = allKeys.slice(0, Math.min(50, allKeys.length));
            for (const key of sampleKeys) {
                const associationName = key.replace(`${__PATH.association}:`, '');
                const associationData = await redis.get(key);
                if (associationData) {
                    try {
                        const association = JSON.parse(associationData);
                        totalMembers += association.所有成员?.length || 0;
                        totalPower += association.power || 0;
                        totalLingshi += association.灵石池 || 0;
                        if (association.power > 0) {
                            xianjieCount++;
                        }
                        else {
                            fanjieCount++;
                        }
                    }
                    catch (error) {
                        logger.error(`解析宗门数据失败 ${associationName}:`, error);
                    }
                }
            }
            if (sampleKeys.length > 0) {
                const ratio = allKeys.length / sampleKeys.length;
                totalMembers = Math.round(totalMembers * ratio);
                totalPower = Math.round(totalPower * ratio);
                totalLingshi = Math.round(totalLingshi * ratio);
                xianjieCount = Math.round(xianjieCount * ratio);
                fanjieCount = Math.round(fanjieCount * ratio);
            }
        }
        ctx.status = 200;
        ctx.body = {
            code: 200,
            message: '获取统计信息成功',
            data: {
                total,
                totalMembers,
                totalPower,
                totalLingshi,
                xianjieCount,
                fanjieCount
            }
        };
    }
    catch (error) {
        logger.error('获取统计信息错误:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            message: '服务器内部错误',
            data: null
        };
    }
};

export { GET, POST, PUT };
