import { Text, useSend } from 'alemonjs'

import { config, data } from '@src/api/api'
import { readPlayer, isNotNull, Go, Add_修为, Add_灵石, setu } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?怡红院$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  let switchgame = cf.switch.play
  if (switchgame != true) {
    return false
  }
  //统一用户ID名
  let usr_qq = e.UserId
  //全局状态判断
  //得到用户信息
  let player = await readPlayer(usr_qq)
  let now_level_id
  if (!isNotNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return false
  }
  let flag = await Go(e)
  if (!flag) {
    return false
  }
  now_level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  //用id当作收益用
  //收益用
  let money = now_level_id * 1000
  //如果是渡劫期。大概收益用为33*1000=3.3w
  //为防止丹药修为报废，这个收益要成曲线下降
  //得到的修为
  //先是1:1的收益
  let addlevel
  //到了结丹中期收益变低
  //都不是凡人了，还天天祸害人间？
  if (now_level_id < 10) {
    addlevel = money
  } else {
    addlevel = (9 / now_level_id) * money
  }
  //随机数
  let rand = Math.random()
  let ql1 =
    "门口的大汉粗鲁的将你赶出来:'哪来的野小子,没钱还敢来学人家公子爷寻欢作乐?' 被人看出你囊中羞涩,攒到"
  let ql2 = '灵石再来吧！'
  if (player.灵石 < money) {
    Send(Text(ql1 + money + ql2))
    return false
  }
  //加修为
  if (rand < 0.5) {
    let randexp = 90 + Math.floor(Math.random() * 20)
    Send(
      Text(
        '花费了' +
          money +
          '灵石,你好好放肆了一番,奇怪的修为增加了' +
          randexp +
          '!在鱼水之欢中你顿悟了,修为增加了' +
          addlevel +
          '!'
      )
    )
    await Add_修为(usr_qq, addlevel)
    await Add_灵石(usr_qq, -money)
    let gameswitch = cf.switch.Xiuianplay_key
    if (gameswitch == true) {
      setu(e)
    }
    return false
  }
  //被教训
  else if (rand > 0.7) {
    await Add_灵石(usr_qq, -money)
    ql1 = '花了'
    ql2 =
      '灵石,本想好好放肆一番,却赶上了扫黄,无奈在衙门被教育了一晚上,最终大彻大悟,下次还来！'
    Send(Text(ql1 + money + ql2))
    return false
  }
  //被坑了
  else {
    await Add_灵石(usr_qq, -money)
    ql1 =
      '这一次，你进了一个奇怪的小巷子，那里衣衫褴褛的漂亮姐姐说要找你玩点有刺激的，你想都没想就进屋了。\n'
    ql2 =
      '没想到进屋后不多时遍昏睡过去。醒来发现自己被脱光扔在郊外,浑身上下只剩一条裤衩子了。仰天长啸：也不过是从头再来！'
    Send(Text(ql1 + ql2))
    return false
  }
})
