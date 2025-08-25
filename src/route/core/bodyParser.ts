import { Context } from 'koa';

/**
 * 手动解析JSON请求体的工具函数
 * 用于在没有koa-bodyparser中间件的情况下解析POST请求的JSON数据
 */
export const parseJsonBody = async (ctx: Context): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    // 检查Content-Type是否为application/json
    if (ctx.request.headers['content-type']?.includes('application/json')) {
      let data = '';

      // 监听数据流
      ctx.req.on('data', chunk => {
        data += chunk;
      });

      // 数据接收完成
      ctx.req.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (_error) {
          reject(new Error('Invalid JSON format'));
        }
      });

      // 处理错误
      ctx.req.on('error', reject);
    } else {
      // 如果不是JSON格式，返回空对象
      resolve({});
    }
  });
};

/**
 * 解析表单数据的工具函数
 * 用于解析application/x-www-form-urlencoded格式的数据
 */
export const parseFormBody = async (ctx: Context): Promise<Record<string, unknown>> => {
  return new Promise((resolve, reject) => {
    if (ctx.request.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
      let data = '';

      ctx.req.on('data', chunk => {
        data += chunk;
      });

      ctx.req.on('end', () => {
        try {
          const params = new URLSearchParams(data);
          const result: Record<string, unknown> = {};

          for (const [key, value] of params.entries()) {
            result[key] = value;
          }

          resolve(result);
        } catch (_error) {
          reject(new Error('Invalid form data'));
        }
      });

      ctx.req.on('error', reject);
    } else {
      resolve({});
    }
  });
};

/**
 * 通用的body解析函数
 * 根据Content-Type自动选择解析方式
 */
export const parseBody = async (ctx: Context): Promise<Record<string, unknown>> => {
  const contentType = ctx.request.headers['content-type'] || '';

  if (contentType.includes('application/json')) {
    return parseJsonBody(ctx);
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    return parseFormBody(ctx);
  } else {
    return {};
  }
};
