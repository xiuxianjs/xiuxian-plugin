import { writeNajie, readNajie } from './xiuxiandata.js';
import * as _ from 'lodash-es';
import type { Najie, NajieItem, Equipment, EquipmentItem } from '../types/player.js';
import type { EquipmentLike, XianchongLike, XianchongSource, NajieCategory } from '../types/model';
import { getDataList } from './DataList.js';
import { readEquipment, writeEquipment } from './equipment.js';

/**
 * 更新纳戒物品
 * @param userId 玩家QQ
 * @param thingName 物品名称
 * @param thingClass 物品类型
 * @param thing_pinji 物品等级
 * @param lock 物品是否锁定
 * @returns
 */
export async function updateBagThing(
  userId: string,
  thingName: string,
  thingClass: NajieCategory,
  thing_pinji: number | undefined,
  lock: number
): Promise<boolean> {
  const najie: Najie | null = await readNajie(userId);

  if (!najie) {
    return false;
  }

  // 确保 thingClass 对应的数组存在
  if (!Array.isArray(najie[thingClass])) {
    najie[thingClass] = [];
  }

  if (thingClass === '装备' && (thing_pinji || thing_pinji === 0)) {
    for (const i of najie['装备']) {
      if (i.name === thingName && i.pinji === thing_pinji) {
        i.islockd = lock;
      }
    }
  } else {
    for (const i of najie[thingClass]) {
      if (i.name === thingName) {
        i.islockd = lock;
      }
    }
  }
  await writeNajie(userId, najie);

  return true;
}

/**
 * 检查物品是否存在于纳戒中
 * @param userId 玩家QQ
 * @param thingName 物品名称
 * @param thingClass 物品类型
 * @param thing_pinji 物品等级
 * @returns
 */
export async function existNajieThing(
  userId: string,
  thingName: string,
  thingClass: NajieCategory,
  thing_pinji = 0
): Promise<number | false> {
  const najie: Najie | null = await readNajie(userId);

  if (!najie) {
    return false;
  }
  let ifexist: NajieItem | undefined;

  if (thingClass === '装备' && (thing_pinji || thing_pinji === 0)) {
    const equipList = Array.isArray(najie.装备) ? najie.装备 : [];

    ifexist = equipList.find(item => item.name === thingName && item.pinji === thing_pinji);
  } else {
    const type: NajieCategory[] = [
      '装备',
      '丹药',
      '道具',
      '功法',
      '草药',
      '材料',
      '仙宠',
      '仙宠口粮'
    ];

    for (const cat of type) {
      const list = najie[cat];

      if (!Array.isArray(list)) {
        continue;
      }
      ifexist = list.find(item => item.name === thingName);
      if (ifexist) {
        break;
      }
    }
  }
  if (ifexist) {
    return ifexist.数量 || 0;
  }

  return false;
}

/**
 * 添加物品到Najie
 * @param userId 玩家QQ
 * @param name 物品名称
 * @param thingClass 物品类型
 * @param x 物品数量
 * @param pinji 物品等级
 * @returns
 */
