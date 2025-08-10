import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/model/api'
import { existplayer, Go, convert2integer, addCoin } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?发红包.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  //这是自己的
  const usr_qq = e.UserId
  //自己没存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //获取发送灵石数量
  let lingshi: any = e.MessageText.replace(/^(#|＃|\/)?发红包/, '')
  const flag = await Go(e)
  if (!flag) {
    return false
  }
  const code = lingshi.split('*')
  lingshi = code[0]
  let acount = code[1]
  lingshi = await convert2integer(lingshi)
  acount = await convert2integer(acount)
  const player = await await data.getData('player', usr_qq)
  //对比自己的灵石，看看够不够！
  if (player.灵石 <= Math.floor(lingshi * acount)) {
    Send(Text(`红包数要比自身灵石数小噢`))
    return false
  }
  lingshi = Math.trunc(lingshi / 10000) * 10000
  //发送的灵石要当到数据库里。大家都能取
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':honbao', lingshi)
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':honbaoacount', acount)
  //然后扣灵石
  await addCoin(usr_qq, -lingshi * acount)
  Send(
    Text(
      '【全服公告】' +
        player.名号 +
        '发了' +
        acount +
        '个' +
        lingshi +
        '灵石的红包！'
    )
  )
})
