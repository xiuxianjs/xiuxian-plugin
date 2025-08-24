import { Context } from 'koa'
import { validateRole } from '@src/route/core/auth'
import { parseJsonBody } from '@src/route/core/bodyParser'
import {
  rechargeUserCurrency,
  rechargeUserSmallMonthCard,
  rechargeUserBigMonthCard,
  completeRechargePayment
} from '@src/model/currency'

// 创建充值记录
export const POST = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin')
    if (!res) {
      return
    }

    const body = await parseJsonBody(ctx)
    const {
      action,
      userId,
      amount,
      tier,
      paymentMethod = 'admin',
      ipAddress = '',
      deviceInfo = ''
    } = body as {
      action: string
      userId?: string
      amount?: number
      tier?: string
      paymentMethod?: string
      ipAddress?: string
      deviceInfo?: string
    }

    switch (action) {
      case 'recharge-currency': {
        if (!userId || !amount || !tier) {
          ctx.status = 400
          ctx.body = {
            code: 400,
            message: '用户ID、充值金额和档位不能为空',
            data: null
          }
          return
        }

        const currencyRecord = await rechargeUserCurrency(
          userId,
          amount,
          tier,
          paymentMethod,
          ipAddress,
          deviceInfo
        )

        ctx.status = 201
        ctx.body = {
          code: 201,
          message: '创建金币充值记录成功',
          data: currencyRecord
        }
        break
      }

      case 'recharge-small-month-card': {
        if (!userId) {
          ctx.status = 400
          ctx.body = {
            code: 400,
            message: '用户ID不能为空',
            data: null
          }
          return
        }

        const smallMonthCardRecord = await rechargeUserSmallMonthCard(
          userId,
          paymentMethod,
          ipAddress,
          deviceInfo
        )

        ctx.status = 201
        ctx.body = {
          code: 201,
          message: '创建小月卡充值记录成功',
          data: smallMonthCardRecord
        }
        break
      }

      case 'recharge-big-month-card': {
        if (!userId) {
          ctx.status = 400
          ctx.body = {
            code: 400,
            message: '用户ID不能为空',
            data: null
          }
          return
        }

        const bigMonthCardRecord = await rechargeUserBigMonthCard(
          userId,
          paymentMethod,
          ipAddress,
          deviceInfo
        )

        ctx.status = 201
        ctx.body = {
          code: 201,
          message: '创建大月卡充值记录成功',
          data: bigMonthCardRecord
        }
        break
      }

      case 'complete-payment': {
        const { recordId, transactionId } = body as {
          recordId?: string
          transactionId?: string
        }

        if (!recordId || !transactionId) {
          ctx.status = 400
          ctx.body = {
            code: 400,
            message: '充值记录ID和交易号不能为空',
            data: null
          }
          return
        }

        const completedRecord = await completeRechargePayment(
          recordId,
          transactionId,
          paymentMethod
        )

        ctx.status = 200
        ctx.body = {
          code: 200,
          message: '完成充值支付成功',
          data: completedRecord
        }
        break
      }

      default:
        ctx.status = 400
        ctx.body = {
          code: 400,
          message: '无效的操作类型',
          data: null
        }
    }
  } catch (error) {
    logger.error('创建充值记录错误:', error)
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    }
  }
}
