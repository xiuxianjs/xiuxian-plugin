import { Text, Image, useSend } from 'alemonjs'

import { redis, data, puppeteer } from '@src/api/api'
import {
  existplayer,
  Read_shop,
  Write_shop,
  Read_player,
  Add_灵石,
  existshop
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?探查.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //查看存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //防止继续其他娱乐行为
  if (game_action == 0) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //查询redis中的人物动作
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
  action = JSON.parse(action)
  if (action != null) {
    //人物有动作查询动作结束时间
    let action_end_time = action.end_time
    let now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      let m = Math.floor((action_end_time - now_time) / 1000 / 60)
      let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }
  let didian = e.MessageText.replace(/^(#|＃|\/)?探查/, '')
  didian = didian.trim()
  let shop
  try {
    shop = await Read_shop()
  } catch {
    await Write_shop(data.shop_list)
    shop = await Read_shop()
  }
  let i
  for (i = 0; i < shop.length; i++) {
    if (shop[i].name == didian) {
      break
    }
  }
  if (i == shop.length) {
    return false
  }
  let player = await Read_player(usr_qq)
  let Price = shop[i].price * 0.3
  if (player.灵石 < Price) {
    Send(Text('你需要更多的灵石去打探消息'))
    return false
  }
  await Add_灵石(usr_qq, -Price)
  let thing = await existshop(didian)
  let level = shop[i].Grade
  let state = shop[i].state
  switch (level) {
    case 1:
      level = '松懈'
      break
    case 2:
      level = '戒备'
      break
    case 3:
      level = '恐慌'
      break
  }
  switch (state) {
    case 0:
      state = '营业'
      break
    case 1:
      state = '打烊'
      break
  }
  let didian_data = { name: shop[i].name, level, state, thing }

  let img = await puppeteer.screenshot('shop', e.UserId, didian_data)
  if (img) Send(Image(img))
  return false
})
