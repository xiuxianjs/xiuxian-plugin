import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  existNajieThing,
  addNajieThing
} from '@src/model/index'
import { NajieCategory } from '@src/types/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?献祭魔石$/

interface PrizeItem {
  name: string
  class?: string
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId

  if (!(await existplayer(usr_qq))) {
    Send(Text('尚无存档'))
    return false
  }
  const player = await readPlayer(usr_qq)
  if (!player) {
    Send(Text('玩家数据读取失败'))
    return false
  }

  const needMagic = 1000
  const playerMagic = Number(player.魔道值) || 0
  if (playerMagic < needMagic) {
    Send(Text('你不是魔头'))
    return false
  }

  const COST = 8
  const hasCount = await existNajieThing(usr_qq, '魔石', '道具')
  const owned = Number(hasCount) || 0
  if (owned <= 0) {
    Send(Text('你没有魔石'))
    return false
  }
  if (owned < COST) {
    Send(Text(`魔石不足${COST}个,当前魔石数量${owned}个`))
    return false
  }

  const pool = data?.xingge?.[0]?.one as PrizeItem[] | undefined
  if (!Array.isArray(pool) || pool.length === 0) {
    Send(Text('奖励配置缺失'))
    return false
  }

  await addNajieThing(usr_qq, '魔石', '道具', -COST)

  const idx = Math.floor(Math.random() * pool.length)
  const prize = pool[idx]
  if (!prize || typeof prize !== 'object' || !prize.name) {
    Send(Text('奖励生成失败'))
    return false
  }
  const name = prize.name
  const cls = (prize.class || '道具') as NajieCategory

  Send(Text('获得了' + name))
  await addNajieThing(usr_qq, name, cls, 1)
  return false
})
