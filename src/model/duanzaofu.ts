import { __PATH } from './keys.js';
import { writePlayer } from './pub.js';
import type { Tripod, TalentInfo } from '../types/player.js';
import { getDataList } from './DataList.js';
import { LIB_MAP, LibHumanReadable } from '../types/model.js';
import type { CustomRecord } from '../types/model.js';
import { keys } from './keys.js';
import { readPlayer } from './xiuxian_impl.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

export async function settripod(qq: string): Promise<string> {
  const tripod1: Tripod[] = await readTripod();

  const A = await looktripod(qq);

  if (A !== 1) {
    const newtripod: Tripod = {
      qq: qq,
      煅炉: 0,
      容纳量: 10,
      材料: [],
      数量: [],
      TIME: 0,
      时长: 30000,
      状态: 0,
      预计时长: 0
    };

    tripod1.push(newtripod);
    await writeDuanlu(tripod1);
  }
  const player = await readPlayer(qq);

  if (!player) {
    return '玩家数据获取失败';
  }
  const tianfu = Math.floor(40 * Math.random() + 80);

  player.锻造天赋 = tianfu;
  // 增加隐藏灵根
  const a = await readAll('隐藏灵根');
  const newa = Math.floor(Math.random() * a.length);
  const candidate = a[newa];
  const isTalentInfo = (x): x is TalentInfo =>
    !!x && typeof x === 'object' && 'type' in x && 'name' in x;

  if (isTalentInfo(candidate)) {
    player.隐藏灵根 = candidate;
  }
  await writePlayer(qq, player);
  const B = `获得煅炉，天赋[${player.锻造天赋}],隐藏灵根为[${player.隐藏灵根?.name || '未知'}]`;

  return B;
}

export async function looktripod(qq: string): Promise<number> {
  const tripod: Tripod[] = await readTripod();

  for (const item of tripod) {
    if (qq === item.qq) {
      return 1;
    }
  }

  return 0;
}

export async function readMytripod(qq: string): Promise<Tripod | undefined> {
  const tripod: Tripod[] = await readTripod();

  for (const item of tripod) {
    if (qq === item.qq) {
      return item;
    }
  }
}
export async function readTripod(): Promise<Tripod[]> {
  const data = await getDataJSONParseByKey(keys.duanlu('duanlu'));

  return data ?? [];
}

export async function writeDuanlu(duanlu: Tripod[]): Promise<void> {
  await setDataJSONStringifyByKey(keys.duanlu('duanlu'), duanlu);
}
// 数量矫正, 违规数量改成1
export function jiaozheng(value): number {
  let size: number;

  if (typeof value === 'string') {
    const n = Number(value);

    if (Number.isNaN(n)) {
      return 1;
    }
    size = n;
  } else if (typeof value === 'number') {
    size = value;
  } else {
    return 1;
  }
  if (Number.isNaN(size) || !Number.isFinite(size)) {
    return Number(1);
  }
  size = Math.trunc(size);
  if (size < 1 || Number.isNaN(size)) {
    return Number(1);
  }

  return Number(size);
}

// 读取item 中某个json文件中的属性
export async function readThat(
  thingName: string,
  weizhi: LibHumanReadable
): Promise<unknown | undefined> {
  const key = LIB_MAP[weizhi];
  const arr = await getDataList(key);

  if (Array.isArray(arr)) {
    for (const item of arr) {
      if (item && typeof item === 'object' && 'name' in item && item.name === thingName) {
        return item;
      }
    }
  }

  return undefined;
}

// 读取item某个文件的全部物品
// 返回 unknown[] 保持宽松兼容
export async function readAll(weizhi: LibHumanReadable) {
  const key = LIB_MAP[weizhi];
  const arr = await getDataList(key);

  return Array.isArray(arr) ? arr : [];
}

// 对值相同的五行进行挑选
export function getxuanze(shuju: string[], linggentype: number): Promise<[string, number] | false> {
  let i;
  const shuzu = [1, 2, 3, 4, 5];
  const wuxing = ['金', '木', '土', '水', '火', '金', '木', '土', '水', '火'];
  const b = ['金', '木', '土', '水', '火'];
  let a: string;
  const c: string[] = [];

  for (const item in shuzu) {
    if (shuzu[item] === linggentype) {
      for (i = Number(item); i < Number(item) + 5; i++) {
        for (const item1 of shuju) {
          if (item1 === wuxing[i]) {
            a = item1;
            c.push(a);
          }
        }
      }
    }
  }
  for (const item2 in b) {
    if (b[item2] === a) {
      return [c[0], shuzu[item2]];
    }
  }

  return false;
}

export function mainyuansu(shuju: number[]): string | undefined {
  const B = ['金', '木', '土', '水', '火'];

  for (const item in shuju) {
    if (shuju[item] !== 0) {
      return B[item];
    }
  }
}
// 判断相生相克只有两个值不为0
export function restraint(shuju: number[], main: string): [string, number] {
  const newshuzu: string[] = [];
  const shuju2: number[] = [];
  const shuzu = ['金', '木', '土', '水', '火', '金', '木', '土', '水', '火'];

  for (const item in shuju) {
    if (shuju[item] !== 0) {
      newshuzu.push(shuzu[item]);
      shuju2.push(shuju[item]);
    }
  }
  let houzui = '';
  let jiaceng: number;

  // [ '木', '水']
  for (const item in shuzu) {
    if (
      (shuzu[item] === newshuzu[0] && shuzu[Number(item) + 1] === newshuzu[1]) ||
      (shuzu[item] === newshuzu[1] && shuzu[Number(item) + 1] === newshuzu[0])
    ) {
      houzui = `毁${main}灭灵`;
      jiaceng = 0.5;

      return [houzui, jiaceng];
    }

    if (
      (shuzu[item] === newshuzu[0] && shuzu[Number(item) + 2] === newshuzu[1]) ||
      (shuzu[item] === newshuzu[1] && shuzu[Number(item) + 2] === newshuzu[0])
    ) {
      if (main === newshuzu[0]) {
        houzui = `神${main}相生`;
        jiaceng = 0.3;

        return [houzui, jiaceng];
      } else if (main === newshuzu[1]) {
        houzui = `供${main}相生`;
        jiaceng = 0.2;

        return [houzui, jiaceng];
      }
    }
  }
  houzui = `地${main}双生`;
  jiaceng = 0.08;

  return [houzui, jiaceng];
}

export async function readIt(): Promise<unknown> {
  const data = await getDataJSONParseByKey(keys.custom('custom'));

  return data ?? [];
}

export async function readItTyped(): Promise<CustomRecord[]> {
  const data = await getDataJSONParseByKey(keys.custom('custom'));

  return (data ?? []).filter(r => typeof r === 'object' && r) as CustomRecord[];
}
