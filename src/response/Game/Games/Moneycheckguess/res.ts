import { Text, useSend } from 'alemonjs'

import { redis, data, config } from '@src/api/api'
import { existplayer, Read_player, isNotNull, Add_灵石 } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?^(大|小)$/
import '../game'

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //获取当前时间戳
  let now_time = new Date().getTime()
  //文档
  let ifexistplay = await existplayer(usr_qq)
  //得到此人的状态
  //判断是否是投入用户
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  if (!ifexistplay || +game_action == 1) {
    //不是就返回
    return false
  }
  if (isNaN(global.yazhu[usr_qq])) {
    return false
  }
  //判断是否投入金额
  //是对应的投入用户。
  //检查此人是否已经投入
  if (!global.gane_key_user[usr_qq]) {
    Send(Text('媚娘：公子，你还没投入呢'))
    return false
  }
  let player = await Read_player(usr_qq)
  let es = e.MessageText
  //随机数并取整【1，7）
  let randtime = Math.trunc(Math.random() * 6) + 1
  //点子
  let touzi
  let n
  //防止娶不到整，我们自己取
  for (n = 1; n <= randtime; n++) {
    //是1.111就取1 --是2.0就取到2。没有7.0是不可能取到7的。也就是得到6
    //随机并取整
    touzi = n
  }
  //发送固定点数的touzi
  Send(Text(touzi))
  const cf = config.getConfig('xiuxian', 'xiuxian')
  //你说大，touzi是大。赢了
  if ((es == '大' && touzi > 3) || (es == '小' && touzi < 4)) {
    //赢了
    //获奖倍率
    let x = cf.percentage.Moneynumber
    let y = 1
    let z = cf.size.Money * 10000
    //增加金银坊投资记录
    //投入大于一百万
    if (global.yazhu[usr_qq] >= z) {
      //扣一半的投入
      x = cf.percentage.punishment
      //并提示这是被扣了一半
      y = 0
    }
    global.yazhu[usr_qq] = Math.trunc(global.yazhu[usr_qq] * x)
    //金库
    //获得灵石超过100w
    //积累
    if (isNotNull(player.金银坊胜场)) {
      player.金银坊胜场 = parseInt(player.金银坊胜场) + 1
      player.金银坊收入 =
        parseInt(player.金银坊收入) + parseInt(global.yazhu[usr_qq])
    } else {
      player.金银坊胜场 = 1
      player.金银坊收入 = parseInt(global.yazhu[usr_qq])
    }
    //把记录写入
    data.setData('player', usr_qq, player)
    //得到的
    Add_灵石(usr_qq, global.yazhu[usr_qq])
    if (y == 1) {
      Send(
        Text(
          `骰子最终为 ${touzi} 你猜对了！` +
            '\n' +
            `现在拥有灵石:${player.灵石 + global.yazhu[usr_qq]}`
        )
      )
    } else {
      Send(
        Text(
          [
            `骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。`,
            '\n',
            `现在拥有灵石:${player.灵石 + global.yazhu[usr_qq]}`
          ].join('')
        )
      )
    }
    //重新记录本次时间
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time) //存入缓存
    //清除游戏状态
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1)
    //清除未投入判断
    //清除金额
    global.yazhu[usr_qq] = 0
    //清除游戏CD
    clearTimeout(global.gametime[usr_qq])
    return false
  }
  //你说大，但是touzi<4,是输了
  else if ((es == '大' && touzi < 4) || (es == '小' && touzi > 3)) {
    //输了
    //增加金银坊投资记录
    if (isNotNull(player.金银坊败场)) {
      player.金银坊败场 = parseInt(player.金银坊败场) + 1
      player.金银坊支出 =
        parseInt(player.金银坊支出) + parseInt(global.yazhu[usr_qq])
    } else {
      player.金银坊败场 = 1
      player.金银坊支出 = parseInt(global.yazhu[usr_qq])
    }
    //把记录写入
    data.setData('player', usr_qq, player)
    //只要花灵石的地方就要查看是否存在游戏状态
    Add_灵石(usr_qq, -global.yazhu[usr_qq])
    let msg = [
      `骰子最终为 ${touzi} 你猜错了！`,
      '\n',
      `现在拥有灵石:${player.灵石 - global.yazhu[usr_qq]}`
    ]
    let now_money = player.灵石 - global.yazhu[usr_qq]
    //重新记录本次时间
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time) //存入缓存
    //清除游戏状态
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':game_action', 1)
    //清除未投入判断
    //清除金额
    global.yazhu[usr_qq] = 0
    //清除游戏CD
    clearTimeout(global.gametime[usr_qq])
    //如果扣了之后，钱被扣光了，就提示
    if (now_money <= 0) {
      msg.push(
        '\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！'
      )
    }
    Send(Text(msg.join('')))
    return false
  }
})
