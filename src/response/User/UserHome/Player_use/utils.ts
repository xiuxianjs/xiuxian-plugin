import { convert2integer } from '@src/model/common';
import { foundthing } from '@src/model/cultivation';
import { existNajieThing } from '@src/model/najie';
import type { NajieCategory } from '@src/types/model';
import { PINJI_MAP, type ThingInfo } from './types';

// 解析品级
export const parsePinji = (raw: any): number | undefined => {
  if (typeof raw !== 'string' || raw === '') {
    return undefined;
  }

  if (raw in PINJI_MAP) {
    return PINJI_MAP[raw];
  }

  const n = Number(raw);

  return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
};

// 安全数字转换
export const toNumber = (v: any, def = 0): number => (typeof v === 'number' ? v : def);

// 获取物品类型
export const thingType = (obj: any): string | undefined => (obj && typeof obj === 'object' && 'type' in obj ? (obj as { type?: string }).type : undefined);

// 解析指令参数
export const parseCommand = async (
  msg: string,
  startCode: string,
  najie: any
): Promise<{
  thingName: string;
  quantity: number;
  pinji?: number;
  realThingName: string;
  thingExist: ThingInfo;
  thingClass: string;
} | null> => {
  const code = msg.split('*').map(s => s.trim());
  let thingName: string = code[0];
  const maybeIndex = Number(code[0]);
  const quantityRaw = code[1];
  let quantity = convert2integer(quantityRaw);

  if (!quantity || quantity <= 0) {
    quantity = 1;
  }

  // 装备代号解析
  if (startCode === '装备' && Number.isInteger(maybeIndex) && maybeIndex > 100) {
    try {
      const target = najie.装备[maybeIndex - 101];

      if (!target) {
        throw new Error('no equip');
      }

      thingName = target.name;
      code[1] = String(target.pinji);
    } catch {
      return null;
    }
  }

  // 真正的装备名称去掉thingName后的数字
  const realThingName = thingName.replace(/\d+$/, '');
  const thingExist = await foundthing(realThingName);

  if (!thingExist) {
    return null;
  }

  const thingClass = thingExist.class;
  const pinji = parsePinji(code[1]);

  return {
    thingName,
    quantity,
    pinji,
    realThingName,
    thingExist,
    thingClass: thingClass || '道具'
  };
};

// 验证物品存在性
export const validateThing = async (
  userId: string,
  thingName: string,
  thingClass: string,
  pinji: number | undefined,
  quantity: number,
  startCode: string
): Promise<boolean> => {
  const x = await existNajieThing(userId, thingName, thingClass as NajieCategory, pinji);

  if (!x) {
    return false;
  }

  if (x < quantity && startCode !== '装备') {
    return false;
  }

  return true;
};
