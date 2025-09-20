import { Context } from 'koa';
import { getUserById, validatePermission, Permission } from '@src/route/core/auth';
import { getIoRedis } from '@alemonjs/db';
import { keys } from '@src/model';

const redis = getIoRedis();

// 更新用户状态
export const PUT = async (ctx: Context) => {
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

    // 验证状态值
    if (!['active', 'inactive', 'suspended'].includes(status)) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '无效的状态值',
        data: null
      };

      return;
    }

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

    // 更新用户状态
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
  } catch (error) {
    logger.error('更新用户状态错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
