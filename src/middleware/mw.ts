import { getIoRedis } from '@alemonjs/db'
import { keys } from '@src/model'
import {
  generateCaptcha,
  svgToPngBuffer,
  verifyCaptcha
} from '@src/model/captcha'
import { baseKey } from '@src/model/constants'
import { Image, Mention, Text, useMessage } from 'alemonjs'
import dayjs from 'dayjs'

// 回复次数缓存（内存，防止频繁提醒）
const replyCount: Record<string, number> = {}

// 验证码尝试次数缓存（内存，防止暴力尝试）
const captchaTries: Record<string, number> = {}

const MAX_CAPTCHA_TRIES = 6 // 最大验证码尝试次数
const MIN_COUNT = 90 // 夜间阈值
const MAX_COUNT = 120 // 白天阈值

const selects = onSelects(['message.create', 'private.message.create'])

// 判断是否为夜晚（23:00~06:59）
function isNight(hour: number) {
  return hour >= 23 || hour < 7
}

// 操作计数 Redis key
const op = (userId: string) =>
  `${baseKey}:op:${userId}:${dayjs().format('YYYYMMDDHH')}`

export default onMiddleware(selects, async (event, next) => {
  const userId = event.UserId
  const redis = getIoRedis()
  // 仅有存档才校验
  const exist = await redis.exists(keys.player(userId))
  if (exist === 0) {
    next()
    return
  }

  const [message] = useMessage(event)
  const now = dayjs()

  // 1. 检查禁言
  const muteTtl = await redis.ttl(keys.mute(userId))
  if (muteTtl > 0) {
    const unlockTime = dayjs()
      .add(muteTtl, 'second')
      .format('YYYY-MM-DD HH:mm:ss')
    const count = replyCount[userId] || 0
    if (count < 2) {
      message.send(
        format(Text(`你的修仙功能已被禁言，限制将于${unlockTime}解除。`))
      )
      replyCount[userId] = count + 1
    }
    return
  }

  // 2. 校验是否需要输入验证码
  const captchaExists = await redis.exists(keys.captcha(userId))
  if (captchaExists) {
    const text = event.MessageText?.trim()

    // 非验证码消息时，不进行校验（4~8位字母数字，可根据实际生成规则调整正则）
    if (!/^[a-zA-Z0-9]{1,9}$/.test(text)) {
      logger.debug(`用户 ${userId} 输入的消息不符合验证码格式`)
      return
    }

    const success = await verifyCaptcha(userId, text)
    if (success) {
      message.send(format(Text('验证码正确！'), Mention(userId)))
      // 清理验证码与禁言数据
      await redis.del(keys.captcha(userId))
      await redis.del(keys.mute(userId))
      captchaTries[userId] = 0

      // 重置操作计数 6 小时过期
      await redis.setex(op(userId), 60 * 60 * 6, '1')

      // 清理前三小时操作记录，避免连续游玩风控
      for (let i = 1; i <= 3; i++) {
        const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH')
        const pastHourKey = `${baseKey}:op:${userId}:${checkHour}`
        await redis.del(pastHourKey)
      }

      // 验证码通过豁免 1 小时
      await redis.setex(`${baseKey}:captcha_passed:${userId}`, 60 * 60, '1')

      next()
      return
    } else {
      captchaTries[userId] = (captchaTries[userId] || 0) + 1
      if (captchaTries[userId] >= MAX_CAPTCHA_TRIES) {
        message.send(
          format(Text('错误次数过多，你已被临时禁言6小时！'), Mention(userId))
        )
        // 设置禁言，仅用过期，value为'1'
        await redis.setex(keys.mute(userId), 60 * 60 * 6, '1')
        // 清理验证码
        await redis.del(keys.captcha(userId))
        captchaTries[userId] = 0
        return
      } else {
        const { svg, text } = await generateCaptcha()
        await redis.setex(keys.captcha(userId), 60 * 60 * 6, text.toLowerCase())
        const img = await svgToPngBuffer(svg)
        message.send(format(Image(img), Mention(userId)))
      }
    }
    return
  }

  // 3. 检查近3小时操作数
  let count = 0
  for (let i = 1; i <= 3; i++) {
    const checkHour = now.subtract(i, 'hour').format('YYYYMMDDHH')
    const key = `${baseKey}:op:${userId}:${checkHour}`
    const c = await redis.get(key)
    if (c && parseInt(c) >= 10) {
      count += parseInt(c)
    }
  }

  const hour = now.hour()
  const countLimit = isNight(hour) ? MIN_COUNT : MAX_COUNT

  // 连续3小时活跃过多，需风控
  if (count > countLimit) {
    // 检查是否刚通过验证码
    const captchaPassed = await redis.exists(
      `${baseKey}:captcha_passed:${userId}`
    )
    if (!captchaPassed) {
      const { svg, text } = await generateCaptcha()
      await redis.setex(keys.captcha(userId), 60 * 60 * 6, text.toLowerCase())
      const img = await svgToPngBuffer(svg)
      message.send(format(Image(img), Mention(userId)))
      return
    }
  }

  // 4. 操作计数自增，首次操作设置4小时过期
  const hourKey = `${baseKey}:op:${userId}:${now.format('YYYYMMDDHH')}`
  const opCount = await redis.incr(hourKey)
  if (opCount === 1) {
    await redis.expire(hourKey, 60 * 60 * 4)
  }

  logger.debug(`用户 ${userId} 当前操作次数: ${opCount}`)

  // 正常放行
  next()
})
