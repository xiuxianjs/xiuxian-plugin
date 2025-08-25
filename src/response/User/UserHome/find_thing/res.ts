import { Text, useSend } from 'alemonjs';

import { data } from '@src/model/api';
import { foundthing, existNajieThing, addNajieThing, existplayer } from '@src/model/index';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?哪里有(.*)$/;

// 物品结构与地点结构(最小必要字段)定义
interface ThingLike {
  name?: string;
}
interface AreaLike {
  name?: string;
  one?: ThingLike[];
  two?: ThingLike[];
  three?: ThingLike[];
}

const AREA_COLLECTION_KEYS = [
  'guildSecrets_list',
  'forbiddenarea_list',
  'Fairyrealm_list',
  'timeplace_list',
  'didian_list',
  'shenjie',
  'mojie',
  'xingge',
  'shop_list'
] as const;
const ITEM_LEVEL_KEYS: (keyof AreaLike)[] = ['one', 'two', 'three'];

function normalizeName(raw: string): string {
  return raw.trim();
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usr_qq = e.UserId;

  const user_qq = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(user_qq))) {
    return false;
  }

  // 提取物品名
  const thingName = normalizeName(e.MessageText.replace(/^(#|＃|\/)?哪里有/, ''));

  if (!thingName) {
    Send(Text('请输入要查找的物品名称'));

    return false;
  }

  // 校验物品是否存在于全局映射(避免无意义遍历)
  const exists = await foundthing(thingName);

  if (!exists) {
    Send(Text(`你在瞎说啥呢?哪来的【${thingName}】?`));

    return false;
  }

  // 检查寻物纸数量
  const paperCount = await existNajieThing(usr_qq, '寻物纸', '道具');

  if (!paperCount || paperCount <= 0) {
    Send(Text('查找物品需要【寻物纸】'));

    return false;
  }

  const foundPlaces: string[] = [];
  const seen = new Set<string>();

  for (const key of AREA_COLLECTION_KEYS) {
    const root: Record<string, unknown> = data;
    const collection = root[key];

    if (!Array.isArray(collection)) {
      continue;
    }
    for (const areaRaw of collection) {
      const area = areaRaw as AreaLike;

      if (!area || typeof area !== 'object') {
        continue;
      }
      const areaName = area.name || '未知地点';
      let matched = false;

      for (const levelKey of ITEM_LEVEL_KEYS) {
        const list = area[levelKey];

        if (!Array.isArray(list) || list.length === 0) {
          continue;
        }
        if (list.some(it => it && typeof it === 'object' && it.name === thingName)) {
          matched = true;
          break;
        }
      }
      if (matched && !seen.has(areaName)) {
        seen.add(areaName);
        foundPlaces.push(areaName);
      }
    }
  }

  // 消耗寻物纸 (无论是否找到，以保持原逻辑的一致资源消耗，但向玩家说明)
  await addNajieThing(usr_qq, '寻物纸', '道具', -1);

  if (foundPlaces.length === 0) {
    Send(Text('天地没有回应......(已消耗1张寻物纸)'));

    return false;
  }

  const resultMsg
    = `【${thingName}】可能出现在:\n`
    + foundPlaces.map(n => `- ${n}`).join('\n')
    + '\n(已消耗1张寻物纸)';

  Send(Text(resultMsg));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
