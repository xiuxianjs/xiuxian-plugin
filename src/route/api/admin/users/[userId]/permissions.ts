import { Context } from 'koa';
import { getUserById, validateRole } from '@src/route/core/auth';
import { getIoRedis } from '@alemonjs/db';
import { keys } from '@src/model';

const redis = getIoRedis();

// 获取用户权限
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const userId = ctx.params.userId;

    if (!userId) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID不能为空',
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

    // 这里可以根据用户角色返回对应的权限列表
    // 暂时返回用户角色信息
    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取用户权限成功',
      data: {
        role: user.role,
        permissions: [] // 可以根据角色返回具体权限
      }
    };
  } catch (error) {
    logger.error('获取用户权限错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 更新用户权限
export const PUT = async (ctx: Context) => {
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

    if (!body?.role) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '角色不能为空',
        data: null
      };

      return;
    }

    const { role } = body;

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

    // 更新用户角色
    const updatedUser = {
      ...user,
      role
    };

    await redis.set(keys.serverUser(userId), JSON.stringify(updatedUser));

    const { password: _, ...userWithoutPassword } = updatedUser;

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '用户权限更新成功',
      data: userWithoutPassword
    };
  } catch (error) {
    logger.error('更新用户权限错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
