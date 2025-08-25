import { Text, useMention, useSend } from 'alemonjs';

import { data, redis, config } from '@src/model/api';
import {
  existplayer,
  addCoin,
  readNajie,
  foundthing,
  existNajieThing,
  addNajieThing
} from '@src/model/index';

import { selects } from '@src/response/mw';
import { parseUnitNumber } from '@src/model/utils/utilsx';
import type { NajieCategory } from '@src/types';
import { getRedisKey } from '@src/model/keys';

// 支持灵石赠送和物品赠送（*可选品级和可选单位数量）
export const regular
  = /^(#|＃|\/)?赠送[\u4e00-\u9fa5a-zA-Z\d]+(\*[\u4e00-\u9fa5]+)?(\*\d+(k|w|e)?)?/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const A_qq = e.UserId;

  if (!(await existplayer(A_qq))) {
    return false;
  }

  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) {
    return false;
  }

  const B_qq = target.UserId;

  if (!(await existplayer(B_qq))) {
    Send(Text('此人尚未踏入仙途'));

    return false;
  }

  const A_player = await data.getData('player', A_qq);
  const B_player = await data.getData('player', B_qq);
  const cf = await config.getConfig('xiuxian', 'xiuxian');
  const msg = e.MessageText.replace(/^(#|＃|\/)?赠送/, '').trim();

  // 赠送灵石
  if (msg.startsWith('灵石')) {
    const value = msg.replace(/([\u4e00-\u9fa5])|(\*)/g, '');
    const lingshi: number = parseUnitNumber(value);

    if (lingshi <= 0) {
      Send(Text('数量需为正'));

      return false;
    }
    const cost = cf.percentage.cost;
    const lastlingshi = lingshi + Math.trunc(lingshi * cost);

    if (A_player.灵石 < lastlingshi) {
      Send(Text(`你身上似乎没有${lastlingshi}灵石`));

      return false;
    }
    const nowTime = Date.now();
    const lastgetbungStr = await redis.get(getRedisKey(A_qq, 'last_getbung_time'));
    const lastgetbung_time = lastgetbungStr ? parseInt(lastgetbungStr, 10) : 0;
    const transferTimeout = Math.floor(cf.CD.transfer * 60000);

    if (nowTime < lastgetbung_time + transferTimeout) {
      const remain = lastgetbung_time + transferTimeout - nowTime;
      const waittime_m = Math.trunc(remain / 60000);
      const waittime_s = Math.trunc((remain % 60000) / 1000);

      Send(Text(`每${transferTimeout / 60000}分钟赠送灵石一次，正在CD中，剩余cd: ${waittime_m}分${waittime_s}秒`));

      return false;
    }
    await addCoin(A_qq, -lastlingshi);
    await addCoin(B_qq, lingshi);
    Send(Text(`${B_player.名号} 获得了由 ${A_player.名号}赠送的${lingshi}灵石`));
    await redis.set(getRedisKey(A_qq, 'last_getbung_time'), String(nowTime));

    return;
  }

  // 赠送物品/装备/仙宠
  // 格式支持：名称*品级*数量 或 名称*数量 或 名称
  const code = msg.split('*');

  const thing_name = code[0];

  if (!thing_name) {
    Send(Text('未识别名称'));

    return false;
  }

  // 品级
  const pinjiStr
    = code.length === 3
      ? code[1]
      : code.length === 2 && /[\u4e00-\u9fa5]/.test(code[1])
        ? code[1]
        : undefined;

  // 数量
  const quantityStr
    = code.length === 3
      ? code[2]
      : code.length === 2
        ? /[\u4e00-\u9fa5]/.test(code[1])
          ? undefined
          : code[1]
        : undefined;

  const quantity = quantityStr ? parseUnitNumber(quantityStr) : 1;

  if (quantity <= 0) {
    Send(Text('数量需为正'));

    return false;
  }

  const najie = await readNajie(A_qq);
  const thing_exist = await foundthing(thing_name);

  if (!thing_exist) {
    Send(Text(`这方世界没有[${thing_name}]`));

    return false;
  }

  const pj: Record<string, number> = {
    劣: 0,
    普: 1,
    优: 2,
    精: 3,
    极: 4,
    绝: 5,
    顶: 6
  };

  let thing_piji = pinjiStr ? pj[pinjiStr] : undefined;
  let equ: ((typeof najie.装备)[number] | (typeof najie.仙宠)[number]) | undefined;

  const cls = thing_exist.class as NajieCategory | undefined;

  if (cls === '装备') {
    if (thing_piji !== undefined) {
      equ = najie.装备.find(item => item.name == thing_name && item.pinji == thing_piji);
    } else {
      const sorted = najie.装备
        .filter(item => item.name == thing_name)
        .sort((a, b) => b.pinji - a.pinji);

      equ = sorted[0];
      thing_piji = equ?.pinji;
    }
  } else if (cls === '仙宠') {
    equ = najie.仙宠.find(item => item.name == thing_name);
  }

  if (!cls) {
    Send(Text('不支持赠送此类型物品'));

    return false;
  }

  const own = await existNajieThing(A_qq, thing_name, cls, thing_piji);

  if (own === false || own < quantity) {
    Send(Text(`你还没有这么多[${thing_name}]`));

    return false;
  }

  await addNajieThing(A_qq, thing_name, cls, -quantity, thing_piji);
  if (cls === '装备' || cls === '仙宠') {
    if (!equ) {
      Send(Text('未找到可赠送的实例'));

      return false;
    }
    await addNajieThing(B_qq, equ, cls, quantity, thing_piji);
  } else {
    await addNajieThing(B_qq, thing_name, cls, quantity, thing_piji);
  }
  Send(Text(`${B_player.名号} 获得了由 ${A_player.名号}赠送的[${thing_name}]×${quantity}`));
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
