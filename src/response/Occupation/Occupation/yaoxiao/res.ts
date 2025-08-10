import { Text, useSend } from 'alemonjs'

import { readDanyao, readPlayer } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?我的药效$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const dy = await readDanyao(usr_qq)
  const player = await readPlayer(usr_qq)
  let m = '丹药效果:'
  if (dy.ped > 0) {
    m += `\n仙缘丹药力${dy.beiyong1 * 100}%药效${dy.ped}次`
  }
  if (dy.lianti > 0) {
    m += `\n炼神丹药力${dy.beiyong4 * 100}%药效${dy.lianti}次`
  }
  if (dy.beiyong2 > 0) {
    m += `\n神赐丹药力${dy.beiyong3 * 100}% 药效${dy.beiyong2}次`
  }
  if (dy.biguan > 0) {
    m += `\n辟谷丹药力${dy.biguanxl * 100}%药效${dy.biguan}次`
  }
  if (player.islucky > 0) {
    m += `\n福源丹药力${player.addluckyNo * 100}%药效${player.islucky}次`
  }
  if (player.breakthrough == true) {
    m += `\n破境丹生效中`
  }
  if (dy.xingyun > 0) {
    m += `\n真器丹药力${dy.beiyong5}药效${dy.xingyun}次`
  }
  Send(Text(m))
})
