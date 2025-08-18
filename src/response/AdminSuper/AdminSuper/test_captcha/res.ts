import { Image, Text, useSend } from 'alemonjs'
import { generateCaptcha, svgToPngBuffer } from '@src/model/captcha'
import { getIoRedis } from '@alemonjs/db'
import { keys } from '@src/model'

export const selects = onSelects(['message.create'])
export const regular = /^(#|＃|\/)?测试验证码$/

export default onResponse(selects, async event => {
  if (!event.IsMaster) {
    return
  }

  const Send = useSend(event)
  const userId = event.UserId

  try {
    // 生成测试验证码
    const captcha = await generateCaptcha(userId, 300) // 5分钟过期
    const img = await svgToPngBuffer(captcha)

    // 获取验证码答案用于测试
    const redis = getIoRedis()
    const answer = await redis.get(keys.captcha(userId))

    Send(Text(`测试验证码已生成，答案: ${answer}`))
    Send(Image(img))
  } catch (error) {
    logger.error('测试验证码失败:', error)
    Send(Text('测试验证码失败，请检查日志'))
  }
})
