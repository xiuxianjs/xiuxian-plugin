import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  Go,
  readPlayer,
  readNajie,
  convert2integer,
  Add_najie_灵石,
  Add_灵石
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?(存|取)灵石(.*)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let flag = await Go(e)
  if (!flag) return false
  //检索方法
  let reg = new RegExp(/取|存/)
  let func = reg.exec(e.MessageText)[0]
  let msg = e.MessageText.replace(reg, '')
  msg = msg.replace(/^(#|＃|\/)?/, '')
  let lingshi: any = msg.replace('灵石', '')
  if (func == '存' && lingshi == '全部') {
    let P = await readPlayer(usr_qq)
    lingshi = P.灵石
  }
  if (func == '取' && lingshi == '全部') {
    let N = await readNajie(usr_qq)
    lingshi = N.灵石
  }
  lingshi = await convert2integer(lingshi)
  if (func == '存') {
    let player_lingshi = await readPlayer(usr_qq)
    player_lingshi = player_lingshi.灵石
    if (player_lingshi < lingshi) {
      Send(Text(`灵石不足,你目前只有${player_lingshi}灵石`))
      return false
    }
    let najie = await readNajie(usr_qq)
    if (najie.灵石上限 < najie.灵石 + lingshi) {
      await Add_najie_灵石(usr_qq, najie.灵石上限 - najie.灵石)
      await Add_灵石(usr_qq, -najie.灵石上限 + najie.灵石)
      Send(Text(`已为您放入${najie.灵石上限 - najie.灵石}灵石,纳戒存满了`))
      return false
    }
    await Add_najie_灵石(usr_qq, lingshi)
    await Add_灵石(usr_qq, -lingshi)
    Send(
      Text(
        `储存完毕,你目前还有${player_lingshi - lingshi}灵石,纳戒内有${
          najie.灵石 + lingshi
        }灵石`
      )
    )
    return false
  }
  if (func == '取') {
    let najie = await readNajie(usr_qq)
    if (najie.灵石 < lingshi) {
      Send(Text(`纳戒灵石不足,你目前最多取出${najie.灵石}灵石`))
      return false
    }
    let player_lingshi = await readPlayer(usr_qq)
    player_lingshi = player_lingshi.灵石
    await Add_najie_灵石(usr_qq, -lingshi)
    await Add_灵石(usr_qq, lingshi)
    Send(
      Text(`本次取出灵石${lingshi},你的纳戒还剩余${najie.灵石 - lingshi}灵石`)
    )
    return false
  }
})
