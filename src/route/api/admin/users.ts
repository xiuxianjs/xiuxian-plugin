import { Context } from 'koa';
import { createUser, getAllUsers, deleteUser, validatePermission } from '@src/route/core/auth';

// 获取所有用户
export const GET = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, ['admin', 'super_admin']);

    if (!res) {
      return;
    }

    const users = await getAllUsers();
    const usersWithoutPassword = users.map(({ password: _, ...user }) => user);

    // 获取查询参数
    const page = parseInt(ctx.query.page as string) || 1;
    const pageSize = parseInt(ctx.query.pageSize as string) || 10;
    const search = ctx.query.search as string;
    const role = ctx.query.role as string;
    const status = ctx.query.status as string;

    // 过滤用户
    let filteredUsers = usersWithoutPassword;

    if (search) {
      filteredUsers = filteredUsers.filter(user => user.username.toLowerCase().includes(search.toLowerCase()));
    }

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status);
    }

    // 分页
    const total = filteredUsers.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取用户列表成功',
      data: {
        users: paginatedUsers,
        total,
        page,
        pageSize
      }
    };
  } catch (error) {
    logger.error('获取用户列表错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 创建用户
export const POST = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, ['admin', 'super_admin']);

    if (!res) {
      return;
    }

    const body = ctx.request.body;
    const {
      username,
      password,
      role = 'admin'
    } = body as {
      username?: string;
      password?: string;
      role?: string;
    };

    if (!username || !password) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户名和密码不能为空',
        data: null
      };

      return;
    }

    const result = await createUser(username, password, role);

    if (result.success && result.user) {
      const { password: _, ...userWithoutPassword } = result.user;

      ctx.status = 201;
      ctx.body = {
        code: 201,
        message: '用户创建成功',
        data: userWithoutPassword
      };
    } else {
      let message = '创建用户失败';

      if (result.error === 'USERNAME_EXISTS') {
        message = '用户名已存在';
      } else if (result.error === 'SUPER_ADMIN_EXISTS') {
        message = '超级管理员已存在，无法创建新的超级管理员';
      } else if (result.error === 'UNKNOWN_ERROR') {
        message = '创建用户时发生未知错误';
      }

      ctx.status = 400;
      ctx.body = {
        code: 400,
        message,
        data: null
      };
    }
  } catch (error) {
    logger.error('创建用户错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 删除用户
export const DELETE = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, ['admin', 'super_admin']);

    if (!res) {
      return;
    }

    const body = ctx.request.body;
    const { userId } = body as { userId?: string };

    if (!userId) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID不能为空',
        data: null
      };

      return;
    }

    const success = await deleteUser(userId);

    if (success) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: '用户删除成功',
        data: null
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '用户不存在或无法删除超级管理员',
        data: null
      };
    }
  } catch (error) {
    logger.error('删除用户错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
