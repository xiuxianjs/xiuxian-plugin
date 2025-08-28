import { DataListKeys, getDataList, hasDataList, setDataList } from '@src/model/DataList';
import { Context } from 'koa';
import { validateRole } from '@src/route/core/auth';
import { parseJsonBody } from '../core/bodyParser';

/**
 * 查询数据列表
 * @param ctx
 * @returns
 */
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const { name, page, pageSize, search } = ctx.query as {
      name: DataListKeys;
      page?: string;
      pageSize?: string;
      search?: string;
    };

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
    const filteredData = search
      ? data.filter(item => {
          return Object.values(item).some(value => String(value).toLowerCase().includes(search.toLowerCase())
          );
        })
      : data;

    // 分页处理
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
  } catch (error) {
    logger.error('获取数据列表错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

/**
 * 更新数据列表
 * @param ctx
 * @returns
 */
export const PUT = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = await parseJsonBody(ctx);
    const { name, data, batchMode } = body as {
      name: DataListKeys;
      data: Record<string, unknown>[];
      batchMode?: boolean;
    };

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

    // 验证数据类型是否存在
    if (!hasDataList(name)) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '数据类型不存在',
        data: null
      };

      return;
    }

    // 如果是批量模式，进行数据验证
    if (batchMode && data.length > 1000) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '批量更新数据量过大，请分批处理',
        data: null
      };

      return;
    }

    // 保存数据到Redis
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
  } catch (error) {
    logger.error('更新数据列表错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

/**
 * 批量更新数据（支持分块处理）
 * @param ctx
 * @returns
 */
export const PATCH = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = await parseJsonBody(ctx);
    const {
      name,
      updates,
      chunkSize = 100
    } = body as {
      name: DataListKeys;
      updates: Array<{ index: number; data: Record<string, unknown> }>;
      chunkSize?: number;
    };

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

    // 验证数据类型是否存在
    if (!hasDataList(name)) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '数据类型不存在',
        data: null
      };

      return;
    }

    // 获取当前数据
    const currentData = await getDataList(name);

    // 分块处理更新
    const chunks: Array<{ index: number; data: Record<string, unknown> }[]> = [];

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

    // 保存更新后的数据
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
  } catch (error) {
    logger.error('批量更新数据错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
