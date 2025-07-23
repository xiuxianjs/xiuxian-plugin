import { Text, useSend } from 'alemonjs'

import { data, redis } from '@src/api/api'
import {
  isNotNull,
  shijianc,
  Read_danyao,
  Write_danyao,
  Add_najie_thing
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)神兽赐福$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //用户不存在
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  //无宗门
  if (!isNotNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  let ass = data.getAssociation(player.宗门.宗门名称)
  if (ass.宗门神兽 == 0) {
    Send(Text('你的宗门还没有神兽的护佑，快去召唤神兽吧'))
    return false
  }

  let now = new Date()
  let nowTime = now.getTime() //获取当前日期的时间戳
  let Today = await shijianc(nowTime)
  let lastsign_time = await getLastsign_Bonus(usr_qq) //获得上次宗门签到日期
  if (
    Today.Y == lastsign_time.Y &&
    Today.M == lastsign_time.M &&
    Today.D == lastsign_time.D
  ) {
    Send(Text(`今日已经接受过神兽赐福了，明天再来吧`))
    return false
  }

  await redis.set('xiuxian@1.3.0:' + usr_qq + ':getLastsign_Bonus', nowTime) //redis设置签到时间

  let random = Math.random()
  //根据好感度获取概率
  let dy = await Read_danyao(usr_qq)
  if (dy.beiyong2 > 0) {
    dy.beiyong2--
  }
  random += dy.beiyong3
  if (dy.beiyong2 == 0) {
    dy.beiyong3 = 0
  }
  await Write_danyao(usr_qq, dy)
  if (random > 0.7) {
    let location
    let item_name
    let item_class
    //获得奖励
    let randomB = Math.random()
    if (ass.宗门神兽 == '麒麟') {
      if (randomB > 0.9) {
        location = Math.floor(Math.random() * data.qilin.length)
        item_name = data.qilin[location].name
        item_class = data.qilin[location].class
      } else {
        location = Math.floor(Math.random() * data.danyao_list.length)
        item_name = data.danyao_list[location].name
        item_class = data.danyao_list[location].class
      }
      await Add_najie_thing(usr_qq, item_name, item_class, 1)
    } else if (ass.宗门神兽 == '青龙') {
      //给功法，赐福加修为
      if (randomB > 0.9) {
        location = Math.floor(Math.random() * data.qinlong.length)
        item_name = data.qinlong[location].name
        item_class = data.qinlong[location].class
      } else {
        location = Math.floor(Math.random() * data.gongfa_list.length)
        item_name = data.gongfa_list[location].name
        item_class = data.gongfa_list[location].class
      }
      await Add_najie_thing(usr_qq, item_name, item_class, 1)
    } else if (ass.宗门神兽 == '玄武') {
      //给护具，赐福加气血
      if (randomB > 0.9) {
        location = Math.floor(Math.random() * data.xuanwu.length)
        item_name = data.xuanwu[location].name
        item_class = data.xuanwu[location].class
      } else {
        location = Math.floor(Math.random() * data.equipment_list.length)
        item_name = data.equipment_list[location].name
        item_class = data.equipment_list[location].class
      }
      await Add_najie_thing(usr_qq, item_name, item_class, 1)
    } else if (ass.宗门神兽 == '朱雀') {
      //给法宝，赐福加修
      if (randomB > 0.9) {
        location = Math.floor(Math.random() * data.xuanwu.length)
        item_name = data.xuanwu[location].name
        item_class = data.xuanwu[location].class
      } else {
        location = Math.floor(Math.random() * data.equipment_list.length)
        item_name = data.equipment_list[location].name
        item_class = data.equipment_list[location].class
      }
      await Add_najie_thing(usr_qq, item_name, item_class, 1)
    } else {
      //白虎给武器 赐福加气血
      if (randomB > 0.9) {
        location = Math.floor(Math.random() * data.xuanwu.length)
        item_name = data.xuanwu[location].name
        item_class = data.xuanwu[location].class
      } else {
        location = Math.floor(Math.random() * data.equipment_list.length)
        item_name = data.equipment_list[location].name
        item_class = data.equipment_list[location].class
      }
      await Add_najie_thing(usr_qq, item_name, item_class, 1)
    }
    if (randomB > 0.9) {
      Send(Text(`看见你来了,${ass.宗门神兽}很高兴，仔细挑选了${item_name}给你`))
    } else {
      Send(Text(`${ass.宗门神兽}今天心情不错，随手丢给了你${item_name}`))
    }
    return false
  } else {
    Send(Text(`${ass.宗门神兽}闭上了眼睛，表示今天不想理你`))
    return false
  }
})
async function getLastsign_Bonus(usr_qq) {
  //查询redis中的人物动作
  let time: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':getLastsign_Bonus'
  )
  if (time != null) {
    let data = await shijianc(parseInt(time))
    return data
  }
  return false
}
