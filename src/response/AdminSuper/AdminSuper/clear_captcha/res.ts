import { Text, useSend } from 'alemonjs'
import { clearCaptchaRecords } from '@src/model/clear-captcha'

export const selects = onSelects(['message.create'])
export const regular = /^(#|＃|\/)?清理验证码(.*)?$/

export default onResponse(selects, async event => {
  if (!event.IsMaster) {
    return
  }

  const Send = useSend(event)
  const match = event.MessageText.match(regular)
  const targetUserId = match?.[2]?.trim()

  try {
    if (targetUserId) {
      // 清理指定用户
      await clearCaptchaRecords(targetUserId)
      Send(Text(`已清理用户 ${targetUserId} 的验证码记录`))
    } else {
      // 清理所有用户
      await clearCaptchaRecords()
      Send(Text('已清理所有用户的验证码记录'))
    }
  } catch (error) {
    logger.error('清理验证码失败:', error)
    Send(Text('清理验证码失败，请检查日志'))
  }
})
