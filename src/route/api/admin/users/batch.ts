import { Context } from 'koa';
import { validateRole, deleteUser, getUserById } from '@src/route/core/auth';
import { getIoRedis } from '@alemonjs/db';
import { keys } from '@src/model';

const redis = getIoRedis();

// 批量操作用户
export const POST = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = ctx.request.body;

    if (!body?.action || !body.userIds) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '操作类型和用户ID列表不能为空',
        data: null
      };

      return;
    }

    const { action, userIds } = body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '用户ID列表必须是非空数组',
        data: null
      };

      return;
    }

    const results = [];

    for (const userId of userIds) {
      try {
        switch (action) {
          case 'delete': {
            const deleteSuccess = await deleteUser(userId);

            results.push({
              userId,
              success: deleteSuccess,
              message: deleteSuccess ? '删除成功' : '删除失败'
            });
            break;
          }

          case 'activate': {
            const user = await getUserById(userId);

            if (user) {
              const updatedUser = { ...user, status: 'active' };

              await redis.set(keys.serverUser(userId), JSON.stringify(updatedUser));
              results.push({
                userId,
                success: true,
                message: '激活成功'
              });
            } else {
              results.push({
                userId,
                success: false,
                message: '用户不存在'
              });
            }
            break;
          }

          case 'deactivate': {
            const user2 = await getUserById(userId);

            if (user2) {
              const updatedUser = { ...user2, status: 'inactive' };

              await redis.set(keys.serverUser(userId), JSON.stringify(updatedUser));
              results.push({
                userId,
                success: true,
                message: '停用成功'
              });
            } else {
              results.push({
                userId,
                success: false,
                message: '用户不存在'
              });
            }
            break;
          }

          case 'suspend': {
            const user3 = await getUserById(userId);

            if (user3) {
              const updatedUser = { ...user3, status: 'suspended' };

              await redis.set(keys.serverUser(userId), JSON.stringify(updatedUser));
              results.push({
                userId,
                success: true,
                message: '暂停成功'
              });
            } else {
              results.push({
                userId,
                success: false,
                message: '用户不存在'
              });
            }
            break;
          }

          default: {
            results.push({
              userId,
              success: false,
              message: '不支持的操作类型'
            });
          }
        }
      } catch (error) {
        logger.error(error);
        results.push({
          userId,
          success: false,
          message: '操作失败'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: `批量操作完成，成功 ${successCount} 个，失败 ${failCount} 个`,
      data: {
        results,
        summary: {
          total: results.length,
          success: successCount,
          failed: failCount
        }
      }
    };
  } catch (error) {
    logger.error('批量操作用户错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
