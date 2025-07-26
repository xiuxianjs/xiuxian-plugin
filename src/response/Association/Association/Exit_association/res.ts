import { Text, useSend } from 'alemonjs'
import {
  __PATH,
  get_random_fromARR,
  isNotNull,
  playerEfficiency
} from '@src/model'
import { config, data, redis } from '@src/api/api'
import fs from 'fs'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?退出宗门$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = await data.getData('player', usr_qq)
  if (!isNotNull(player.宗门)) return false
  let now = new Date()
  let nowTime = now.getTime() //获取当前时间戳
  let addTime
  let time: any = config.getConfig('xiuxian', 'xiuxian').CD.joinassociation //分钟
  if (typeof player.宗门.time == 'undefined') {
    addTime = player.宗门.加入时间[1] + 60000 * time
  } else {
    //新版本的数据变成了time
    addTime = player.宗门.time[1] + 60000 * time
  }
  if (addTime > nowTime) {
    Send(Text('加入宗门不满' + `${time}分钟,无法退出`))
    return false
  }

  if (player.宗门.职位 != '宗主') {
    let ass = data.getAssociation(player.宗门.宗门名称)
    ass[player.宗门.职位] = ass[player.宗门.职位].filter(item => item != usr_qq)
    ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq)
    data.setAssociation(ass.宗门名称, ass)
    delete player.宗门
    data.setData('player', usr_qq, player)
    await playerEfficiency(usr_qq)
    Send(Text('退出宗门成功'))
  } else {
    let ass = data.getAssociation(player.宗门.宗门名称)
    if (ass.所有成员.length < 2) {
      await redis.del(`${__PATH.association}:${player.宗门.宗门名称}`)
      delete player.宗门 //删除存档里的宗门信息
      data.setData('player', usr_qq, player)
      await playerEfficiency(usr_qq)
      Send(
        Text(
          '退出宗门成功,退出后宗门空无一人。\n一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹'
        )
      )
    } else {
      ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq) //原来的成员表删掉这个B
      delete player.宗门 //删除这个B存档里的宗门信息
      data.setData('player', usr_qq, player)
      await playerEfficiency(usr_qq)
      //随机一个幸运儿的QQ,优先挑选等级高的
      let randmember_qq
      if (ass.副宗主.length > 0) {
        randmember_qq = await get_random_fromARR(ass.副宗主)
      } else if (ass.长老.length > 0) {
        randmember_qq = await get_random_fromARR(ass.长老)
      } else if (ass.内门弟子.length > 0) {
        randmember_qq = await get_random_fromARR(ass.内门弟子)
      } else {
        randmember_qq = await get_random_fromARR(ass.所有成员)
      }
      let randmember = await await data.getData('player', randmember_qq) //获取幸运儿的存档
      ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(
        item => item != randmember_qq
      ) //原来的职位表删掉这个幸运儿
      ass['宗主'] = randmember_qq //新的职位表加入这个幸运儿
      randmember.宗门.职位 = '宗主' //成员存档里改职位
      data.setData('player', randmember_qq, randmember) //记录到存档
      data.setData('player', usr_qq, player)
      data.setAssociation(ass.宗门名称, ass) //记录到宗门
      Send(Text(`退出宗门成功,退出后,宗主职位由${randmember.名号}接管`))
    }
  }
  player.favorability = 0
  data.setData('player', usr_qq, player)
})
