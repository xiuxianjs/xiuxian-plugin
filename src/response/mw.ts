import { COMMAND_NAME, postLogCommand } from '@src/model/posthog'

export const selects = onSelects([
  'message.create',
  'private.message.create',
  'private.interaction.create',
  'interaction.create'
])

export default onResponse(selects, async e => {
  postLogCommand({
    id: e.UserId,
    value: e.MessageText,
    name: COMMAND_NAME.HELP,
    ext: {
      username: e.UserName
    }
  })
  // 这个 响应允许成组
  return true
})
