import { Text, useMention, useSend } from 'alemonjs'

import { redis } from '@src/api/api'
import { existplayer } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)解封.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    if (!e.IsMaster) return false

    //没有at信息直接返回,不执行
    const Mentions = (await useMention(e)[0].findOne()).data
    if (!Mentions || Mentions.length === 0) {
      return // @ 提及为空
    }
    // 查找用户类型的 @ 提及，且不是 bot
    const User = Mentions.find(item => !item.IsBot)
    if (!User) {
      return // 未找到用户Id
    }
    //对方qq
    let qq = User.UserId
    //检查存档
    let ifexistplay = await existplayer(qq)
    if (!ifexistplay) return false
    //清除游戏状态
    await redis.set('xiuxian@1.3.0:' + qq + ':game_action', 1)
    //查询redis中的人物动作
    let action: any = await redis.get('xiuxian@1.3.0:' + qq + ':action')
    //不为空，有状态
    if (action) {
      //把状态都关了
      let arr = JSON.parse(action)
      arr.is_jiesuan = 1 //结算状态
      arr.shutup = 1 //闭关状态
      arr.working = 1 //降妖状态
      arr.power_up = 1 //渡劫状态
      arr.Place_action = 1 //秘境
      arr.Place_actionplus = 1 //沉迷状态
      arr.end_time = new Date().getTime() //结束的时间也修改为当前时间
      delete arr.group_id //结算完去除group_id
      await redis.set('xiuxian@1.3.0:' + qq + ':action', JSON.stringify(arr))
      Send(Text('已解除！'))
      return false
    }
    Send(Text('不需要解除！'))
    return false
  }
})