export async function addNajieThing(
  userId: string,
  name: string | EquipmentLike | XianchongLike,
  thingClass: NajieCategory,
  x: number,
  pinji?: number
): Promise<void> {
  if (x === 0) {
    return;
  }
  const najie: Najie | null = await readNajie(userId);

  if (!najie) {
    return;
  }

  // 确保 thingClass 对应的数组存在
  if (!Array.isArray(najie[thingClass])) {
    najie[thingClass] = [];
  }
  if (thingClass === '装备') {
    if (!pinji && pinji !== 0) {
      pinji = Math.trunc(Math.random() * 6);
    }
    const z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2];

    if (x > 0) {
      if (typeof name !== 'object') {
        const data = [];

        data[0] = await getDataList('Equipment');
        data[1] = await getDataList('TimeEquipment');
        data[2] = await getDataList('Duanzhaowuqi');
        data[3] = await getDataList('Duanzhaohuju');
        data[4] = await getDataList('Duanzhaobaowu');
        data[5] = await getDataList('Xuanwu');

        for (const i of data) {
          if (!Array.isArray(i)) {
            continue;
          }
          const thing = (i as NajieItem[]).find(item => item.name === name);

          if (thing) {
            const equ = _.cloneDeep(thing) as EquipmentLike;

            equ.pinji = pinji;
            if (typeof equ.atk === 'number') {
              equ.atk *= z[pinji];
            }
            if (typeof equ.def === 'number') {
              equ.def *= z[pinji];
            }
            if (typeof equ.HP === 'number') {
              equ.HP *= z[pinji];
            }
            equ.数量 = x;
            equ.islockd = 0;
            najie[thingClass].push(equ);
            await writeNajie(userId, najie);

            return;
          }
        }
      } else {
        if (!name.pinji) {
          name.pinji = pinji;
        }
        (name as NajieItem).数量 = x;
        (name as NajieItem).islockd = 0;
        najie[thingClass].push(name as NajieItem);
        await writeNajie(userId, najie);

        return;
      }
    }
    const fb = najie[thingClass].find(
      item => item.name === ((name as NajieItem).name || name) && item.pinji === pinji
    );

    if (fb) {
      fb.数量 = (fb.数量 || 0) + x;
    }
    najie.装备 = najie.装备.filter(item => (item.数量 || 0) > 0);
    await writeNajie(userId, najie);

    return;
  } else if (thingClass === '仙宠') {
    if (x > 0) {
      if (typeof name !== 'object') {
        const data = {
          xianchon: await getDataList('Xianchon')
        };
        let thing = data.xianchon.find((item: XianchongSource) => item.name === name);

        if (thing) {
          thing = _.cloneDeep(thing);
          const copied: NajieItem = {
            ...(thing as XianchongSource),
            数量: x,
            islockd: 0,
            class: thing.class || '仙宠',
            name: thing.name
          };

          najie[thingClass].push(copied);
          await writeNajie(userId, najie);

          return;
        }
      } else {
        (name as NajieItem).数量 = x;
        (name as NajieItem).islockd = 0;
        najie[thingClass].push(name as NajieItem);
        await writeNajie(userId, najie);

        return;
      }
    }
    const fb = najie[thingClass].find(item => item.name === ((name as NajieItem).name || name));

    if (fb) {
      fb.数量 = (fb.数量 || 0) + x;
    }
    najie.仙宠 = najie.仙宠.filter(item => (item.数量 || 0) > 0);
    await writeNajie(userId, najie);

    return;
  }
  const exist = await existNajieThing(userId, name as string, thingClass);

  if (x > 0 && !exist) {
    let thing: NajieItem | undefined;
    const data = [];

    data[0] = await getDataList('Danyao');
    data[1] = await getDataList('NewDanyao');
    data[2] = await getDataList('TimeDanyao');
    data[3] = await getDataList('Daoju');
    data[4] = await getDataList('Gongfa');
    data[5] = await getDataList('TimeGongfa');
    data[6] = await getDataList('Caoyao');
    data[7] = await getDataList('Xianchonkouliang');
    data[8] = await getDataList('Duanzhaocailiao');
    for (const i of data) {
      if (!Array.isArray(i)) {
        continue;
      }
      thing = (i as NajieItem[]).find(item => item.name === name);
      if (thing) {
        najie[thingClass].push(thing);
        const fb = najie[thingClass].find(item => item.name === name);

        if (fb) {
          fb.数量 = x;
          fb.islockd = 0;
        }
        await writeNajie(userId, najie);

        return;
      }
    }
  }
  const fb = najie[thingClass].find(item => item.name === name);

  if (fb) {
    fb.数量 = (fb.数量 || 0) + x;
  }
  najie[thingClass] = najie[thingClass].filter(item => (item.数量 || 0) > 0);
  await writeNajie(userId, najie);
}

export async function insteadEquipment(usrId: string, equipmentData: EquipmentLike) {
  await addNajieThing(usrId, equipmentData, '装备', -1, equipmentData.pinji);
  const equipment: Equipment | null = await readEquipment(usrId);

  if (!equipment) {
    return;
  }
  if (equipmentData.type === '武器') {
    await addNajieThing(
      usrId,
      {
        ...equipment.武器,
        name: equipment.武器.name ?? '武器',
        class: '装备',
        数量: 1
      },
      '装备',
      1,
      equipment.武器.pinji
    );
    equipment.武器 = equipmentData as EquipmentItem;
    await writeEquipment(usrId, equipment);

    return;
  }
  if (equipmentData.type === '护具') {
    await addNajieThing(
      usrId,
      {
        ...equipment.护具,
        name: equipment.护具.name ?? '护具',
        class: '装备',
        数量: 1
      },
      '装备',
      1,
      equipment.护具.pinji
    );
    equipment.护具 = equipmentData as EquipmentItem;
    await writeEquipment(usrId, equipment);

    return;
  }
  if (equipmentData.type === '法宝') {
    await addNajieThing(
      usrId,
      {
        ...equipment.法宝,
        name: equipment.法宝.name ?? '法宝',
        class: '装备',
        数量: 1
      },
      '装备',
      1,
      equipment.法宝.pinji
    );
    equipment.法宝 = equipmentData as EquipmentItem;
    await writeEquipment(usrId, equipment);
  }
}

export default {
  updateBagThing,
  existNajieThing,
  addNajieThing,
  insteadEquipment
};
