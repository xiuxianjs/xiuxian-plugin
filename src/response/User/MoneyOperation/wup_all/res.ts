import { Text, useSend } from 'alemonjs'
import {
  __PATH,
  Add_灵石,
  Add_修为,
  Add_血气,
  foundthing,
  addNajieThing
} from '@src/model'
import { selects } from '@src/response/index'
import { redis } from '@src/api/api'
export const regular = /^(#|＃|\/)?全体发(灵石|修为|血气)\*\d+$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) return false
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  let File_length = playerList.length
  // //获取发送灵石数量
  let code = e.MessageText.replace(/^(#|＃|\/)?全体发/, '').split('*')
  let thing_name = code[0]
  let thing_amount: any = Number(code[1])
  if (thing_name == '灵石') {
    for (let i = 0; i < File_length; i++) {
      let this_qq = playerList[i]
      await Add_灵石(this_qq, thing_amount)
    }
  } else if (thing_name == '修为') {
    for (let i = 0; i < File_length; i++) {
      let this_qq = playerList[i]
      await Add_修为(this_qq, thing_amount)
    }
  } else if (thing_name == '血气') {
    for (let i = 0; i < File_length; i++) {
      let this_qq = playerList[i]
      await Add_血气(this_qq, thing_amount)
    }
  } else {
    let thing_exist = await foundthing(thing_name)
    if (!thing_exist) {
      Send(Text(`这方世界没有[${thing_name}]`))
      return false
    }
    let pj = { 劣: 0, 普: 1, 优: 2, 精: 3, 极: 4, 绝: 5, 顶: 6 }
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
      let this_qq = playerList[i]
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
