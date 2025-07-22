import { Text, useSend } from 'alemonjs'
import fs from 'fs'
import { redis, data } from '@src/api/api'
import {
  existplayer,
  Read_player,
  isNotNull,
  Write_player,
  Read_equipment,
  Write_equipment,
  Add_HP,
  player_efficiency,
  get_random_fromARR
} from '@src/model'

export const selects = onSelects(['message.create', 'private.message.create'])
export const regular = /^(#|\/)登仙$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无账号
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //不开放私聊

  //获取游戏状态
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  //防止继续其他娱乐行为
  if (game_action == 0) {
    Send(Text('修仙：游戏进行中...'))
    return false
  }
  //读取信息
  let player = await Read_player(usr_qq)
  //境界
  let now_level = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level
  if (now_level != '渡劫期') {
    Send(Text(`你非渡劫期修士！`))
    return false
  }
  //查询redis中的人物动作
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':action')
  action = JSON.parse(action)
  //不为空
  if (action != null) {
    let action_end_time = action.end_time
    let now_time = new Date().getTime()
    if (now_time <= action_end_time) {
      let m = Math.floor((action_end_time - now_time) / 1000 / 60)
      let s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000)
      Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'))
      return false
    }
  }
  if (player.power_place != 0) {
    Send(Text('请先渡劫！'))
    return false
  }
  //需要的修为
  let now_level_id
  if (!isNotNull(player.level_id)) {
    Send(Text('请先#刷新信息'))
    return false
  }
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  let now_exp = player.修为
  //修为
  let need_exp = data.Level_list.find(
    item => item.level_id == player.level_id
  ).exp
  if (now_exp < need_exp) {
    Send(Text(`修为不足,再积累${need_exp - now_exp}修为后方可成仙！`))
    return false
  }
  //零，开仙门
  if (player.power_place == 0) {
    Send(
      Text(
        '天空一声巨响，一道虚影从眼中浮现，突然身体微微颤抖，似乎感受到了什么，' +
          player.名号 +
          '来不及思索，立即向前飞去！只见万物仰头相望，似乎感觉到了，也似乎没有感觉，殊不知......'
      )
    )
    now_level_id = now_level_id + 1
    player.level_id = now_level_id
    player.修为 -= need_exp
    await Write_player(usr_qq, player)
    let equipment = await Read_equipment(usr_qq)
    await Write_equipment(usr_qq, equipment)
    await Add_HP(usr_qq, 99999999)
    //突破成仙人
    if (now_level_id >= 42) {
      let player = data.getData('player', usr_qq)
      if (!isNotNull(player.宗门)) {
        return false
      }
      //有宗门
      if (player.宗门.职位 != '宗主') {
        let ass = data.getAssociation(player.宗门.宗门名称)
        ass[player.宗门.职位] = ass[player.宗门.职位].filter(
          item => item != usr_qq
        )
        ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq)
        data.setAssociation(ass.宗门名称, ass)
        delete player.宗门
        data.setData('player', usr_qq, player)
        await player_efficiency(usr_qq)
        Send(Text('退出宗门成功'))
      } else {
        let ass = data.getAssociation(player.宗门.宗门名称)
        if (ass.所有成员.length < 2) {
          fs.rmSync(
            `${data.filePathMap.association}/${player.宗门.宗门名称}.json`
          )
          delete player.宗门 //删除存档里的宗门信息
          data.setData('player', usr_qq, player)
          await player_efficiency(usr_qq)
          Send(
            Text('一声巨响,原本的宗门轰然倒塌,随着流沙沉没,世间再无半分痕迹')
          )
        } else {
          ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq) //原来的成员表删掉这个B
          delete player.宗门 //删除这个B存档里的宗门信息
          data.setData('player', usr_qq, player)
          await player_efficiency(usr_qq)
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
          let randmember = await data.getData('player', randmember_qq) //获取幸运儿的存档
          ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(
            item => item != randmember_qq
          ) //原来的职位表删掉这个幸运儿
          ass['宗主'] = randmember_qq //新的职位表加入这个幸运儿
          randmember.宗门.职位 = '宗主' //成员存档里改职位
          data.setData('player', randmember_qq, randmember) //记录到存档
          data.setData('player', usr_qq, player)
          data.setAssociation(ass.宗门名称, ass) //记录到宗门
          Send(
            Text(
              `飞升前,遵循你的嘱托,${randmember.名号}将继承你的衣钵,成为新一任的宗主`
            )
          )
        }
      }
    }
    return false
  }
})
