import { Text, useSend } from 'alemonjs'

import { redis, data } from '@src/api/api'
import {
  existplayer,
  looktripod,
  convert2integer,
  foundthing,
  exist_najie_thing,
  Read_mytripod,
  Read_danyao,
  Read_tripod,
  Write_duanlu,
  Add_najie_thing
} from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)熔炼.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const user_qq = e.UserId //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) return false
  //不开放私聊
  //获取游戏状态
  const game_action = await redis.get(
    'xiuxian@1.3.0:' + user_qq + ':game_action'
  )
  //防止继续其他娱乐行为
  if (+game_action == 0) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  const A = await looktripod(user_qq)
  if (A != 1) {
    Send(Text(`请先去#炼器师能力评测,再来煅炉吧`))
    return false
  }
  const player = await data.getData('player', user_qq)
  if (player.occupation != '炼器师') {
    Send(Text(`切换到炼器师后再来吧,宝贝`))
    return false
  }
  let thing = e.MessageText.replace('#', '')
  thing = thing.replace('熔炼', '')
  const code = thing.split('*')
  const thing_name = code[0] //物品
  let account = code[1] //数量
  const thing_acount = await convert2integer(account)
  const wupintype = await foundthing(thing_name)
  if (!wupintype || wupintype.type != '锻造') {
    Send(Text(`凡界物品无法放入煅炉`))
    return false
  }
  let mynum = await exist_najie_thing(user_qq, thing_name, '材料')
  if (mynum < thing_acount) {
    Send(Text(`材料不足,无法放入`))
    return false
  }

  //开始放入

  const tripod = await Read_mytripod(user_qq)
  if (tripod.状态 == 1) {
    Send(Text(`正在炼制中,无法熔炼更多材料`))
    return false
  }
  let num1 = 0
  if (player.仙宠.type == '炼器') {
    num1 = Math.trunc(player.仙宠.等级 / 33)
  }
  let num = 0
  for (let item in tripod.数量) {
    num += Number(tripod.数量[item])
  }
  let dyew = 0
  let dy = await Read_danyao(user_qq)
  if (dy.beiyong5 > 0) {
    dyew = dy.beiyong5
  }
  const shengyu =
    dyew +
    tripod.容纳量 +
    num1 +
    Math.floor(player.occupation_level / 2) -
    num -
    Number(thing_acount)
  if (
    num + Number(thing_acount) >
    tripod.容纳量 + dyew + num1 + Math.floor(player.occupation_level / 2)
  ) {
    Send(Text(`该煅炉当前只能容纳[${shengyu + Number(thing_acount)}]物品`))
    return false
  }
  let newtripod
  try {
    newtripod = await Read_tripod()
  } catch {
    await Write_duanlu([])
    newtripod = await Read_tripod()
  }
  for (let item of newtripod) {
    if (user_qq == item.qq) {
      item.材料.push(thing_name)
      item.数量.push(thing_acount)
      await Write_duanlu(newtripod)
      await Add_najie_thing(user_qq, thing_name, '材料', -thing_acount)
      const yongyou = num + Number(thing_acount)
      Send(
        Text(
          `熔炼成功,当前煅炉内拥有[${yongyou}]个材料,根据您现有等级,您还可以放入[${shengyu}]个材料`
        )
      )
      return false
    }
  }
})
