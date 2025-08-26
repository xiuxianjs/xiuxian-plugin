import { Context } from 'koa';
import { validateLogin, validateToken } from '@src/route/core/auth';
import { parseJsonBody } from '@src/route/core/bodyParser';

// 登录接口
export const POST = async (ctx: Context) => {
  try {
    const body = await parseJsonBody(ctx);
    const { username, password } = body as {
      username: string;
      password: string;
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

    const result = await validateLogin(username, password);

    if (result.success) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: result.message,
        data: null
      };
    }
  } catch (error) {
    logger.error('登录接口错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 验证token接口
export const GET = async (ctx: Context) => {
  try {
    const token =
      ctx.request.headers.authorization?.replace('Bearer ', '') ||
      (ctx.request.query.token as string);

    if (!token) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: 'Token不能为空',
        data: null
      };

      return;
    }

    const user = await validateToken(token);

    if (user) {
      const { password: _password, ...userWithoutPassword } = user;

      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: 'Token验证成功',
        data: {
          user: userWithoutPassword,
          valid: true
        }
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: 'Token无效或已过期',
        data: {
          valid: false
        }
      };
    }
  } catch (error) {
    logger.error('Token验证接口错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
