import { Text, useMessage, useSubscribe } from 'alemonjs'

import { data } from '@src/model/api'
import { existplayer, addNajieThing, addCoin, sleep } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键出售(.*)$/

export default onResponse(selects, async e => {
  const [message] = useMessage(e)
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let commodities_price = 0
  const najie = await await data.getData('najie', usr_qq)
  let wupin = [
    '装备',
    '丹药',
    '道具',
    '功法',
    '草药',
    '材料',
    '仙宠',
    '仙宠口粮'
  ]
  const wupin1 = []
  if (e.MessageText != '#一键出售') {
    let thing = e.MessageText.replace(/^(#|＃|\/)?/, '')
    for (const i of wupin) {
      if (thing == i) {
        wupin1.push(i)
        thing = thing.replace(i, '')
      }
    }
    if (thing.length == 0) {
      wupin = wupin1
    } else {
      return false
    }
    for (const i of wupin) {
      for (const l of najie[i]) {
        if (l && l.islockd == 0) {
          //纳戒中的数量
          const quantity = l.数量
          await addNajieThing(usr_qq, l.name, l.class, -quantity, l.pinji)
          commodities_price = commodities_price + l.出售价 * quantity
        }
      }
    }
    await addCoin(usr_qq, commodities_price)
    message.send(format(Text(`出售成功!  获得${commodities_price}灵石 `)))
    return false
  }
  let goodsNum = 0
  const goods = []
  goods.push('正在出售:')
  for (const i of wupin) {
    for (const l of najie[i]) {
      if (l && l.islockd == 0) {
        //纳戒中的数量
        const quantity = l.数量
        goods.push('\n' + l.name + '*' + quantity)
        goodsNum++
      }
    }
  }
  if (goodsNum == 0) {
    message.send(format(Text('没有东西可以出售')))
    return false
  }
  goods.push('\n回复[1]出售,回复[0]取消出售')
  /** 设置上下文 */
  for (let i = 0; i < goods.length; i += 8) {
    message.send(format(Text(goods.slice(i, i + 8).join(''))))
    await sleep(500)
  }
  const [subscribe] = useSubscribe(e, selects)
  const sub = subscribe.mount(
    async event => {
      clearTimeout(timeout)
      // 创建
      const [message] = useMessage(event)
      // 获取文本
      const new_msg = event.MessageText
      const difficulty = new_msg === '1'
      if (!difficulty) {
        message.send(format(Text('已取消出售')))
        return
      }
      /**出售*/

      const usr_qq = event.UserId
      //有无存档
      const najie = await data.getData('najie', usr_qq)
      let commodities_price = 0
      const wupin = [
        '装备',
        '丹药',
        '道具',
        '功法',
        '草药',
        '材料',
        '仙宠',
        '仙宠口粮'
      ]
      for (const i of wupin) {
        for (const l of najie[i]) {
          if (l && l.islockd == 0) {
            //纳戒中的数量
            const quantity = l.数量
            await addNajieThing(usr_qq, l.name, l.class, -quantity, l.pinji)
            commodities_price = commodities_price + l.出售价 * quantity
          }
        }
      }
      await addCoin(usr_qq, commodities_price)
      message.send(format(Text(`出售成功!  获得${commodities_price}灵石 `)))
    },
    ['UserId']
  )
  const timeout = setTimeout(
    () => {
      try {
        // 不能在回调中执行
        subscribe.cancel(sub)
        // 发送消息
        message.send(format(Text('超时自动取消出售')))
      } catch (e) {
        logger.error('取消订阅失败', e)
      }
    },
    1000 * 60 * 1
  )
})
