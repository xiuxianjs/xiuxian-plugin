import { pushInfo } from '@src/model/api';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { getDataList } from '@src/model/DataList';
import { addNajieThing, keys } from '@src/model/index';
import { addExp4 } from '@src/model';
import { DataMention, Mention } from 'alemonjs';

function toNum(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? n : d;
}

/**
 * 计算有效采药时间（按时间槽计算）
 * @param start 开始时间
 * @param end 结束时间
 * @param now 当前时间
 * @param slot 时间槽（默认15分钟）
 * @param maxSlots 最大时间槽数（默认48个，即720分钟）
 * @returns 有效时间（分钟）
 */
export function calcEffectiveMinutes(start: number, end: number, now: number, slot = 15, maxSlots = 48) {
  let minutes: number;

  if (end > now) {
    minutes = Math.floor((now - start) / 60000);
  } else {
    minutes = Math.floor((end - start) / 60000);
  }
  if (minutes < slot) {
    return 0;
  }
  const full = Math.min(Math.floor(minutes / slot), maxSlots);

  return full * slot;
}

// 计算职业系数（使用经验表 experience 做近似归一化）
async function calcOccupationFactor(occupation_level: number) {
  const res = await getDataList('experience');

  return res.find(r => r.id === occupation_level)?.rate || 0;
}

export async function plantJiesuan(user_id: string, time: number, group_id?: string) {
  const userId = user_id;
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }
  time = Math.max(1, toNum(time));
  // 经验
  const exp = time * 10;
  // 基础倍率 (低境界减半)
  const k = player.level_id < 22 ? 0.5 : 1;
  const occFactor = await calcOccupationFactor(player.occupation_level);
  // 基础产量
  let sum = (time / 480) * (player.occupation_level * 2 + 12) * k;

  if (player.level_id >= 36) {
    sum = (time / 480) * (player.occupation_level * 3 + 11);
  }
  // names 与概率向量
  const names = [
    '万年凝血草',
    '万年何首乌',
    '万年血精草',
    '万年甜甜花',
    '万年清心草',
    '古神藤',
    '万年太玄果',
    '炼骨花',
    '魔蕴花',
    '万年清灵草',
    '万年天魂菊',
    '仙蕴花',
    '仙缘草',
    '太玄仙草'
  ];
  // 低于36级时使用 sum2，之后使用 sum3。再乘一个职业系数上浮 (1 + occFactor*0.3)
  const sum2 = [0.2, 0.3, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const sum3 = [0.17, 0.22, 0.17, 0.17, 0.17, 0.024, 0.024, 0.024, 0.024, 0.024, 0.024, 0.024, 0.012, 0.011];
  const baseVec = player.level_id < 36 ? sum2 : sum3;
  const mult = 1 + occFactor * 0.3;
  const amounts = baseVec.map(p => p * sum * mult);

  const msg: Array<DataMention | string> = [Mention(userId)];

  msg.push(`\n恭喜你获得了经验${exp},草药:`);
  for (let i = 0; i < amounts.length; i++) {
    const val = Math.floor(amounts[i]);

    if (val <= 0) {
      continue;
    }
    msg.push(`\n${names[i]}${val}个`);
    await addNajieThing(userId, names[i], '草药', val);
  }
  await addExp4(userId, exp);

  if (group_id) {
    pushInfo(group_id, true, msg);
  } else {
    pushInfo(userId, false, msg);
  }

  return false;
}

export async function mineJiesuan(user_id: string, time: number, group_id?: string) {
  const userId = user_id;
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }
  // 基础经验
  const exp = time * 10;
  const occFactor = await calcOccupationFactor(player.occupation_level);
  // 旧代码*10, 这里统一
  const rate = occFactor * 10;
  // 基础矿石量：1.8 ~ 2.2 之间的随机数 * 时间
  const mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * time);
  const ext = `你是采矿师，获得采矿经验${exp}，额外获得矿石${Math.floor(rate * 100)}%,`;
  // 普通矿石量：4 * (rate + 1) * 基础 * 等级缩放
  let end_amount = Math.floor(4 * (rate + 1) * mine_amount1);
  // 锻造材料数量：按时间 & rate 缩放
  const num = Math.floor(((rate / 12) * time) / 30);
  const A = ['金色石胚', '棕色石胚', '绿色石胚', '红色石胚', '蓝色石胚', '金色石料', '棕色石料', '绿色石料', '红色石料', '蓝色石料'];
  const B = ['金色妖石', '棕色妖石', '绿色妖石', '红色妖石', '蓝色妖石', '金色妖丹', '棕色妖丹', '绿色妖丹', '红色妖丹', '蓝色妖丹'];
  const xuanze = Math.trunc(Math.random() * A.length);

  end_amount *= player.level_id / 40;
  end_amount = Math.floor(end_amount);
  await addNajieThing(userId, '庚金', '材料', end_amount);
  await addNajieThing(userId, '玄土', '材料', end_amount);
  await addNajieThing(userId, A[xuanze], '材料', num);
  await addNajieThing(userId, B[xuanze], '材料', Math.trunc(num / 48));
  await addExp4(userId, exp);
  const msg: Array<DataMention | string> = [Mention(userId)];

  msg.push(`\n采矿归来，${ext}\n收获庚金×${end_amount}\n玄土×${end_amount}`);
  msg.push(`\n${A[xuanze]}x${num}\n${B[xuanze]}x${Math.trunc(num / 48)}`);
  if (group_id) {
    pushInfo(group_id, true, msg);
  } else {
    pushInfo(userId, false, msg);
  }

  return false;
}
