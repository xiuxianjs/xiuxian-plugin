import { Text, useSend } from 'alemonjs'

import { redis, data } from '@src/api/api'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)释放技能.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let action_res = await redis.get('xiuxian@1.3.0:' + e.UserId + ':bisai')
  const action = await JSON.parse(action_res)
  if (!action) return false
  let msg = e.MessageText.replace('#释放技能', '')
  const jineng = Number(msg) - 1
  if (!action.技能[jineng]) return false
  else {
    if (
      action.技能[jineng].cd <
      data.jineng.find(item => item.name == action.技能[jineng].name).cd
    ) {
      Send(Text(`${action.技能[jineng].name}技能cd中`))
      return false
    }
  }
  action.use = jineng
  await redis.set(
    'xiuxian@1.3.0:' + e.UserId + ':bisai',
    JSON.stringify(action)
  )
  Send(Text(`选择成功,下回合释放技能:${action.技能[jineng].name}`))
})
