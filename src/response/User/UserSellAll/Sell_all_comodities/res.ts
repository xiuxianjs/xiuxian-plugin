import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import { existplayer, Add_najie_thing, Add_灵石, sleep } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?一键出售(.*)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let commodities_price = 0
  let najie = await data.getData('najie', usr_qq)
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
  let wupin1 = []
  if (e.MessageText != '#一键出售') {
    let thing = e.MessageText.replace('(#|＃|/)?一键出售', '')
    for (let i of wupin) {
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
    for (let i of wupin) {
      for (let l of najie[i]) {
        if (l && l.islockd == 0) {
          //纳戒中的数量
          let quantity = l.数量
          await Add_najie_thing(usr_qq, l.name, l.class, -quantity, l.pinji)
          commodities_price = commodities_price + l.出售价 * quantity
        }
      }
    }
    await Add_灵石(usr_qq, commodities_price)
    Send(Text(`出售成功!  获得${commodities_price}灵石 `))
    return false
  }
  let goodsNum = 0
  let goods = []
  goods.push('正在出售:')
  for (let i of wupin) {
    for (let l of najie[i]) {
      if (l && l.islockd == 0) {
        //纳戒中的数量
        let quantity = l.数量
        goods.push('\n' + l.name + '*' + quantity)
        goodsNum++
      }
    }
  }
  if (goodsNum == 0) {
    Send(Text('没有东西可以出售'))
    return false
  }
  goods.push('\n回复[1]出售,回复[0]取消出售')
  /** 设置上下文 */
  //todo 上下文
  // this.setContext('noticeSellAllGoods')
  for (let i = 0; i < goods.length; i += 8) {
    Send(Text(goods.slice(i, i + 8).join('')))
    await sleep(500)
  }
  /** 回复 */
})
