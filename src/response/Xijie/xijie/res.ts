import { Text, useSend } from 'alemonjs'

import { redis, data } from '@src/model/api'
import {
  existplayer,
  shijianc,
  readShop,
  writeShop,
  readPlayer,
  writePlayer
} from '@src/model/index'
import {
  readAction,
  isActionRunning,
  startAction,
  formatRemaining,
  remainingMs
} from '@src/response/actionHelper'
import { getString, userKey, setValue } from '@src/model/utils/redisHelper'

import { selects } from '@src/response/index'
import { setDataByUserId } from '@src/model/Redis'
export const regular = /^(#|＃|\/)?洗劫.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //查看存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false

  const game_action = await getString(userKey(usr_qq, 'game_action'))
  //防止继续其他娱乐行为
  if (game_action === '1') {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //查询redis中的人物动作
  const now_time = Date.now()
  const current = await readAction(usr_qq)
  if (isActionRunning(current)) {
    Send(
      Text(
        `正在${current!.action}中,剩余时间:${formatRemaining(remainingMs(current!))}`
      )
    )
    return false
  }
  const lastxijie_raw = await redis.get(
    `xiuxian@1.3.0:${usr_qq}:lastxijie_time`
  )
  const lastxijie_time = lastxijie_raw ? parseInt(lastxijie_raw, 10) : 0
  if (now_time < lastxijie_time + 7200000) {
    const lastxijie_m = Math.trunc(
      (lastxijie_time + 7200000 - now_time) / 60 / 1000
    )
    const lastxijie_s = Math.trunc(
      ((lastxijie_time + 7200000 - now_time) % 60000) / 1000
    )
    Send(
      Text(
        `每120分钟洗劫一次，正在CD中，` +
          `剩余cd: ${lastxijie_m}分${lastxijie_s}秒`
      )
    )
    return false
  }
  //判断是否在开启时段
  const Today = await shijianc(now_time)
  if (Today.h > 19 && Today.h < 21) {
    Send(Text(`每日20-21点商店修整中,请过会再来`))
    return false
  }
  let didian = e.MessageText.replace(/^(#|＃|\/)?洗劫/, '')
  didian = didian.trim()
  let shop

  shop = await readShop()
  if (shop.length === 0) {
    // 将 ShopItem 转为 ShopData: 只保留 one 槽位, 其余保持空数组
    const converted = data.shop_list.map(item => ({
      name: item.name,
      one: (item.one || []).map(g => ({ name: g.name, 数量: g.数量 }))
    }))
    await writeShop(converted)
    shop = await readShop()
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
  if (shop[i].state == 1) {
    Send(Text(didian + '已经戒备森严了,还是不要硬闯好了'))
    return false
  }
  let msg = ''
  const player = await readPlayer(usr_qq)
  const Price = shop[i].price * shop[i].Grade
  const buff = shop[i].Grade + 1
  if (player.灵石 < Price) {
    Send(Text('灵石不足,无法进行强化'))
    return false
  } else {
    player.灵石 -= Price
    msg +=
      '你消费了' +
      Price +
      '灵石,防御力和生命值提高了' +
      Math.trunc((buff - buff / (1 + shop[i].Grade * 0.05)) * 100) +
      '%'
  }
  //开始准备洗劫
  player.魔道值 += 25 * shop[i].Grade
  await writePlayer(usr_qq, player)

  shop[i].state = 1
  await writeShop(shop)
  if (player.灵根 == null || player.灵根 == undefined) {
    player.修炼效率提升 += 0
  }
  //锁定属性
  const A_player = {
    名号: player.名号,
    攻击: parseInt(String(player.攻击), 10),
    防御: Math.floor(player.防御 * buff),
    当前血量: Math.floor(player.血量上限 * buff),
    暴击率: player.暴击率,
    灵根: player.灵根,
    法球倍率: player.灵根.法球倍率,
    魔值: 0
  }
  if (player.魔道值 > 999) {
    A_player.魔值 = 1
  }
  const time = 15 //时间（分钟）
  const action_time = 60000 * time //持续时间，单位毫秒
  const arr = await startAction(usr_qq, '洗劫', action_time, {
    shutup: '1',
    working: '1',
    Place_action: '1',
    mojie: '1',
    Place_actionplus: '1',
    power_up: '1',
    xijie: '0',
    plant: '1',
    mine: '1',
    Place_address: shop[i],
    A_player: A_player
  })
  await setValue(userKey(usr_qq, 'action'), arr)
  await setDataByUserId(usr_qq, 'lastxijie_time', now_time)
  msg += '\n开始前往' + didian + ',祝你好运!'
  Send(Text(msg))
})
