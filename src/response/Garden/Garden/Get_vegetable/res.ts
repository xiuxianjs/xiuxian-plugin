import { Text, useSend } from 'alemonjs'

import { data, redis, config } from '@src/api/api'
import { isNotNull, Add_najie_thing } from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)拔苗助长.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) return false
  let ass = data.getAssociation(player.宗门.宗门名称)
  if (!isNotNull(player.宗门)) {
    return false
  } else if (ass.药园.药园等级 == 1) {
    //加入宗门，没有药园，则新建药园。
    Send(Text('药园等级太低，可远观不可亵玩焉'))
    return false
  }

  //增加cd
  let now = new Date()
  //获取当前时间戳
  let nowTime = now.getTime()
  //获得时间戳
  let last_garden_time: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':last_garden_time'
  )
  //
  last_garden_time = parseInt(last_garden_time)
  let time: any = config.getConfig('xiuxian', 'xiuxian').CD.garden //时间（分钟）
  let transferTimeout = Math.floor(60000 * time) //
  if (nowTime < last_garden_time + transferTimeout) {
    let waittime_m = Math.trunc(
      (last_garden_time + transferTimeout - nowTime) / 60 / 1000
    )
    let waittime_s = Math.trunc(
      ((last_garden_time + transferTimeout - nowTime) % 60000) / 1000
    )
    Send(
      Text(
        `每${transferTimeout / 1000 / 60}分钟拔苗一次。` +
          `cd: ${waittime_m}分${waittime_s}秒`
      )
    )
    return false
  }

  let vegetable = ass.药园.作物
  let vagetable_name = e.MessageText.replace('#拔苗助长', '')
  for (let i = 0; i < vegetable.length; i++) {
    if (vegetable[i].name == vagetable_name) {
      let ts = vegetable[i].ts
      let nowTime = new Date().getTime() //获取当前时间
      let vegetable_Oldtime: any = await redis.get(
        'xiuxian:' + ass.宗门名称 + vagetable_name
      ) //获得上次的成熟时间戳,
      if (nowTime + 1000 * 60 * 30 < +vegetable_Oldtime) {
        //判断是否成熟
        Send(
          Text(
            `作物${vagetable_name}增加1800000成熟度,还需要${
              +vegetable_Oldtime - nowTime - 1000 * 60 * 30
            }成熟度`
          )
        )
        vegetable_Oldtime -= 1000 * 60 * 30 //每次拔苗助长减少 预定成熟的时间
        await redis.set(
          'xiuxian:' + ass.宗门名称 + vagetable_name,
          vegetable_Oldtime
        ) //存入缓存
        //记录本次获得时间戳
        await redis.set(
          'xiuxian@1.3.0:' + usr_qq + ':last_garden_time',
          nowTime
        )
        return false
      } else {
        Send(
          Text(
            `作物${vagetable_name}已成熟，被${usr_qq}${player.名号}摘取,放入纳戒了`
          )
        )
        await Add_najie_thing(usr_qq, vagetable_name, '草药', 1)
        let vegetable_OutTime = nowTime + 1000 * 60 * 60 * 24 * ts //设置新一轮成熟时间戳
        ass.药园.作物[i].start_time = nowTime //将当前时间写入药园作物中
        await data.setAssociation(ass.宗门名称, ass) //刷新写入作物时间戳
        await redis.set(
          'xiuxian:' + ass.宗门名称 + vagetable_name,
          vegetable_OutTime
        ) //存入缓存
        //记录本次获得时间戳
        await redis.set(
          'xiuxian@1.3.0:' + usr_qq + ':last_garden_time',
          nowTime
        )
        return false
      }
    }
  }
  Send(Text('您拔错了吧！掣电树chedianshu'))

  //记录本次获得时间戳
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_garden_time', nowTime)
})
