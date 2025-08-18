import { getIoRedis } from '@alemonjs/db'
import { keys } from '@src/model'
import { baseKey } from '@src/model/constants'

/**
 * 清理指定用户的验证码相关记录
 * @param userId 用户ID，如果不提供则清理所有用户
 */
export async function clearCaptchaRecords(userId?: string) {
  const redis = getIoRedis()

  try {
    if (userId) {
      // 清理指定用户
      await clearUserCaptchaRecords(redis, userId)
      console.log(`已清理用户 ${userId} 的验证码记录`)
    } else {
      // 清理所有用户
      await clearAllCaptchaRecords(redis)
      console.log('已清理所有用户的验证码记录')
    }
  } catch (error) {
    console.error('清理验证码记录失败:', error)
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function clearUserCaptchaRecords(redis: any, userId: string) {
  // 清理验证码
  await redis.del(keys.captcha(userId))

  // 清理禁言记录
  await redis.del(keys.mute(userId))

  // 清理操作计数（最近24小时）
  const now = new Date()
  for (let i = 0; i < 24; i++) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hourKey = `${baseKey}:op:${userId}:${hour.getFullYear()}${String(hour.getMonth() + 1).padStart(2, '0')}${String(hour.getDate()).padStart(2, '0')}${String(hour.getHours()).padStart(2, '0')}`
    await redis.del(hourKey)
  }

  // 清理验证码通过标记
  await redis.del(`${baseKey}:captcha_passed:${userId}`)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function clearAllCaptchaRecords(redis: any) {
  // 获取所有验证码相关的key
  const captchaPattern = keys.captcha('*')
  const mutePattern = keys.mute('*')
  const opPattern = `${baseKey}:op:*`

  // 清理验证码
  const captchaKeys = await redis.keys(captchaPattern)
  if (captchaKeys.length > 0) {
    await redis.del(...captchaKeys)
    console.log(`清理了 ${captchaKeys.length} 个验证码记录`)
  }

  // 清理禁言记录
  const muteKeys = await redis.keys(mutePattern)
  if (muteKeys.length > 0) {
    await redis.del(...muteKeys)
    console.log(`清理了 ${muteKeys.length} 个禁言记录`)
  }

  // 清理操作计数
  const opKeys = await redis.keys(opPattern)
  if (opKeys.length > 0) {
    await redis.del(...opKeys)
    console.log(`清理了 ${opKeys.length} 个操作计数记录`)
  }
}

// 注意：此文件仅作为模块导出，如需直接运行请使用 scripts/clear-captcha-standalone.js
