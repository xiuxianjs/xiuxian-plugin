import { Text, useMessage, useSubscribe } from 'alemonjs'

import { data } from '@src/api/api'
import { isNotNull, setFileValue, timestampToTime } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?开宗立派$/

export default onResponse(selects, async e => {
  let usr_qq = e.UserId
  const [message] = useMessage(e)
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return
  let player = await data.getData('player', usr_qq)
  let now_level_id
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id

  if (now_level_id < 22) {
    message.send(format(Text('修为达到化神再来吧')))
    return false
  }
  if (isNotNull(player.宗门)) {
    message.send(format(Text('已经有宗门了')))
    return false
  }
  if (player.灵石 < 10000) {
    message.send(format(Text('开宗立派是需要本钱的,攒到一万灵石再来吧')))
    return false
  }
  /** 回复 */
  message.send(
    format(
      Text(
        '请发送宗门名字,一旦设立,无法再改,请慎重取名,(宗门名字最多6个中文字符)'
      )
    )
  )
  /** 设置上下文 */
  const [subscribe] = useSubscribe(e, selects)

  const sub = subscribe.mount(
    async (event, next) => {
      let association_name = event.MessageText
      //res为true表示存在汉字以外的字符
      if (!/^[\u4e00-\u9fa5]+$/.test(association_name)) {
        message.send(format(Text('宗门名字只能使用中文,请重新输入:')))
        next()
        return
      }
      if (association_name.length > 6) {
        message.send(format(Text('宗门名字最多只能设置6个字符,请重新输入:')))
        next()
        return
      }
      let ifexistass = data.existData('association', association_name)
      if (ifexistass) {
        message.send(format(Text('该宗门已经存在,请重新输入:')))
        next()
        return
      }
      let now = new Date()
      let nowTime = now.getTime() //获取当前时间戳
      let date = timestampToTime(nowTime)
      let player = await data.getData('player', usr_qq)
      player.宗门 = {
        宗门名称: association_name,
        职位: '宗主',
        time: [date, nowTime]
      }
      data.setData('player', usr_qq, player)
      await new_Association(association_name, usr_qq, e)
      await setFileValue(usr_qq, -10000, '灵石')
      message.send(format(Text('宗门创建成功')))
      subscribe.cancel(sub)
      clearTimeout(timeout)
    },
    ['UserId']
  )
  const timeout = setTimeout(
    () => {
      /** 停止上下文 */
      subscribe.cancel(sub)
      message.send(format(Text('超时自动取消操作')))
    },
    1000 * 60 * 5
  ) //5分钟超时
})
async function new_Association(name, holder_qq, e) {
  let usr_qq = e.UserId
  let player = await data.getData('player', usr_qq)
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
