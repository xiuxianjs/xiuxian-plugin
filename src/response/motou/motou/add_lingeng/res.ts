import { Text, useObserver, useSend } from 'alemonjs'

import {
  existplayer,
  Read_player,
  exist_najie_thing,
  Add_najie_thing,
  Write_player
} from '@src/model'

export const selects = onSelects(['message.create'])
export const regular = /^(#|＃|\/)?供奉魔石$/

const Res = onResponse(selects, async (e, next) => {
  const Send = useSend(e)
  //固定写法
  let usr_qq = e.UserId
  let player = await Read_player(usr_qq)
  /** 内容 */
  let choice = e.MessageText
  if (choice == '放弃魔根') {
    await Send(Text('重拾道心,继续修行'))

    return
  } else if (choice == '转世魔根') {
    let x = await exist_najie_thing(usr_qq, '魔石', '道具')
    if (!x) {
      Send(Text('你没有魔石'))
      return
    }
    if (x < 10) {
      Send(Text('你魔石不足10个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -10)
    player.灵根 = {
      id: 100991,
      name: '一重魔功',
      type: '魔头',
      eff: 0.36,
      法球倍率: 0.23
    }
    await Write_player(usr_qq, player)
    Send(Text('恭喜你,转世魔头成功!'))
    return
  } else {
    Send(Text('输入错误,请重新输入'))
    next()
  }
})
export default onResponse(selects, async e => {
  const Send = useSend(e)
  //固定写法
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return
  let player: any = await Read_player(usr_qq)
  if (player.魔道值 < 1000) {
    Send(Text('你不是魔头'))
    return
  }
  let x = await exist_najie_thing(usr_qq, '魔石', '道具')
  if (!x) {
    Send(Text('你没有魔石'))
    return
  }
  if (player.灵根.type != '魔头') {
    /** 回复 */
    await Send(
      Text(
        '一旦转为魔根,将会舍弃当前灵根。回复:【放弃魔根】或者【转世魔根】进行选择'
      )
    )
    const Observer = useObserver(e, 'message.create')
    Observer(Res.current, ['UserId'])
    return
  }
  let random = Math.random()
  if (player.灵根.name == '一重魔功') {
    if (x < 20) {
      Send(Text('魔石不足20个,当前魔石数量' + x + '个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -20)
    if (random < 0.9) {
      player.灵根 = {
        id: 100992,
        name: '二重魔功',
        type: '魔头',
        eff: 0.42,
        法球倍率: 0.27
      }
      await Write_player(usr_qq, player)
      Send(Text('恭喜你,灵根突破成功,当前灵根二重魔功!'))
      return
    } else {
      Send(Text('灵根突破失败'))
      return
    }
  } else if (player.灵根.name == '二重魔功') {
    if (x < 30) {
      Send(Text('魔石不足30个,当前魔石数量' + x + '个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -30)
    if (random < 0.8) {
      player.灵根 = {
        id: 100993,
        name: '三重魔功',
        type: '魔头',
        eff: 0.48,
        法球倍率: 0.31
      }
      await Write_player(usr_qq, player)
      Send(Text('恭喜你,灵根突破成功,当前灵根三重魔功!'))
      return
    } else {
      Send(Text('灵根突破失败'))
      return
    }
  } else if (player.灵根.name == '三重魔功') {
    if (x < 30) {
      Send(Text('魔石不足30个,当前魔石数量' + x + '个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -30)
    if (random < 0.7) {
      player.灵根 = {
        id: 100994,
        name: '四重魔功',
        type: '魔头',
        eff: 0.54,
        法球倍率: 0.36
      }
      await Write_player(usr_qq, player)
      Send(Text('恭喜你,灵根突破成功,当前灵根四重魔功!'))
      return
    } else {
      Send(Text('灵根突破失败'))
      return
    }
  } else if (player.灵根.name == '四重魔功') {
    if (x < 40) {
      Send(Text('魔石不足40个,当前魔石数量' + x + '个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -40)
    if (random < 0.6) {
      player.灵根 = {
        id: 100995,
        name: '五重魔功',
        type: '魔头',
        eff: 0.6,
        法球倍率: 0.4
      }
      await Write_player(usr_qq, player)
      Send(Text('恭喜你,灵根突破成功,当前灵根五重魔功!'))
      return
    } else {
      Send(Text('灵根突破失败'))
      return
    }
  } else if (player.灵根.name == '五重魔功') {
    if (x < 40) {
      Send(Text('魔石不足40个,当前魔石数量' + x + '个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -40)
    if (random < 0.5) {
      player.灵根 = {
        id: 100996,
        name: '六重魔功',
        type: '魔头',
        eff: 0.66,
        法球倍率: 0.43
      }
      await Write_player(usr_qq, player)
      Send(Text('恭喜你,灵根突破成功,当前灵根六重魔功!'))
      return
    } else {
      Send(Text('灵根突破失败'))
      return
    }
  } else if (player.灵根.name == '六重魔功') {
    if (x < 40) {
      Send(Text('魔石不足40个,当前魔石数量' + x + '个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -40)
    if (random < 0.4) {
      player.灵根 = {
        id: 100997,
        name: '七重魔功',
        type: '魔头',
        eff: 0.72,
        法球倍率: 0.47
      }
      await Write_player(usr_qq, player)
      Send(Text('恭喜你,灵根突破成功,当前灵根七重魔功!'))
      return
    } else {
      Send(Text('灵根突破失败'))
      return
    }
  } else if (player.灵根.name == '七重魔功') {
    if (x < 50) {
      Send(Text('魔石不足50个,当前魔石数量' + x + '个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -50)
    if (random < 0.3) {
      player.灵根 = {
        id: 100998,
        name: '八重魔功',
        type: '魔头',
        eff: 0.78,
        法球倍率: 0.5
      }
      await Write_player(usr_qq, player)
      Send(Text('恭喜你,灵根突破成功,当前灵根八重魔功!'))
      return
    } else {
      Send(Text('灵根突破失败'))
      return
    }
  } else if (player.灵根.name == '八重魔功') {
    if (x < 50) {
      Send(Text('魔石不足50个,当前魔石数量' + x + '个'))
      return
    }
    await Add_najie_thing(usr_qq, '魔石', '道具', -50)
    if (random < 0.2) {
      player.灵根 = {
        id: 100999,
        name: '九重魔功',
        type: '魔头',
        eff: 1.2,
        法球倍率: 1.2
      }
      await Write_player(usr_qq, player)
      Send(Text('恭喜你,灵根突破成功,当前灵根九重魔功!'))
      return
    } else {
      Send(Text('灵根突破失败'))
      return
    }
  }
})
