import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { existNajieThing, addNajieThing, writePlayer } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?进阶仙宠$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return false
  const player = await data.getData('player', usr_qq)
  const list = ['仙胎', '仙仔', '仙兽', '仙道', '仙灵']
  const list_level = [20, 40, 60, 80, 100]
  const currentIndex = list.findIndex(l => l == player.仙宠.品级)
  if (currentIndex === -1) {
    Send(Text('你没有仙宠'))
    return false
  }
  if (currentIndex === list.length - 1) {
    Send(Text('[' + player.仙宠.name + ']已达到最高品级'))
    return false
  }
  const number_n = currentIndex + 1
  const name = number_n + '级仙石'
  const quantity = await existNajieThing(usr_qq, name, '道具') //查找纳戒
  if (!quantity) {
    //没有
    Send(Text(`你没有[${name}]`))
    return false
  }
  const player_level = player.仙宠.等级
  const last_jiachen = player.仙宠.加成
  if (player_level == list_level[currentIndex]) {
    //判断是否满级
    const thing = data.xianchon.find(item => item.id == player.仙宠.id + 1) //查找下个等级仙宠
    logger.info(thing)
    player.仙宠 = thing
    player.仙宠.等级 = player_level //赋值之前的等级
    player.仙宠.加成 = last_jiachen //赋值之前的加成
    await addNajieThing(usr_qq, name, '道具', -1)
    await writePlayer(usr_qq, player)
    Send(Text('恭喜进阶【' + player.仙宠.name + '】成功'))
  } else {
    const need = Number(list_level[currentIndex]) - Number(player_level)
    Send(Text('仙宠的灵泉集韵不足,还需要【' + need + '】级方可进阶'))
    return false
  }
})
