import { Text, useSend } from 'alemonjs'
import {
  __PATH,
  addCoin,
  addExp,
  addExp2,
  foundthing,
  addNajieThing
} from '@src/model/index'
import { selects } from '@src/response/index'
import { redis } from '@src/model/api'
export const regular = /^(#|＃|\/)?全体发(灵石|修为|血气)\*\d+$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  const File_length = playerList.length
  // //获取发送灵石数量
  const code = e.MessageText.replace(/^(#|＃|\/)?全体发/, '').split('*')
  const thing_name = code[0]
  let thing_amount: any = Number(code[1])
  if (thing_name == '灵石') {
    for (let i = 0; i < File_length; i++) {
      const this_qq = playerList[i]
      await addCoin(this_qq, thing_amount)
    }
  } else if (thing_name == '修为') {
    for (let i = 0; i < File_length; i++) {
      const this_qq = playerList[i]
      await addExp(this_qq, thing_amount)
    }
  } else if (thing_name == '血气') {
    for (let i = 0; i < File_length; i++) {
      const this_qq = playerList[i]
      await addExp2(this_qq, thing_amount)
    }
  } else {
    const thing_exist = await foundthing(thing_name)
    if (!thing_exist) {
      Send(Text(`这方世界没有[${thing_name}]`))
      return false
    }
    const pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 }
    thing_piji = pj[code[1]]
    if (thing_exist.class == '装备') {
      if (thing_piji) {
        thing_amount = code[2]
      } else {
        thing_piji = 0
      }
    }
    thing_amount = Number(thing_amount)
    if (isNaN(thing_amount)) {
      thing_amount = 1
    }
    for (let i = 0; i < File_length; i++) {
      const this_qq = playerList[i]
      await addNajieThing(
        this_qq,
        thing_name,
        thing_exist.class,
        thing_amount,
        thing_piji
      )
    }
  }
  Send(
    Text(
      `发放成功,目前共有${File_length}个玩家,每人增加${thing_name} x ${thing_amount}`
    )
  )
})
