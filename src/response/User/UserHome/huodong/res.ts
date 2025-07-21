import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data, redis } from '@src/api/api'
import { existplayer, Add_najie_thing } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)活动兑换.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let name = e.MessageText.replace('#活动兑换', '')
  name = name.trim()
  let i //获取对应npc列表的位置
  for (i = 0; i < data.duihuan.length; i++) {
    if (data.duihuan[i].name == name) {
      break
    }
  }
  if (i == data.duihuan.length) {
    Send(Text('兑换码不存在!'))
    return false
  }
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':duihuan') //兑换码
  action = await JSON.parse(action)
  if (action == null) {
    action = []
  }
  for (let k = 0; k < action.length; k++) {
    if (action[k] == name) {
      Send(Text('你已经兑换过该兑换码了'))
      return false
    }
  }
  action.push(name)
  await redis.set(
    'xiuxian@1.3.0:' + usr_qq + ':duihuan',
    JSON.stringify(action)
  )
  let msg = []
  for (let k = 0; k < data.duihuan[i].thing.length; k++) {
    await Add_najie_thing(
      usr_qq,
      data.duihuan[i].thing[k].name,
      data.duihuan[i].thing[k].class,
      data.duihuan[i].thing[k].数量
    )
    msg.push(
      '\n' + data.duihuan[i].thing[k].name + 'x' + data.duihuan[i].thing[k].数量
    )
  }
  Send(Text('恭喜获得:' + msg))
})
