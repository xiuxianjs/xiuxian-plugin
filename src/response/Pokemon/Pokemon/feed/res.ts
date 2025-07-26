import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  convert2integer,
  isNotNull,
  existNajieThing,
  addNajieThing
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?喂给仙宠.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //用户不存在
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  if (player.仙宠 == '') {
    //有无仙宠
    Send(Text('你没有仙宠'))
    return false
  }
  let thing = e.MessageText.replace(/^(#|＃|\/)?喂给仙宠/, '')
  let code = thing.split('*')
  let thing_name = code[0] //物品
  let thing_value = await convert2integer(code[1]) //数量
  let ifexist = data.xianchonkouliang.find(item => item.name == thing_name) //查找
  if (!isNotNull(ifexist)) {
    Send(Text('此乃凡物,仙宠不吃' + thing_name))
    return false
  }
  if (player.仙宠.等级 == player.仙宠.等级上限 && player.仙宠.品级 != '仙灵') {
    Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'))
    return false
  }
  if (player.仙宠.品级 == '仙灵' && player.仙宠.等级 == player.仙宠.等级上限) {
    Send(Text('您的仙宠已达到天赋极限'))
    return false
  }
  //纳戒中的数量
  let thing_quantity = await existNajieThing(usr_qq, thing_name, '仙宠口粮')
  if (thing_quantity < thing_value || !thing_quantity) {
    //没有
    Send(Text(`【${thing_name}】数量不足`))
    return false
  }
  //纳戒数量减少
  await addNajieThing(usr_qq, thing_name, '仙宠口粮', -thing_value)
  //待完善加成
  let jiachen = ifexist.level * thing_value //加的等级
  if (jiachen > player.仙宠.等级上限 - player.仙宠.等级) {
    jiachen = player.仙宠.等级上限 - player.仙宠.等级
  }
  //保留
  player.仙宠.加成 += jiachen * player.仙宠.每级增加
  if (player.仙宠.type == '修炼') {
    player.修炼效率提升 += jiachen * player.仙宠.每级增加
  }
  if (player.仙宠.type == '幸运') {
    player.幸运 += jiachen * player.仙宠.每级增加
  }
  if (player.仙宠.等级上限 > player.仙宠.等级 + jiachen) {
    player.仙宠.等级 += jiachen
  } else {
    if (player.仙宠.品级 == '仙灵') {
      Send(Text('您的仙宠已达到天赋极限'))
    } else {
      Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'))
    }
    player.仙宠.等级 = player.仙宠.等级上限
  }
  await data.setData('player', usr_qq, player)
  Send(Text(`喂养成功，仙宠的等级增加了${jiachen},当前为${player.仙宠.等级}`))
})
