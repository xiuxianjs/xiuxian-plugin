import { getIoRedis } from '@alemonjs/db'
import { keys } from '@src/model'
import {
  generateCaptcha,
  svgToPngBuffer,
  verifyCaptcha
} from '@src/model/captcha'
import { baseKey } from '@src/model/constants'
import { Image, Text, useMessage } from 'alemonjs'
import dayjs from 'dayjs'

// 回复次数缓存
const replyCount: Record<string, number> = {}
// 验证码尝试次数缓存
const captchaTries: Record<string, number> = {}

const MAX_CAPTCHA_TRIES = 10

const selects = onSelects(['message.create', 'private.message.create'])

function isNight(hour: number) {
  // 夜晚 23:00~06:59
  return hour >= 23 || hour < 7
}

export default onMiddleware(selects, async (event, next) => {
  const userId = event.UserId
  const redis = getIoRedis()
  const [message] = useMessage(event)

  // 1. 检查禁言
  const muteTime = await redis.get(keys.mute(userId))
  if (muteTime) {
    const count = replyCount[userId] || 0
    if (count < 3) {
      message.send(
        format(
          Text(
            `修仙功能已被禁言，限制将于${dayjs(muteTime).format('YYYY-MM-DD HH:mm:ss')}解除。`
          )
        )
      )
      replyCount[userId] = count + 1
    }
    return
  }

  // 2. 校验是否需要输入验证码
  const captchaExists = await redis.exists(keys.captcha(userId))
  if (captchaExists) {
    const text = event.MessageText?.trim()
    if (!text) {
      // 重新生成验证码图片
      const captcha = await generateCaptcha(userId)
      const img = await svgToPngBuffer(captcha)
      message.send(format(Image(img)))
      return
    }
    const success = await verifyCaptcha(userId, text)
    if (success) {
      message.send(format(Text('验证码正确，欢迎继续操作！')))
      // 清理验证码相关数据
      await redis.del(keys.captcha(userId))
      await redis.del(keys.mute(userId))
      captchaTries[userId] = 0
      // 重置操作计数为较低值，避免立即再次触发验证码
      const now = dayjs()
      const hourKey = `${baseKey}:op:${userId}:${now.format('YYYYMMDDHH')}`
      await redis.set(hourKey, '30', 'EX', 60 * 60 * 4) // 设置为30次，避免立即触发

      // 清理前几个小时的操作记录，避免连续游玩检测触发
      for (let i = 1; i <= 3; i++) {
        const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH')
        const pastHourKey = `${baseKey}:op:${userId}:${checkHour}`
        await redis.del(pastHourKey)
      }

      // 设置验证码通过标记，避免短时间内重复触发
      await redis.set(`${baseKey}:captcha_passed:${userId}`, '1', 'EX', 300) // 5分钟内不再触发验证码
      next()
      return
    } else {
      captchaTries[userId] = (captchaTries[userId] || 0) + 1
      if (captchaTries[userId] >= MAX_CAPTCHA_TRIES) {
        message.send(format(Text('错误次数过多，你已被临时禁言6小时！')))
        await redis.set(
          keys.mute(userId),
          Date.now() + 1000 * 60 * 60 * 6,
          'PX',
          1000 * 60 * 60 * 6
        )
        await redis.del(keys.captcha(userId))
        captchaTries[userId] = 0
        return
      } else {
        const captcha = await generateCaptcha(userId)
        const img = await svgToPngBuffer(captcha)
        message.send(format(Image(img)))
      }
    }
    return
  }

  // 3. 检查操作频率——小时统计
  const now = dayjs()
  const hourKey = `${baseKey}:op:${userId}:${now.format('YYYYMMDDHH')}`
  const opCount = await redis.incr(hourKey)
  if (opCount === 1) {
    await redis.expire(hourKey, 60 * 60 * 4) // 4小时后过期
  }
  const hour = now.hour()
  const hourLimit = isNight(hour) ? 90 : 120

  // 3.1 超过阈值，触发验证码
  if (opCount >= hourLimit) {
    // 检查是否刚通过验证码
    const captchaPassed = await redis.exists(
      `${baseKey}:captcha_passed:${userId}`
    )
    if (!captchaPassed) {
      const captcha = await generateCaptcha(userId)
      const img = await svgToPngBuffer(captcha)
      message.send(format(Image(img)))
      return
    }
  }

  // 4. 检查连续游玩时长——连续3小时都有操作
  // 拿最近3个小时，但排除当前小时（因为刚重置过）
  let allActive = true
  for (let i = 1; i <= 3; i++) {
    const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH')
    const key = `${baseKey}:op:${userId}:${checkHour}`
    const count = await redis.get(key)
    if (!count || parseInt(count) === 0) {
      allActive = false
      break
    }
  }
  if (allActive) {
    // 检查是否刚通过验证码
    const captchaPassed = await redis.exists(
      `${baseKey}:captcha_passed:${userId}`
    )
    if (!captchaPassed) {
      const captcha = await generateCaptcha(userId)
      const img = await svgToPngBuffer(captcha)
      message.send(format(Image(img)))
      return
    }
  }

  // 5. 正常放行
  next()
})
