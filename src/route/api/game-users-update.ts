import { Context } from 'koa';
import { validateRole } from '@src/route/core/auth';
import { parseJsonBody } from '@src/route/core/bodyParser';
import { getIoRedis } from '@alemonjs/db';
import { __PATH, keys } from '@src/model/keys';

const redis = getIoRedis();

// 更新游戏用户数据
export const PUT = async(ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    // 解析请求体
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

    const { id, ...updateData } = body;

    if (!id) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID不能为空',
        data: null
      };

      return;
    }

    // 检查用户是否存在
    const existingData = await redis.get(keys.player(String(id)));

    if (!existingData) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '用户不存在',
        data: null
      };

      return;
    }

    // 解析现有数据
    let existingUser;

    try {
      existingUser = JSON.parse(existingData);
    } catch (error) {
      logger.error('更新用户数据错误:', error);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '用户数据格式错误',
        data: null
      };

      return;
    }

    // 合并数据，只更新提供的字段
    const updatedUser = {
      ...existingUser,
      ...updateData
    };

    // 保存更新后的数据
    await redis.set(keys.player(String(id)), JSON.stringify(updatedUser));

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '用户更新成功',
      data: {
        id,
        ...updatedUser
      }
    };
  } catch (error) {
    logger.error('更新用户数据错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
