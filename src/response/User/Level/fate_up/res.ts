import { Text, useSend } from 'alemonjs'

import { dujie, LevelTask } from '@src/model/cultivation'
import { existplayer, readPlayer, writePlayer } from '@src/model/xiuxian_impl'
import { data } from '@src/model/api'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?渡劫$/
let dj = 0

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //有无账号
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //不开放私聊

  const player = await readPlayer(usr_qq)
  //境界
  const now_level = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level
  if (now_level != '渡劫期') {
    Send(Text(`你非渡劫期修士！`))
    return false
  }
  if (player.linggenshow == 1) {
    Send(Text(`你灵根未开，不能渡劫！`))
    return false
  }
  if (player.power_place == 0) {
    //已经开了
    Send(Text('你已度过雷劫，请感应仙门#登仙'))
    return false
  }
  //看看当前血量
  const now_HP = player.当前血量
  const list_HP = data.Level_list.find(item => item.level == now_level).基础血量
  if (now_HP < list_HP * 0.9) {
    player.当前血量 = 1
    await writePlayer(usr_qq, player)
    Send(Text(player.名号 + '血量亏损，强行渡劫后晕倒在地！'))
    return false
  }
  //境界id
  const now_level_id = data.Level_list.find(
    item => item.level == now_level
  ).level_id
  //修为
  const now_exp = player.修为
  //修为
  const need_exp = data.Level_list.find(
    item => item.level_id == now_level_id
  ).exp
  if (now_exp < need_exp) {
    Send(Text(`修为不足,再积累${need_exp - now_exp}修为后方可突破`))
    return false
  }

  //当前系数计算
  const x = await dujie(usr_qq)
  //默认为3
  let y = 3
  if (player.灵根.type == '伪灵根') {
    y = 3
  } else if (player.灵根.type == '真灵根') {
    y = 6
  } else if (player.灵根.type == '天灵根') {
    y = 9
  } else if (player.灵根.type == '体质') {
    y = 10
  } else if (player.灵根.type == '转生' || player.灵根.type == '魔头') {
    y = 21
  } else if (player.灵根.type == '转圣') {
    y = 26
  } else {
    y = 12
  }
  //渡劫系数区间
  const n = 1380 //最低
  const p = 280 //变动
  const m = n + p

  if (x <= n) {
    //没有达到最低要求
    player.当前血量 = 0
    player.修为 -= Math.floor(need_exp / 4)
    await writePlayer(usr_qq, player)
    Send(Text('天空一声巨响，未降下雷劫，就被天道的气势震死了。'))
    return false
  }
  if (dj > 0) {
    Send(Text('已经有人在渡劫了,建议打死他'))
    return false
  }
  dj++
  //渡劫成功率
  let l = (x - n) / (p + y * 0.1)
  l = l * 100
  l = l.toFixed(2)
  Send(Text('天道：就你，也敢逆天改命？'))
  Send(
    Text(
      '[' +
        player.名号 +
        ']' +
        '\n雷抗：' +
        x +
        '\n成功率：' +
        l +
        '%\n灵根：' +
        player.灵根.type +
        '\n需渡' +
        y +
        '道雷劫\n将在一分钟后落下\n[温馨提示]\n请把其他渡劫期打死后再渡劫！'
    )
  )
  let aconut = 1
  const time: any = setInterval(async function () {
    const flag = await LevelTask(e, n, m, y, aconut)
    aconut++
    if (!flag) {
      dj = 0
      clearInterval(time)
    }
  }, 60000)
})
