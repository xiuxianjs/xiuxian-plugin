import data from './XiuxianData.js'
import { Write_najie, readNajie } from './xiuxian_impl.js'
import { notUndAndNull } from './common.js'
import type { Najie } from '../types/player.js'

interface PetItem {
  name: string
  等级: number
  每级增加: number
  加成: number
  数量: number
  islockd: number
  [k: string]: any
}

export async function Add_仙宠(
  usr_qq: string,
  thing_name: string,
  n: number,
  thing_level: number | null = null
): Promise<void> {
  const x = Number(n)
  if (x === 0) return
  const najie: Najie | null = await readNajie(usr_qq)
  if (!najie) return
  const trr = (najie.仙宠 as any).find(
    (item: PetItem) => item.name == thing_name && item.等级 == thing_level
  ) as PetItem | undefined
  if (x > 0 && !notUndAndNull(trr)) {
    const base = (data.xianchon as any).find(
      (item: PetItem) => item.name == thing_name
    )
    if (!notUndAndNull(base)) {
      console.info('没有这个东西')
      return
    }
    const newthing: PetItem = { ...(base as any) }
    if (thing_level != null) newthing.等级 = thing_level
    ;(najie.仙宠 as any).push(newthing)
    const target = (najie.仙宠 as any).find(
      (item: PetItem) => item.name == thing_name && item.等级 == newthing.等级
    ) as PetItem
    target.数量 = x
    target.加成 = target.等级 * target.每级增加
    target.islockd = 0
    await Write_najie(usr_qq, najie)
    return
  }
  if (!trr) return
  const target = (najie.仙宠 as any).find(
    (item: PetItem) => item.name == thing_name && item.等级 == trr.等级
  ) as PetItem
  target.数量 += x
  if (target.数量 < 1) {
    ;(najie.仙宠 as any) = (najie.仙宠 as any).filter(
      (item: PetItem) => item.name != thing_name || item.等级 != trr.等级
    )
  }
  await Write_najie(usr_qq, najie)
}

export default { Add_仙宠 }
