import { Text, useSend } from 'alemonjs'
import { redis, data, config } from '@src/api/api'
import { existplayer, readPlayer, isNotNull, addCoin } from '@src/model'
import { selects } from '@src/response/index'
import { openMoneySystem } from '@src/model/money'
import '../game'

export const regular = /^(#|＃|\/)?((大|小)|([1-6]))$/
export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let now_time = new Date().getTime()
  let ifexistplay = await existplayer(usr_qq)
  let game_action: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':game_action'
  )
  if (!ifexistplay || !game_action) return false
  if (isNaN(global.yazhu[usr_qq])) return false
  if (!global.gane_key_user[usr_qq]) {
    Send(Text('媚娘：公子，你还没投入呢'))
    return false
  }
  let player = await readPlayer(usr_qq)
  let es = e.MessageText.replace(/^(#|＃|\/)?/, '')

  // 判断输入是否合法，只接受“大”或“小”或1-6
  if (
    es !== '大' &&
    es !== '小' &&
    ![1, 2, 3, 4, 5, 6].includes(parseInt(es))
  ) {
    return false
  }

  let isWin = false
  let touzi = 0

  const inputMoney = global.yazhu[usr_qq]

  if (/^(#|＃|\/)?(大|小)$/.test(es)) {
    // 统一转换为boolean
    const isBig = es === '大'

    // 调用系统核心逻辑
    const [win, tou] = await openMoneySystem(isBig, inputMoney)
    isWin = win
    touzi = tou

    const cf = config.getConfig('xiuxian', 'xiuxian')
    let x = cf.percentage.Moneynumber
    let y = 1
    let z = cf.size.Money * 10000

    if (isWin) {
      // 赢了
      if (inputMoney >= z) {
        x = cf.percentage.punishment
        y = 0
      }
      global.yazhu[usr_qq] = Math.trunc(inputMoney * x)
      if (isNotNull(player.金银坊胜场)) {
        player.金银坊胜场 = parseInt(player.金银坊胜场) + 1
        player.金银坊收入 =
          parseInt(player.金银坊收入) + parseInt(global.yazhu[usr_qq])
      } else {
        player.金银坊胜场 = 1
        player.金银坊收入 = parseInt(global.yazhu[usr_qq])
      }
      data.setData('player', usr_qq, player)
      addCoin(usr_qq, global.yazhu[usr_qq])
      if (y == 1) {
        Send(
          Text(
            `骰子最终为 ${touzi} 你猜对了！\n现在拥有灵石:${player.灵石 + global.yazhu[usr_qq]}`
          )
        )
      } else {
        Send(
          Text(
            `骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。\n现在拥有灵石:${player.灵石 + global.yazhu[usr_qq]}`
          )
        )
      }
    } else {
      // 输了
      if (isNotNull(player.金银坊败场)) {
        player.金银坊败场 = parseInt(player.金银坊败场) + 1
        player.金银坊支出 = parseInt(player.金银坊支出) + inputMoney
      } else {
        player.金银坊败场 = 1
        player.金银坊支出 = inputMoney
      }
      data.setData('player', usr_qq, player)
      addCoin(usr_qq, -inputMoney)
      let now_money = player.灵石 - inputMoney
      let msg = [`骰子最终为 ${touzi} 你猜错了！\n现在拥有灵石:${now_money}`]
      if (now_money <= 0) {
        msg.push(
          '\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！'
        )
      }
      Send(Text(msg.join('')))
    }
  } else {
    // 猜数字直接判断是否相等，猜中3倍收益
    const inputNumber = parseInt(es)
    touzi = Math.floor(Math.random() * 6) + 1
    isWin = inputNumber === touzi

    if (isWin) {
      const winAmount = inputMoney * 5
      if (isNotNull(player.金银坊胜场)) {
        player.金银坊胜场 = parseInt(player.金银坊胜场) + 1
        player.金银坊收入 = parseInt(player.金银坊收入) + winAmount
      } else {
        player.金银坊胜场 = 1
        player.金银坊收入 = winAmount
      }
      data.setData('player', usr_qq, player)
      addCoin(usr_qq, winAmount)
      Send(
        Text(
          `骰子最终为 ${touzi}，你猜中了！获得${winAmount}灵石\n现在拥有灵石:${player.灵石 + winAmount}`
        )
      )
    } else {
      if (isNotNull(player.金银坊败场)) {
        player.金银坊败场 = parseInt(player.金银坊败场) + 1
        player.金银坊支出 = parseInt(player.金银坊支出) + inputMoney
      } else {
        player.金银坊败场 = 1
        player.金银坊支出 = inputMoney
      }
      data.setData('player', usr_qq, player)
      addCoin(usr_qq, -inputMoney)
      let now_money = player.灵石 - inputMoney
      let msg = [`骰子最终为 ${touzi}，你猜错了！\n现在拥有灵石:${now_money}`]
      if (now_money <= 0) {
        msg.push(
          '\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！'
        )
      }
      Send(Text(msg.join('')))
    }
  }

  // 清理与结束相关逻辑
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':last_game_time', now_time)
  await redis.del('xiuxian@1.3.0:' + usr_qq + ':game_action')
  global.yazhu[usr_qq] = 0
  clearTimeout(global.gametime[usr_qq])
  return false
})
