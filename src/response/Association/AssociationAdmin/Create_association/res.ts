import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { isNotNull, setFileValue, timestampToTime } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)开宗立派/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  const name = e.MessageText.replace(/^(#|\/)开宗立派/, '')
  if (!name) {
    Send(Text('请发送文本,请重新输入:'))
    return
  }
  if (name.length > 6) {
    Send(Text('宗门名字最多只能设置6个字符,请重新输入'))
    return
  }
  let reg = /[^\u4e00-\u9fa5]/g //汉字检验正则
  let res = reg.test(name)
  if (res) {
    Send(Text('宗门名字只能使用中文,请重新输入'))
    return
  }
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  let now_level_id
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id

  if (now_level_id < 22) {
    Send(Text('修为达到化神再来吧'))
    return false
  }
  if (isNotNull(player.宗门)) {
    Send(Text('已经有宗门了'))
    return false
  }
  if (player.灵石 < 10000) {
    Send(Text('开宗立派是需要本钱的,攒到一万灵石再来吧'))
    return false
  }
  let ifexistass = data.existData('association', name)
  if (ifexistass) {
    await Send(Text('该宗门已经存在,请重新输入:'))
    return false
  }
  //await this.reply('功能还在开发中,敬请期待');
  let now = new Date()
  let nowTime = now.getTime() //获取当前时间戳
  let date = timestampToTime(nowTime)
  player.宗门 = { 宗门名称: name, 职位: '宗主', time: [date, nowTime] }
  data.setData('player', usr_qq, player)
  await new_Association(name, usr_qq, e)
  await setFileValue(usr_qq, -10000, '灵石')
  await Send(Text('宗门创建成功'))
})
async function new_Association(name, holder_qq, e) {
  let usr_qq = e.user_id
  let player = data.getData('player', usr_qq)
  let now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  let x
  let xian
  let dj
  if (now_level_id > 41) {
    x = 1
    xian = 10
    dj = 42
  } else {
    x = 0
    xian = 1
    dj = 1
  }
  let now = new Date()
  let nowTime = now.getTime() //获取当前时间戳
  let date = timestampToTime(nowTime)
  let Association = {
    宗门名称: name,
    宗门等级: 1,
    创立时间: [date, nowTime],
    灵石池: 0,
    宗门驻地: 0,
    宗门建设等级: 0,
    宗门神兽: 0,
    宗主: holder_qq,
    副宗主: [],
    长老: [],
    内门弟子: [],
    外门弟子: [],
    所有成员: [holder_qq],
    药园: {
      药园等级: 1,
      作物: [{ name: '凝血草', start_time: nowTime, who_plant: holder_qq }]
    },
    维护时间: nowTime,
    大阵血量: 114514 * xian,
    最低加入境界: dj,
    power: x
  }
  data.setAssociation(name, Association)
  return
}
