import {
  Image,
  Mention,
  Text,
  useMessage,
  useSend,
  useSubscribe
} from 'alemonjs'

import { convert2integer } from '@src/model/common'
import { foundthing, getRandomTalent } from '@src/model/cultivation'
import {
  existNajieThing,
  addNajieThing,
  insteadEquipment
} from '@src/model/najie'
import { addExp, addExp2, addExp3, addHP } from '@src/model/economy'
import { readEquipment, writeEquipment } from '@src/model/equipment'
import { playerEfficiency } from '@src/model/efficiency'
import {
  existplayer,
  readPlayer,
  readNajie,
  writePlayer
} from '@src/model/xiuxian_impl'
import { readDanyao, writeDanyao, readAll } from '@src/model/danyao'

import { selects } from '@src/response/index'
import { getQquipmentImage } from '@src/model/image'
import type { NajieCategory } from '@src/types/model'
import type { TalentInfo } from '@src/types/player'
import { getDataList } from '@src/model/DataList'

// 优化：仅匹配指令 + 至少一个非空字符
export const regular = /^(#|＃|\/)?(装备|消耗|服用|学习)\s*\S+/

// 辅助: 安全数字
const PINJI_MAP: Record<string, number> = {
  劣: 0,
  普: 1,
  优: 2,
  精: 3,
  极: 4,
  绝: 5,
  顶: 6
}
const parsePinji = (raw): number | undefined => {
  if (typeof raw !== 'string' || raw === '') return undefined
  if (raw in PINJI_MAP) return PINJI_MAP[raw]
  const n = Number(raw)
  return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined
}

const toNumber = (v, def = 0) => (typeof v === 'number' ? v : def)
const thingType = (obj): string | undefined =>
  obj && typeof obj === 'object' && 'type' in obj
    ? (obj as { type?: string }).type
    : undefined

export default onResponse(selects, async e => {
  const usr_qq = e.UserId
  const [message] = useMessage(e)
  if (!(await existplayer(usr_qq))) return
  const player = await readPlayer(usr_qq)
  const najie = await readNajie(usr_qq)
  if (!player || !najie) return

  const reg = /装备|服用|消耗|学习/
  const func = reg.exec(e.MessageText)
  if (!func) return

  const msg = e.MessageText.replace(reg, '').replace(/^#/, '').trim()
  if (!msg) return
  const code = msg.split('*').map(s => s.trim())
  let thing_name: string = code[0]
  const maybeIndex = Number(code[0])
  const quantityRaw = code[1]
  let quantity = await convert2integer(quantityRaw)
  if (!quantity || quantity <= 0) quantity = 1

  // 装备代号解析
  if (func[0] === '装备' && Number.isInteger(maybeIndex) && maybeIndex > 100) {
    try {
      const target = najie.装备[maybeIndex - 101]
      if (!target) throw new Error('no equip')
      thing_name = target.name
      code[1] = String(target.pinji)
    } catch {
      message.send(format(Text('装备代号输入有误!')))
      return
    }
  }

  // 真正的装备名称去掉thing_name后的数字
  const realThingName = thing_name.replace(/\d+$/, '')
  const thing_exist = await foundthing(realThingName)
  if (!thing_exist) {
    message.send(format(Text(`你在瞎说啥呢?哪来的【${thing_name}】?`)))
    return
  }

  const thingClass = thing_exist.class as string | undefined
  // 品级解析（修复 0 被视为 falsy 问题）
  const pinji = parsePinji(code[1])
  const x = await existNajieThing(
    usr_qq,
    thing_name,
    (thingClass || '道具') as NajieCategory,
    pinji
  )
  if (!x) {
    message.send(
      format(
        Text(`你没有【${thing_name}】这样的【${thingClass || '未知类别'}】`)
      )
    )
    return
  }
  if (x < quantity && func[0] !== '装备') {
    // 装备数量默认按 1 处理
    message.send(format(Text(`你只有${thing_name}x${x}`)))
    return
  }

  // 装备
  if (func[0] === '装备') {
    const equ =
      pinji !== undefined
        ? najie.装备.find(i => i.name === thing_name && i.pinji === pinji)
        : najie.装备
            .filter(i => i.name === thing_name)
            .sort((a, b) => (b.pinji ?? 0) - (a.pinji ?? 0))[0]
    if (!equ) {
      message.send(format(Text(`找不到可装备的 ${thing_name}`)))
      return
    }
    await insteadEquipment(
      usr_qq,
      equ as import('@src/types/model').EquipmentLike
    )
    const img = await getQquipmentImage(
      e as Parameters<typeof getQquipmentImage>[0]
    )
    const Send = useSend(e)
    if (Buffer.isBuffer(img)) {
      Send(Image(img))
      return false
    }
    Send(Text('图片加载失败'))

    return
  }

  // 服用丹药
  if (func[0] == '服用') {
    if (thingClass !== '丹药') return
    // 读取丹药列表并做最终防御：确保为数组
    const dy = await readDanyao(usr_qq)
    const tType = thingType(thing_exist)
    const numOr = (k: string) => toNumber(thing_exist[k])

    if (tType === '血量') {
      const nowPlayer = await readPlayer(usr_qq)
      const HPp = numOr('HPp') || 1
      const HP = numOr('HP')
      const blood = Math.trunc(nowPlayer.血量上限 * HPp + HP)
      await addHP(usr_qq, quantity * blood)
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      const after = await readPlayer(usr_qq)
      message.send(format(Text(`服用成功,当前血量为:${after.当前血量} `)))
      return
    }
    if (tType === '修为') {
      const exp = numOr('exp')
      await addExp(usr_qq, quantity * exp)
      message.send(format(Text(`服用成功,修为增加${quantity * exp}`)))
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (tType === '血气') {
      const xq = numOr('xueqi')
      await addExp2(usr_qq, quantity * xq)
      message.send(format(Text(`服用成功,血气增加${quantity * xq}`)))
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (tType === '幸运') {
      if (player.islucky && player.islucky > 0) {
        message.send(
          format(Text('目前尚有福源丹在发挥效果，身体无法承受更多福源'))
        )
        return
      }
      const xingyun = numOr('xingyun')
      player.islucky = 10 * quantity
      player.addluckyNo = xingyun
      player.幸运 = (player.幸运 || 0) + xingyun
      await writePlayer(usr_qq, player)
      message.send(
        format(
          Text(
            `${thing_name}服用成功，将在之后的 ${quantity * 10}次冒险旅途中为你提高幸运值！`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (tType === '闭关') {
      dy.biguan = quantity
      dy.biguanxl = numOr('biguan')
      message.send(
        format(
          Text(
            `${thing_name}提高了你的忍耐力,提高了下次闭关的效率,当前提高${dy.biguanxl * 100}%\n查看练气信息后生效`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      await writeDanyao(usr_qq, dy)
      return
    }
    if (tType === '仙缘') {
      dy.ped = 5 * quantity
      dy.beiyong1 = numOr('gailv')
      message.send(
        format(
          Text(
            `${thing_name}赐予${player.名号}仙缘,${player.名号}得到了仙兽的祝福`
          )
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      await writeDanyao(usr_qq, dy)
      return
    }
    if (tType === '凝仙') {
      const addTimes = numOr('机缘') * quantity
      if (dy.biguan > 0) dy.biguan += addTimes
      if (dy.lianti > 0) dy.lianti += addTimes
      if (dy.ped > 0) dy.ped += addTimes
      if (dy.beiyong2 > 0) dy.beiyong2 += addTimes
      message.send(
        format(Text(`丹韵入体,身体内蕴含的仙丹药效增加了${addTimes}次`))
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      await writeDanyao(usr_qq, dy)
      return
    }
    if (tType === '炼神') {
      dy.lianti = quantity
      dy.beiyong4 = numOr('lianshen')
      message.send(
        format(
          Text(
            `服用了${thing_name},获得了炼神之力,下次闭关获得了炼神之力,当前炼神之力为${dy.beiyong4 * 100}%`
          )
        )
      )
      await writeDanyao(usr_qq, dy)
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (tType === '神赐') {
      dy.beiyong2 = quantity
      dy.beiyong3 = numOr('概率')
      message.send(
        format(
          Text(
            `${player.名号}获得了神兽的恩赐,赐福的概率增加了,当前剩余次数${dy.beiyong2}`
          )
        )
      )
      await writeDanyao(usr_qq, dy)
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (tType === '灵根') {
      const list = await readAll('隐藏灵根')
      const newIndex = Math.floor(Math.random() * list.length)
      const next = list[newIndex] as {
        name: string
        type: string
        法球倍率?: number
        eff?: number
      }
      // 必需字段补全
      const hidden: TalentInfo = {
        name: next.name,
        type: next.type,
        法球倍率: next.法球倍率 ?? 1,
        eff: next.eff
      }
      player.隐藏灵根 = hidden
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
    if (tType === '器灵') {
      if (!player.锻造天赋) {
        message.send(format(Text('请先去#炼器师能力评测,再来更改天赋吧')))
        return
      }
      const addTalent = numOr('天赋') * quantity
      player.锻造天赋 = (player.锻造天赋 || 0) + addTalent
      message.send(
        format(
          Text(
            `服用成功,您额外获得了${addTalent}天赋上限,您当前炼器天赋为${player.锻造天赋}`
          )
        )
      )
      await writePlayer(usr_qq, player)
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (tType === '锻造上限') {
      if (dy.beiyong5 > 0) {
        message.send(format(Text('您已经增加了锻造上限,消耗完毕再接着服用吧')))
        return
      }
      dy.xingyun = quantity
      dy.beiyong5 = numOr('额外数量')
      message.send(
        format(
          Text(`服用成功,您下一次的炼器获得了额外的炼器格子[${dy.beiyong5}]`)
        )
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      await writeDanyao(usr_qq, dy)
      return
    }
    if (tType === '魔道值') {
      const md = numOr('modao')
      await addExp3(usr_qq, -quantity * md)
      message.send(format(Text(`获得了转生之力,降低了${quantity * md}魔道值`)))
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (tType === '入魔') {
      const md = numOr('modao')
      await addExp3(usr_qq, quantity * md)
      message.send(
        format(Text(`${quantity}道黑色魔气入体,增加了${quantity * md}魔道值`))
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -quantity)
      return
    }
    if (tType === '补根') {
      // 去除 id 字段（TalentInfo 无 id）
      player.灵根 = {
        name: '垃圾五灵根',
        type: '伪灵根',
        eff: 0.01,
        法球倍率: 0.01
      }
      await writePlayer(usr_qq, player)
      message.send(
        format(Text('服用成功,当前灵根为垃圾五灵根,你具备了称帝资格'))
      )
      await addNajieThing(usr_qq, thing_name, '丹药', -1)
      return
    }
    if (tType === '补天') {
      player.灵根 = { name: '天五灵根', type: '圣体', eff: 0.2, 法球倍率: 0.12 }
      await writePlayer(usr_qq, player)
      message.send(format(Text('服用成功,当前灵根为天五灵根,你具备了称帝资格')))
      await addNajieThing(usr_qq, thing_name, '丹药', -1)
      return
    }
    if (tType === '突破') {
      if (player.breakthrough === true) {
        message.send(format(Text('你已经吃过破境丹了')))
        return
      }
      player.breakthrough = true
      await writePlayer(usr_qq, player)
      message.send(format(Text('服用成功,下次突破概率增加20%')))
      await addNajieThing(usr_qq, thing_name, '丹药', -1)
      return
    }
  }
  // 消耗道具
  if (func[0] == '消耗') {
    if (thing_name == '轮回阵旗') {
      player.lunhuiBH = 1
      await writePlayer(usr_qq, player)
      message.send(
        format(Text('已得到"轮回阵旗"的辅助，下次轮回可抵御轮回之苦的十之八九'))
      )
      await addNajieThing(usr_qq, '轮回阵旗', '道具', -1)
      return
    }
    if (thing_name == '仙梦之匙') {
      if (!player.仙宠) {
        message.send(format(Text('你还没有出战仙宠')))
        return
      }
      player.仙宠.灵魂绑定 = 0
      await writePlayer(usr_qq, player)
      await addNajieThing(usr_qq, '仙梦之匙', '道具', -1)
      message.send(format(Text('出战仙宠解绑成功!')))
      return
    }
    if (thing_name == '残卷') {
      const number = await existNajieThing(usr_qq, '残卷', '道具')
      if (typeof number === 'number' && number > 9) {
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
            const usr_qq = event.UserId
            const [message] = useMessage(event)
            /** 内容 */
            const choice = event.MessageText
            const code = choice.split('*')
            const les = code[0] //条件
            const gonfa = code[1] //功法

            clearTimeout(timeout)

            if (les == '还是算了') {
              message.send(format(Text('取消兑换')))
              return
            } else if (les == '兑换') {
              const ifexist2 = data.bapin.find(item => item.name == gonfa)
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
      const equipment = await readEquipment(usr_qq)
      if (!equipment) return
      const type = ['武器', '护具', '法宝'] as const
      const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5]
      for (const t of type) {
        const random = Math.trunc(Math.random() * 6)
        const cur = equipment[t]
        if (!cur || cur.pinji === undefined || !z[cur.pinji]) continue
        cur.atk = (cur.atk / z[cur.pinji]) * z[random]
        cur.def = (cur.def / z[cur.pinji]) * z[random]
        cur.HP = (cur.HP / z[cur.pinji]) * z[random]
        cur.pinji = random
      }
      await writeEquipment(usr_qq, equipment)
      await addNajieThing(usr_qq, '重铸石', '道具', -1)
      message.send(format(Text('使用成功,发送#我的装备查看属性')))
      return
    }
    if (thing_exist && thingType(thing_exist) == '洗髓') {
      const numberOwned = await existNajieThing(usr_qq, thing_name, '道具')
      if ((player.linggenshow ?? 0) != 0) {
        await message.send(format(Text('你未开灵根，无法洗髓！')))
        return
      }
      await addNajieThing(usr_qq, thing_name, '道具', -1)
      player.灵根 = await getRandomTalent()
      await writePlayer(usr_qq, player)
      await playerEfficiency(usr_qq)
      message.send(
        format(
          Mention(usr_qq),
          Text(
            [
              `  服用成功,剩余 ${thing_name}数量: ${(typeof numberOwned === 'number' ? numberOwned : 0) - 1}，新的灵根为 "${
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
    const data = {
      qianghua: await getDataList('Qianghua')
    }
    const qh = data.qianghua.find(
      item => item.name == (thing_exist as { name?: string }).name
    )
    if (qh) {
      if (qh.class == '魔头' && (player.魔道值 ?? 0) < 1000) {
        message.send(format(Text(`你还是提升点魔道值再用吧!`)))
        return
      } else if (
        qh.class == '神人' &&
        ((player.魔道值 ?? 0) > 0 ||
          (player.灵根.type != '转生' && player.level_id < 42))
      ) {
        message.send(format(Text(`你尝试使用它,但是失败了`)))
        return
      }
      if (typeof player.攻击加成 !== 'number')
        player.攻击加成 = Number(player.攻击加成) || 0
      if (typeof player.防御加成 !== 'number')
        player.防御加成 = Number(player.防御加成) || 0
      if (typeof player.生命加成 !== 'number')
        player.生命加成 = Number(player.生命加成) || 0
      player.攻击加成 += toNumber(qh.攻击) * quantity
      player.防御加成 += toNumber(qh.防御) * quantity
      player.生命加成 += toNumber(qh.血量) * quantity
      await writePlayer(usr_qq, player)
      await addNajieThing(usr_qq, thing_name, '道具', -quantity)
      message.send(format(Text(`${qh.msg || '使用成功'}`)))
      return
    }
  }
})
