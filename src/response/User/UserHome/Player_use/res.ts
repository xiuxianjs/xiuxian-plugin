import { Image, Mention, Text, useMessage, useSubscribe } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  readPlayer,
  readNajie,
  convert2integer,
  foundthing,
  existNajieThing,
  instead_equipment,
  Read_danyao,
  isNotNull,
  Add_HP,
  addNajieThing,
  Add_修为,
  Add_血气,
  Write_danyao,
  readAll,
  writePlayer,
  Add_魔道值,
  readEquipment,
  writeEquipment,
  getRandomTalent,
  playerEfficiency,
  Add_player_学习功法
} from '@src/model'

import { selects } from '@src/response/index'
import { getQquipmentImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?(装备|消耗|服用|学习)((.*)|(.*)*(.*))$/

export default onResponse(selects, async e => {
  let usr_qq = e.UserId
  const [message] = useMessage(e)
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return
  let player = await readPlayer(usr_qq)
  let najie = await readNajie(usr_qq)
  //检索方法
  let reg = new RegExp(/装备|服用|消耗|学习/)
  let func = reg.exec(e.MessageText)

  let msg = e.MessageText.replace(reg, '')
  msg = msg.replace('#', '')
  let code = msg.split('*')
  let thing_name = code[0]
  code[0] = parseInt(code[0])
  let quantity = code[1]
  quantity = await convert2integer(quantity)
  //装备优化
  if (func[0] == '装备' && code[0] && code[0] > 100) {
    try {
      thing_name = najie.装备[code[0] - 101].name
      code[1] = najie.装备[code[0] - 101].pinji
    } catch {
      // message.send(format(Text('装备代号输入有误!')
      message.send(format(Text('装备代号输入有误!')))
      return
    }
  }
  //看看物品名称有没有设定,是不是瞎说的
  let thing_exist = await foundthing(thing_name)
  if (!thing_exist) {
    message.send(format(Text(`你在瞎说啥呢?哪来的【${thing_name}】?`)))
    return
  }
  let pj = {
    劣: 0,
    普: 1,
    优: 2,
    精: 3,
    极: 4,
    绝: 5,
    顶: 6
  }
  pj = pj[code[1]]
  let x = await existNajieThing(usr_qq, thing_name, thing_exist.class, pj)
  if (!x) {
    message.send(
      format(Text(`你没有【${thing_name}】这样的【${thing_exist.class}】`))
    )
    return
  }
  if (x < quantity) {
    message.send(format(Text(`你只有${thing_name}x${x}`)))
    return
  }
  if (func[0] == '装备') {
    let equ
    if (!pj) {
      equ = najie.装备.find(item => item.name == thing_name)
      for (let i of najie.装备) {
        //遍历列表有没有比那把强的
        if (i.name == thing_name && i.pinji > equ.pinji) {
          equ = i
        }
      }
    } else {
      equ = najie.装备.find(item => item.name == thing_name && item.pinji == pj)
    }
    await instead_equipment(usr_qq, equ)
    let img = await getQquipmentImage(e)
    message.send(format(Image(img)))
    return
  }
  if (func[0] == '服用') {
    let dy = await Read_danyao(usr_qq)
    if (thing_exist.class != '丹药') return
    if (thing_exist.type == '血量') {
      let player = await readPlayer(usr_qq)
      if (!isNotNull(thing_exist.HPp)) {
        thing_exist.HPp = 1
      }
      let blood = parseInt(player.血量上限 * thing_exist.HPp + thing_exist.HP)
      await Add_HP(usr_qq, quantity * blood)
      let now_HP = await readPlayer(usr_qq)
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      message.send(format(Text(`服用成功,当前血量为:${now_HP.当前血量} `)))
      return
    }
    if (thing_exist.type == '修为') {
      await Add_修为(usr_qq, +quantity * thing_exist.exp)
      message.send(
        format(Text(`服用成功,修为增加${+quantity * thing_exist.exp}`))
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (thing_exist.type == '血气') {
      await Add_血气(usr_qq, quantity * thing_exist.xueqi)
      message.send(
        format(Text(`服用成功,血气增加${+quantity * thing_exist.xueqi}`))
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (thing_exist.type == '幸运') {
      if (player.islucky > 0) {
        message.send(
          format(Text('目前尚有福源丹在发挥效果，身体无法承受更多福源'))
        )
        return
      }
      player.islucky = 10 * quantity
      player.addluckyNo = thing_exist.xingyun
      player.幸运 += thing_exist.xingyun
      data.setData('player', usr_qq, player)
      message.send(
        format(
          Text(
            `${thing_name}服用成功，将在之后的 ${
              +quantity * 10
            }次冒险旅途中为你提高幸运值！`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (thing_exist.type == '闭关') {
      dy.biguan = quantity
      dy.biguanxl = thing_exist.biguan
      message.send(
        format(
          Text(
            `${thing_name}提高了你的忍耐力,提高了下次闭关的效率,当前提高${
              dy.biguanxl * 100
            }%\n查看练气信息后生效`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      await Write_danyao(usr_qq, dy)
      return
    }
    if (thing_exist.type == '仙缘') {
      dy.ped = 5 * quantity
      dy.beiyong1 = thing_exist.gailv
      message.send(
        format(
          Text(
            `${thing_name}赐予${player.名号}仙缘,${player.名号}得到了仙兽的祝福`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      await Write_danyao(usr_qq, dy)
      return
    }
    if (thing_exist.type == '凝仙') {
      if (dy.biguan > 0) {
        dy.biguan += thing_exist.机缘 * quantity
      }
      if (dy.lianti > 0) {
        dy.lianti += thing_exist.机缘 * quantity
      }
      if (dy.ped > 0) {
        dy.ped += thing_exist.机缘 * quantity
      }
      if (dy.beiyong2 > 0) {
        dy.beiyong2 += thing_exist.机缘 * quantity
      }
      message.send(
        format(
          Text(
            `丹韵入体,身体内蕴含的仙丹药效增加了${thing_exist.机缘 * quantity}次`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      await Write_danyao(usr_qq, dy)
      return
    }
    if (thing_exist.type == '炼神') {
      dy.lianti = quantity
      dy.beiyong4 = thing_exist.lianshen
      message.send(
        format(
          Text(
            `服用了${thing_name},获得了炼神之力,下次闭关获得了炼神之力,当前炼神之力为${
              thing_exist.lianshen * 100
            }%`
          )
        )
      )
      await Write_danyao(usr_qq, dy)
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (thing_exist.type == '神赐') {
      dy.beiyong2 = quantity
      dy.beiyong3 = thing_exist.概率
      message.send(
        format(
          Text(
            `${player.名号}获得了神兽的恩赐,赐福的概率增加了,当前剩余次数${dy.beiyong2}`
          )
        )
      )
      await Write_danyao(usr_qq, dy)
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (thing_exist.type == '灵根') {
      const a = await readAll('隐藏灵根')
      const newa = Math.floor(Math.random() * a.length)
      player.隐藏灵根 = a[newa]
      await writePlayer(usr_qq, player)
      message.send(
        format(
          Text(
            `神药入体,${player.名号}更改了自己的隐藏灵根,当前隐藏灵根为[${player.隐藏灵根.name}]`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -1)
      return
    }
    if (thing_exist.type == '器灵') {
      if (!player.锻造天赋) {
        message.send(format(Text(`请先去#炼器师能力评测,再来更改天赋吧`)))
        return
      }
      player.锻造天赋 = player.锻造天赋 + thing_exist.天赋 * quantity
      message.send(
        format(
          Text(
            `服用成功,您额外获得了${
              thing_exist.天赋 * quantity
            }天赋上限,您当前炼器天赋为${player.锻造天赋}`
          )
        )
      )
      await writePlayer(usr_qq, player)
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (thing_exist.type == '锻造上限') {
      if (dy.beiyong5 > 0) {
        message.send(format(Text(`您已经增加了锻造上限,消耗完毕再接着服用吧`)))
        return
      }
      dy.xingyun = quantity
      dy.beiyong5 = thing_exist.额外数量
      message.send(
        format(
          Text(
            `服用成功,您下一次的炼器获得了额外的炼器格子[${thing_exist.额外数量}]`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      await Write_danyao(usr_qq, dy)
      return
    }
    if (thing_exist.type == '魔道值') {
      await Add_魔道值(usr_qq, -quantity * thing_exist.modao)
      message.send(
        format(
          Text(`获得了转生之力,降低了${quantity * thing_exist.modao}魔道值`)
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (thing_exist.type == '入魔') {
      await Add_魔道值(usr_qq, quantity * thing_exist.modao)
      message.send(
        format(
          Text(
            `${quantity}道黑色魔气入体,增加了${quantity * thing_exist.modao}魔道值`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (thing_exist.type == '补根') {
      player.灵根 = {
        id: 70001,
        name: '垃圾五灵根',
        type: '伪灵根',
        eff: 0.01,
        法球倍率: 0.01
      }
      data.setData('player', usr_qq, player)
      message.send(
        format(Text(`服用成功,当前灵根为垃圾五灵根,你具备了称帝资格`))
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -1)
      return
    }
    if (thing_exist.type == '补天') {
      player.灵根 = {
        id: 70054,
        name: '天五灵根',
        type: '圣体',
        eff: 0.2,
        法球倍率: 0.12
      }
      data.setData('player', usr_qq, player)
      message.send(format(Text(`服用成功,当前灵根为天五灵根,你具备了称帝资格`)))
      await addNajieThing(usr_qq, thing_name, '丹药', -1)
      return
    }
    if (thing_exist.type == '突破') {
      if (player.breakthrough == true) {
        message.send(format(Text(`你已经吃过破境丹了`)))
        return
      } else {
        player.breakthrough = true
        data.setData('player', usr_qq, player)
        message.send(format(Text(`服用成功,下次突破概率增加20%`)))
        await addNajieThing(usr_qq, thing_name, '丹药', -1)
        return
      }
    }
  }
  if (func[0] == '消耗') {
    if (thing_name == '轮回阵旗') {
      player.lunhuiBH = 1
      data.setData('player', usr_qq, player)
      message.send(
        format(
          Text(
            ['已得到"轮回阵旗"的辅助，下次轮回可抵御轮回之苦的十之八九'].join(
              ''
            )
          )
        )
      )
      await addNajieThing(usr_qq, '轮回阵旗', '道具', -1)
      return
    }
    if (thing_name == '仙梦之匙') {
      if (player.仙宠 == []) {
        message.send(format(Text('你还没有出战仙宠')))
        return
      }
      player.仙宠.灵魂绑定 = 0
      data.setData('player', usr_qq, player)
      await addNajieThing(usr_qq, '仙梦之匙', '道具', -1)
      message.send(format(Text('出战仙宠解绑成功!')))
      return
    }
    if (thing_name == '残卷') {
      let number = await existNajieThing(usr_qq, '残卷', '道具')
      if (isNotNull(number) && number > 9) {
        /** 回复 */
        await message.send(
          format(
            Text(
              '是否消耗十个卷轴兑换一个八品功法？回复:【兑换*功法名】或者【还是算了】进行选择'
            )
          )
        )
        /** 设置上下文 */
        const [subscribe] = useSubscribe(e, selects)
        const sub = subscribe.mount(
          async event => {
            let usr_qq = event.UserId
            const [message] = useMessage(event)
            /** 内容 */
            let choice = event.MessageText
            let code = choice.split('*')
            let les = code[0] //条件
            let gonfa = code[1] //功法

            clearTimeout(timeout)

            if (les == '还是算了') {
              message.send(format(Text('取消兑换')))
              return
            } else if (les == '兑换') {
              let ifexist2 = data.bapin.find(item => item.name == gonfa)
              if (ifexist2) {
                await addNajieThing(usr_qq, '残卷', '道具', -10)
                await addNajieThing(usr_qq, gonfa, '功法', 1)
                message.send(format(Text(`兑换${gonfa}成功`)))
                return
              } else {
                message.send(format(Text('残卷无法兑换该功法')))
                return
              }
            }
          },
          ['UserId']
        )
        const timeout = setTimeout(
          () => {
            try {
              // 不能在回调中执行
              subscribe.cancel(sub)
              message.send(format(Text('已取消操作')))
            } catch (e) {
              logger.error('取消订阅失败', e)
            }
          },
          1000 * 60 * 1
        )
        return
      } else {
        message.send(format(Text('你没有足够的残卷')))
        return
      }
    }
    if (thing_name == '重铸石') {
      let equipment = await readEquipment(usr_qq)
      let type = ['武器', '护具', '法宝']
      let z = [0.8, 1, 1.1, 1.2, 1.3, 1.5]
      for (let j in type) {
        let random = Math.trunc(Math.random() * 6)
        if (!z[equipment[type[j]].pinji]) continue
        equipment[type[j]].atk =
          (equipment[type[j]].atk / z[equipment[type[j]].pinji]) * z[random]
        equipment[type[j]].def =
          (equipment[type[j]].def / z[equipment[type[j]].pinji]) * z[random]
        equipment[type[j]].HP =
          (equipment[type[j]].HP / z[equipment[type[j]].pinji]) * z[random]
        equipment[type[j]].pinji = random
      }
      await writeEquipment(usr_qq, equipment)
      await addNajieThing(usr_qq, '重铸石', '道具', -1)
      message.send(format(Text('使用成功,发送#我的装备查看属性')))
      return
    }
    if (thing_exist.type == '洗髓') {
      if ((await player.linggenshow) != 0) {
        await message.send(format(Text('你未开灵根，无法洗髓！')))
        return
      }
      await addNajieThing(usr_qq, thing_name, '道具', -1)
      player.灵根 = await getRandomTalent()
      data.setData('player', usr_qq, player)
      await playerEfficiency(usr_qq)
      message.send(
        format(
          Mention(usr_qq),
          Text(
            [
              `  服用成功,剩余 ${thing_name}数量: ${x - 1}，新的灵根为 "${
                player.灵根.type
              }"：${player.灵根.name}`,
              '\n可以在【#我的练气】中查看'
            ].join('')
          )
        )
      )
      return
    }
    if (thing_name == '隐身水' || thing_name == '幸运草') {
      message.send(format(Text(`该道具无法在纳戒中消耗`)))
      return
    }
    if (thing_name == '定灵珠') {
      await addNajieThing(usr_qq, thing_name, '道具', -1)
      player.linggenshow = 0
      await writePlayer(usr_qq, player)
      message.send(
        format(
          Text(
            `你眼前一亮，看到了自己的灵根,` +
              `"${player.灵根.type}"：${player.灵根.name}`
          )
        )
      )
      return
    }
    let qh = data.qianghua.find(item => item.name == thing_exist.name)
    if (qh) {
      if (qh.class == '魔头' && player.魔道值 < 1000) {
        message.send(format(Text(`你还是提升点魔道值再用吧!`)))
        return
      } else if (
        qh.class == '神人' &&
        (player.魔道值 > 0 ||
          (player.灵根.type != '转生' && player.level_id < 42))
      ) {
        message.send(format(Text(`你尝试使用它,但是失败了`)))
        return
      }
      player.攻击加成 += qh.攻击 * quantity
      player.防御加成 += qh.防御 * quantity
      player.生命加成 += qh.血量 * quantity
      await writePlayer(usr_qq, player)
      let equipment = await readEquipment(usr_qq)
      await writeEquipment(usr_qq, equipment)
      await addNajieThing(usr_qq, thing_name, '道具', -quantity)
      message.send(format(Text(`${qh.msg}`)))
      return
    }
    message.send(format(Text(`功能开发中,敬请期待`)))
    return
  }
  if (func[0] == '学习') {
    let player = await readPlayer(usr_qq)
    let islearned = player.学习的功法.find(item => item == thing_name)
    if (islearned) {
      message.send(format(Text(`你已经学过该功法了`)))
      return
    }
    await addNajieThing(usr_qq, thing_name, '功法', -1)
    //
    await Add_player_学习功法(usr_qq, thing_name)
    message.send(
      format(Text(`你学会了${thing_name},可以在【#我的炼体】中查看`))
    )
  }
})
