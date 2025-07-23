import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { Read_najie, isNotNull, Add_仙宠, Write_player } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)出战仙宠.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  let name = e.MessageText.replace('#', '')
  name = name.replace('出战仙宠', '')
  let num = parseInt(name)
  let najie = await Read_najie(usr_qq)
  if (num && num > 1000) {
    try {
      name = najie.仙宠[num - 1001].name
    } catch {
      Send(Text('仙宠代号输入有误!'))
      return false
    }
  }
  if (player.仙宠.灵魂绑定 == 1) {
    Send(Text('你已经与' + player.仙宠.name + '绑定了灵魂,无法更换别的仙宠！'))
    return false
  }
  let thing = data.xianchon.find(item => item.name == name) //查找仙宠
  if (!isNotNull(thing)) {
    Send(Text('这方世界不存在' + name))
    return false
  }
  //放回
  let last: any = 114514
  for (let i = 0; najie.仙宠.length > i; i++) {
    if (najie.仙宠[i].name == name) {
      last = najie.仙宠[i]
      break
    }
  }
  if (last == 114514) {
    Send(Text('你没有' + name))
    return false
  }
  if (isNotNull(player.仙宠.name)) {
    await Add_仙宠(usr_qq, player.仙宠.name, 1, player.仙宠.等级)
  }
  if (player.仙宠.type == '修炼') {
    player.修炼效率提升 = player.修炼效率提升 - player.仙宠.加成
  }
  if (player.仙宠.type == '幸运') {
    player.幸运 = player.幸运 - player.仙宠.加成
  }
  player.仙宠 = last
  player.仙宠.加成 = player.仙宠.等级 * player.仙宠.每级增加
  if (last.type == '幸运') {
    player.幸运 = player.幸运 + last.加成
  }
  if (last.type == '修炼') {
    player.修炼效率提升 = player.修炼效率提升 + last.加成
  }
  //增减仙宠方法
  await Add_仙宠(usr_qq, last.name, -1, last.等级)
  await Write_player(usr_qq, player) //写入
  Send(Text('成功出战' + name))
})
