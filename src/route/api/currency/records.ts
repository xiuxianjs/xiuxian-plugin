import { Context } from 'koa';
import { validateRole } from '@src/route/core/auth';
import { getAllRechargeRecords, getRechargeRecordDetail, getUserRechargeRecords, PaymentStatus, RechargeType } from '@src/model/currency';

// 获取所有充值记录
export const GET = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const page = parseInt(ctx.request.query.page as string) || 1;
    const pageSize = parseInt(ctx.request.query.pageSize as string) || 20;
    const status = ctx.request.query.status as PaymentStatus;
    const rechargeType = ctx.request.query.rechargeType as RechargeType;
    const offset = (page - 1) * pageSize;

    const records = await getAllRechargeRecords(pageSize, offset, status, rechargeType);

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '获取充值记录列表成功',
      data: {
        records,
        page,
        pageSize,
        total: records.length
      }
    };
  } catch (error) {
    logger.error('获取充值记录列表错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 获取指定充值记录详情
export const GET_DETAIL = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const userId = ctx.request.query.userId as string;
    const recordId = ctx.request.query.recordId as string;

    if (recordId) {
      // 获取指定充值记录详情
      const record = await getRechargeRecordDetail(recordId);

      if (record) {
        ctx.status = 200;
        ctx.body = {
          code: 200,
          message: '获取充值记录详情成功',
          data: record
        };
      } else {
        ctx.status = 404;
        ctx.body = {
          code: 404,
          message: '充值记录不存在',
          data: null
        };
      }

      return;
    }

    if (userId) {
      // 获取用户充值记录列表
      const page = parseInt(ctx.request.query.page as string) || 1;
      const pageSize = parseInt(ctx.request.query.pageSize as string) || 20;
      const offset = (page - 1) * pageSize;

      const records = await getUserRechargeRecords(userId, pageSize, offset);

      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: '获取用户充值记录成功',
        data: {
          records,
          page,
          pageSize,
          total: records.length
        }
      };

      return;
    }

    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: '用户ID或记录ID不能为空',
      data: null
    };
  } catch (error) {
    logger.error('获取充值记录详情错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
