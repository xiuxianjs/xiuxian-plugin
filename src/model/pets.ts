import { writeNajie, readNajie } from './xiuxian_impl.js';
import { notUndAndNull } from './common.js';
import type { Najie } from '../types/player.js';
import type { OwnedPetItem, PetList } from '../types/model';
import { getDataList } from './DataList.js';

export async function addPet(
  usr_qq: string,
  thing_name: string,
  n: number,
  thing_level: number | null = null
): Promise<void> {
  const x = Number(n);

  if (x === 0) { return; }
  const najie: Najie | null = await readNajie(usr_qq);

  if (!najie) { return; }
  const rawList = Array.isArray(najie.仙宠) ? najie.仙宠 : [];
  const petList: PetList = rawList.map(r => {
    const base: Partial<OwnedPetItem> = r as OwnedPetItem;

    return {
      name: (base.name as string) ?? '',
      class: '仙宠',
      等级: typeof base.等级 === 'number' ? base.等级 : 1,
      每级增加: typeof base.每级增加 === 'number' ? base.每级增加 : 0,
      加成: typeof base.加成 === 'number' ? base.加成 : 0,
      数量: typeof base.数量 === 'number' ? base.数量 : 0,
      islockd: typeof base.islockd === 'number' ? base.islockd : 0
    };
  });
  const trr = petList.find((item: OwnedPetItem) => item.name == thing_name && item.等级 == thing_level);

  if (x > 0 && !notUndAndNull(trr)) {
    interface SourcePetLike {
      name: string;
      等级?: number;
      初始加成?: number;
      每级增加?: number;
      加成?: number;
    }
    const data = getDataList('Xianchon');
    const base = Array.isArray(data)
      ? (data as SourcePetLike[]).find(item => item.name == thing_name)
      : undefined;

    if (!notUndAndNull(base)) {
      console.info('没有这个东西');

      return;
    }
    const newthing: OwnedPetItem = {
      name: base.name,
      class: '仙宠',
      等级: typeof base.等级 === 'number' ? base.等级 : 1,
      每级增加: base.每级增加 ?? base.初始加成 ?? 0,
      加成: base.加成 ?? 0,
      数量: 0,
      islockd: 0
    };

    if (thing_level != null) { newthing.等级 = thing_level; }
    petList.push(newthing);
    // 回写
    (najie).仙宠 = petList;
    const target = petList.find(item => item.name == thing_name && item.等级 == newthing.等级) as OwnedPetItem;

    target.数量 = x;
    target.加成 = target.等级 * target.每级增加;
    target.islockd = 0;
    await writeNajie(usr_qq, najie);

    return;
  }
  if (!trr) { return; }
  const target = petList.find(item => item.name == thing_name && item.等级 == trr.等级) as OwnedPetItem;

  target.数量 += x;
  if (target.数量 < 1) {
    const next = petList.filter(item => item.name != thing_name || item.等级 != trr.等级);

    (najie).仙宠 = next;
  }
  await writeNajie(usr_qq, najie);
}

export default { addPet };
