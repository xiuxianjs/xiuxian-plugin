import { Context } from 'koa';
import { validatePermission, Permission } from '@src/route/core/auth';

import { __PATH, keys } from '@src/model/keys';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { Player } from '@src/types';

// 更新游戏用户数据
export const PUT = async (ctx: Context) => {
  try {
    const res = await validatePermission(ctx, [Permission.GAME_USERS]);

    if (!res) {
      return;
    }

    // 解析请求体
    const body = ctx.request.body;

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
    const player: Player | null = await getDataJSONParseByKey(keys.player(String(id)));

    if (!player) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '用户不存在',
        data: null
      };

      return;
    }

    // 合并数据，只更新提供的字段s
    const updatedUser = {
      ...(typeof player === 'object' && player !== null ? player : {}),
      ...updateData
    };

    // 保存更新后的数据
    await setDataJSONStringifyByKey(keys.player(String(id)), updatedUser);

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
