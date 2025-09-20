import { Context } from 'koa';
import { getUserById, validateRole } from '@src/route/core/auth';
import { getIoRedis } from '@alemonjs/db';
import { keys } from '@src/model';

const redis = getIoRedis();

// 重置用户密码
export const POST = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

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

    if (!body?.newPassword) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '新密码不能为空',
        data: null
      };

      return;
    }

    const { newPassword } = body;

    // 获取用户信息
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

    // 更新密码
    const updatedUser = {
      ...user,
      password: newPassword
    };

    await redis.set(keys.serverUser(userId), JSON.stringify(updatedUser));

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '密码重置成功',
      data: null
    };
  } catch (error) {
    logger.error('重置密码错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
