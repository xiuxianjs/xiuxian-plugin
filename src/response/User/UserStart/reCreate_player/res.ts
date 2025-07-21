import { Text, useSend } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { redis, data, config } from '@src/api/api'
import { existplayer, Go } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)再入仙途$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) {
    Send(Text('没存档你转世个锤子!'))
    return false
  } else {
    //没有存档，初始化次数
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', 1)
  }
  let acount: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':reCreate_acount'
  )
  if (acount == undefined || acount == null || isNaN(acount) || acount <= 0) {
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', 1)
  }
  let player = await data.getData('player', usr_qq)
  //重生之前先看状态
  if (player.灵石 <= 0) {
    Send(Text(`负债无法再入仙途`))
    return false
  }
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  let now = new Date()
  let nowTime = now.getTime() //获取当前时间戳
  let lastrestart_time: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':last_reCreate_time'
  ) //获得上次重生时间戳,
  lastrestart_time = parseInt(lastrestart_time)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  const time = cf.CD.reborn
  let rebornTime = Math.floor(60000 * time)
  if (nowTime < lastrestart_time + rebornTime) {
    let waittime_m = Math.trunc(
      (lastrestart_time + rebornTime - nowTime) / 60 / 1000
    )
    let waittime_s = Math.trunc(
      ((lastrestart_time + rebornTime - nowTime) % 60000) / 1000
    )
    Send(
      Text(
        `每${rebornTime / 60 / 1000}分钟只能转世一次` +
          `剩余cd:${waittime_m}分 ${waittime_s}秒`
      )
    )
    return false
  }
  /** 设置上下文 */
  // this.setContext('RE_xiuxian')

  /** 回复 */
  await Send(
    Text(
      '一旦转世一切当世与你无缘,你真的要重生吗?回复:【断绝此生】或者【再继仙缘】进行选择'
    )
  )
})
