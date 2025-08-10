import data from './XiuxianData.js'
import { Write_najie, readNajie } from './xiuxian_impl.js'
import * as _ from 'lodash-es'

export async function updateBagThing(
  usr_qq,
  thing_name,
  thing_class,
  thing_pinji,
  lock
) {
  const najie: any = await readNajie(usr_qq)
  if (thing_class == '装备' && (thing_pinji || thing_pinji == 0)) {
    for (const i of najie['装备']) {
      if (i.name == thing_name && i.pinji == thing_pinji) i.islockd = lock
    }
  } else {
    for (const i of najie[thing_class]) {
      if (i.name == thing_name) i.islockd = lock
    }
  }
  await Write_najie(usr_qq, najie)
  return true
}

export async function existNajieThing(
  usr_qq,
  thing_name,
  thing_class,
  thing_pinji = 0
) {
  const najie: any = await readNajie(usr_qq)
  let ifexist
  if (thing_class == '装备' && (thing_pinji || thing_pinji == 0)) {
    ifexist = najie.装备.find(
      item => item.name == thing_name && item.pinji == thing_pinji
    )
  } else {
    const type = [
      '装备',
      '丹药',
      '道具',
      '功法',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ]
    for (const i of type) {
      ifexist = najie[i].find(item => item.name == thing_name)
      if (ifexist) break
    }
  }
  if (ifexist) return ifexist.数量
  return false
}

export async function addNajieThing(usr_qq, name, thing_class, x, pinji?) {
  if (x == 0) return
  const najie: any = await readNajie(usr_qq)
  if (thing_class == '装备') {
    if (!pinji && pinji != 0) pinji = Math.trunc(Math.random() * 6)
    const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2]
    if (x > 0) {
      if (typeof name != 'object') {
        const list = [
          'equipment_list',
          'timeequipmen_list',
          'duanzhaowuqi',
          'duanzhaohuju',
          'duanzhaobaowu'
        ]
        for (const i of list) {
          const thing = data[i].find(item => item.name == name)
          if (thing) {
            const equ = _.cloneDeep(thing)
            equ.pinji = pinji
            equ.atk *= z[pinji]
            equ.def *= z[pinji]
            equ.HP *= z[pinji]
            equ.数量 = x
            equ.islockd = 0
            najie[thing_class].push(equ)
            await Write_najie(usr_qq, najie)
            return
          }
        }
      } else {
        if (!name.pinji) name.pinji = pinji
        name.数量 = x
        name.islockd = 0
        najie[thing_class].push(name)
        await Write_najie(usr_qq, najie)
        return
      }
    }
    const fb = najie[thing_class].find(
      item => item.name == (name.name || name) && item.pinji == pinji
    )
    if (fb) fb.数量 += x
    najie.装备 = najie.装备.filter(item => item.数量 > 0)
    await Write_najie(usr_qq, najie)
    return
  } else if (thing_class == '仙宠') {
    if (x > 0) {
      if (typeof name != 'object') {
        let thing = data.xianchon.find(item => item.name == name)
        if (thing) {
          thing = _.cloneDeep(thing)
          thing['数量'] = x
          ;(thing as any)['islockd'] = 0
          najie[thing_class].push(thing)
          await Write_najie(usr_qq, najie)
          return
        }
      } else {
        name.数量 = x
        name.islockd = 0
        najie[thing_class].push(name)
        await Write_najie(usr_qq, najie)
        return
      }
    }
    const fb = najie[thing_class].find(item => item.name == (name.name || name))
    if (fb) fb.数量 += x
    najie.仙宠 = najie.仙宠.filter(item => item.数量 > 0)
    await Write_najie(usr_qq, najie)
    return
  }
  const exist = await existNajieThing(usr_qq, name, thing_class)
  if (x > 0 && !exist) {
    let thing
    const list = [
      'danyao_list',
      'newdanyao_list',
      'timedanyao_list',
      'daoju_list',
      'gongfa_list',
      'timegongfa_list',
      'caoyao_list',
      'xianchonkouliang',
      'duanzhaocailiao'
    ]
    for (const i of list) {
      thing = data[i].find(item => item.name == name)
      if (thing) {
        najie[thing_class].push(thing)
        const fb = najie[thing_class].find(item => item.name == name)
        if (fb) {
          fb.数量 = x
          fb.islockd = 0
        }
        await Write_najie(usr_qq, najie)
        return
      }
    }
  }
  const fb = najie[thing_class].find(item => item.name == name)
  if (fb) fb.数量 += x
  najie[thing_class] = najie[thing_class].filter(item => item.数量 > 0)
  await Write_najie(usr_qq, najie)
}

export async function insteadEquipment(usr_qq, equipment_data) {
  await addNajieThing(usr_qq, equipment_data, '装备', -1, equipment_data.pinji)
  const { readEquipment, writeEquipment } = await import('./equipment.js')
  const equipment: any = await readEquipment(usr_qq)
  if (equipment_data.type == '武器') {
    await addNajieThing(usr_qq, equipment.武器, '装备', 1, equipment.武器.pinji)
    equipment.武器 = equipment_data
    await writeEquipment(usr_qq, equipment)
    return
  }
  if (equipment_data.type == '护具') {
    await addNajieThing(usr_qq, equipment.护具, '装备', 1, equipment.护具.pinji)
    equipment.护具 = equipment_data
    await writeEquipment(usr_qq, equipment)
    return
  }
  if (equipment_data.type == '法宝') {
    await addNajieThing(usr_qq, equipment.法宝, '装备', 1, equipment.法宝.pinji)
    equipment.法宝 = equipment_data
    await writeEquipment(usr_qq, equipment)
    return
  }
}

export default {
  updateBagThing,
  existNajieThing,
  addNajieThing,
  insteadEquipment
}
