import { Image, Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import {
  existplayer,
  readPlayer,
  foundthing,
  insteadEquipment
} from '@src/model/index'

import { selects } from '@src/response/index'
import { getQquipmentImage } from '@src/model/image'
import DataList from '@src/model/DataList'
import { EquipmentLike } from '@src/types/model'
export const regular = /^(#|＃|\/)?一键装备$/

interface EquipItem {
  name: string
  type: '武器' | '护具' | '法宝'
  atk: number
  def: number
  HP: number
  [k: string]: unknown
}
interface NajieEquipBag {
  装备?: EquipItem[]
}
interface EquipmentSlots {
  武器?: EquipItem
  护具?: EquipItem
  法宝?: EquipItem
  [k: string]: EquipItem | undefined
}

function num(v, d = 0) {
  const num = Number(v)
  if (isNaN(num) || !isFinite(num)) return d
  return num
}

function calcBaseThree(
  player: Record<string, unknown>
): [number, number, number] | null {
  const levelObj = DataList.Level_list.find(
    i => i['level_id'] === player['level_id']
  )
  const phyObj = DataList.LevelMax_list.find(
    i => i['level_id'] === player['Physique_id']
  )
  if (!levelObj || !phyObj) return null
  const atk =
    num(levelObj.基础攻击) + num(player['攻击加成']) + num(phyObj.基础攻击)
  const def =
    num(levelObj.基础防御) + num(player['防御加成']) + num(phyObj.基础防御)
  const hp =
    num(levelObj.基础血量) + num(player['生命加成']) + num(phyObj.基础血量)
  return [atk, def, hp]
}

function score(e: EquipItem, base: [number, number, number]): number {
  const small = e.atk < 10 && e.def < 10 && e.HP < 10
  return small
    ? e.atk * base[0] * 0.43 + e.def * base[1] * 0.16 + e.HP * base[2] * 0.41
    : e.atk * 0.43 + e.def * 0.16 + e.HP * 0.41
}

function toEquipLike(item: EquipItem, cls: string): EquipmentLike {
  return {
    name: item.name,
    type: item.type,
    atk: num(item.atk),
    def: num(item.def),
    HP: num(item.HP),
    class: cls,
    bao: num(item.bao),
    pinji: num(item.pinji)
  }
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const najie = (await data.getData('najie', usr_qq)) as NajieEquipBag | null
  const player = (await readPlayer(usr_qq)) as Record<string, unknown>
  const base = calcBaseThree(player)
  if (!base) {
    Send(Text('境界数据缺失，无法智能换装'))
    return false
  }
  const equipment = (await data.getData(
    'equipment',
    usr_qq
  )) as EquipmentSlots | null
  if (!equipment) {
    Send(Text('当前装备数据异常'))
    return false
  }
  const bagList = Array.isArray(najie?.装备) ? najie!.装备! : []

  const slotTypes: Array<keyof EquipmentSlots> = ['武器', '护具', '法宝']
  for (const slot of slotTypes) {
    const current = equipment[slot]
    if (!current) continue
    let bestScore = score(current, base)

    let best: EquipItem | null = null
    for (const item of bagList) {
      if (!item || item.type !== slot) continue
      const thing = await foundthing(item.name)
      if (!thing) continue
      const sc = score(item, base)

      if (sc > bestScore) {
        bestScore = sc
        best = item
      }
    }
    if (best) {
      const defThing = await foundthing(best.name)

      if (defThing) {
        const equipArg = toEquipLike(best, defThing.class)

        await insteadEquipment(usr_qq, equipArg)
      }
    }
  }
  const img = await getQquipmentImage(
    e as Parameters<typeof getQquipmentImage>[0]
  )
  if (Buffer.isBuffer(img)) {
    Send(Image(img))
    return false
  }
  Send(Text('图片加载失败'))
})
