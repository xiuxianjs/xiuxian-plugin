import { Text, useMention, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { isNotNull } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^任命.*/
const 副宗主人数上限 = [1, 1, 1, 1, 2, 2, 3, 3]
const 长老人数上限 = [1, 2, 3, 4, 5, 7, 8, 9]
const 内门弟子上限 = [2, 3, 4, 5, 6, 8, 10, 12]

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  const Mentions = (await useMention(e)[0].find({ IsBot: false })).data
  if (!Mentions || Mentions.length === 0) {
    return // @ 提及为空
  }
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = await await data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  if (player.宗门.职位 != '宗主' && player.宗门.职位 != '副宗主') {
    Send(Text('只有宗主、副宗主可以操作'))
    return false
  }
  const User = Mentions.find(item => !item.IsBot)
  if (!User) {
    return // 未找到用户Id
  }
  let member_qq = User.UserId
  if (usr_qq == member_qq) {
    Send(Text('???'))
    return false
  } //at宗主自己,这不扯犊子呢

  let ass = await data.getAssociation(player.宗门.宗门名称)
  let isinass = ass.所有成员.some(item => item == member_qq) //这个命名可太糟糕了
  if (!isinass) {
    Send(Text('只能设置宗门内弟子的职位'))
    return false
  }
  let member = await data.getData('player', member_qq) //获取这个B的存档
  let now_apmt = member.宗门.职位 //这个B现在的职位
  if (player.宗门.职位 == '副宗主' && now_apmt == '宗主') {
    Send(Text('你想造反吗！？'))
    return false
  }
  if (
    player.宗门.职位 == '副宗主' &&
    (now_apmt == '副宗主' || now_apmt == '长老')
  ) {
    Send(Text(`宗门${now_apmt}任免请上报宗主！`))
    return false
  }
  let full_apmt = ass.所有成员.length
  //检索输入的第一个职位
  let reg = new RegExp(/副宗主|长老|外门弟子|内门弟子/)
  let msg = reg.exec(e.MessageText) //获取输入的职位
  if (!msg) {
    Send(Text('请输入正确的职位'))
    return false
  }
  let appointment = msg[0]
  if (appointment == now_apmt) {
    Send(Text(`此人已经是本宗门的${appointment}`))
    return false
  }
  if (appointment == '长老') {
    full_apmt = 长老人数上限[ass.宗门等级 - 1]
  }
  if (appointment == '副宗主') {
    full_apmt = 副宗主人数上限[ass.宗门等级 - 1]
  } else if (appointment == '内门弟子') {
    full_apmt = 内门弟子上限[ass.宗门等级 - 1]
  }
  if (ass[appointment].length >= full_apmt) {
    Send(Text(`本宗门的${appointment}人数已经达到上限`))
    return false
  }
  member.宗门.职位 = appointment //成员存档里改职位
  ass[now_apmt] = ass[now_apmt].filter(item => item != member_qq) //原来的职位表删掉这个B
  ass[appointment].push(member_qq) //新的职位表加入这个B
  data.setData('player', member_qq, member) //记录到存档
  data.setAssociation(ass.宗门名称, ass) //记录到宗门
  Send(
    Text(
      `${ass.宗门名称} ${player.宗门.职位} 已经成功将${member.名号}任命为${appointment}!`
    )
  )
})
