import { Text, useSend } from 'alemonjs';
import {
  __PATH,
  addCoin,
  addExp,
  addExp2,
  foundthing,
  addNajieThing,
  keysByPath
} from '@src/model/index';
import { selects } from '@src/response/mw';
import type { NajieCategory } from '@src/types/model';

// 支持更广格式：#全体发灵石*100  / #全体发修为*500 / #全体发血气*200
// 或 #全体发丹药名*10 / #全体发装备名*品质*数量 (品质: 劣/普/优/精/极/绝/顶)
export const regular = /^(#|＃|\/)?全体发.+$/;

const QUALITY_MAP: Record<string, number> = {
  劣: 0,
  普: 1,
  优: 2,
  精: 3,
  极: 4,
  绝: 5,
  顶: 6
};
const MAX_AMOUNT = 1_000_000_000;

function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return false;
  }

  // 解析玩家列表
  const playerList = await keysByPath(__PATH.player_path);
  const playerCount = playerList.length;

  if (playerCount === 0) {
    Send(Text('暂无玩家存档，发放取消'));

    return false;
  }

  const body = e.MessageText.replace(/^(#|＃|\/)?全体发/, '').trim();

  if (!body) {
    Send(Text('格式: 全体发灵石*数量 / 全体发物品名*数量 / 全体发装备名*品质*数量'));

    return false;
  }
  const seg = body
    .split('*')
    .map(s => s.trim())
    .filter(Boolean);

  if (seg.length === 0) {
    Send(Text('指令解析失败'));

    return false;
  }

  const name = seg[0];
  const isResource = name === '灵石' || name === '修为' || name === '血气';

  // 资源类发放
  if (isResource) {
    if (seg.length < 2) {
      Send(Text('请填写发放数量'));

      return false;
    }
    let amt = toInt(seg[1], 0);

    if (amt <= 0) {
      Send(Text('数量需为正整数'));

      return false;
    }
    if (amt > MAX_AMOUNT) {
      amt = MAX_AMOUNT;
    }

    for (const qq of playerList) {
      if (name === '灵石') {
        await addCoin(qq, amt);
      } else if (name === '修为') {
        await addExp(qq, amt);
      } else {
        await addExp2(qq, amt);
      }
    }
    Send(Text(`发放成功，共${playerCount}人，每人增加 ${name} x ${amt}`));

    return false;
  }

  // 物品 / 装备发放
  const itemMeta = await foundthing(name);

  if (!itemMeta) {
    Send(Text(`这方世界没有[${name}]`));

    return false;
  }

  let quality = 0;
  let amount = 1;

  if (itemMeta.class === '装备') {
    // 装备格式： 名称*品质*数量 或 名称*数量 (无品质默认为 0)
    if (seg.length === 1) {
      // 默认 1 件 普通品质0
    } else if (seg.length === 2) {
      // 判断第二段是否品质或数量
      if (QUALITY_MAP[seg[1]] !== undefined) {
        quality = QUALITY_MAP[seg[1]];
      } else {
        amount = toInt(seg[1], 1);
      }
    } else {
      if (QUALITY_MAP[seg[1]] !== undefined) {
        quality = QUALITY_MAP[seg[1]];
      }
      amount = toInt(seg[2], 1);
    }
  } else {
    // 普通物品: 名称*数量
    if (seg.length >= 2) {
      amount = toInt(seg[1], 1);
    }
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    amount = 1;
  }
  if (amount > MAX_AMOUNT) {
    amount = MAX_AMOUNT;
  }
  if (!Number.isFinite(quality) || quality < 0) {
    quality = 0;
  }

  for (const qq of playerList) {
    await addNajieThing(
      qq,
      name,
      itemMeta.class as NajieCategory,
      amount,
      itemMeta.class === '装备' ? quality : undefined
    );
  }

  Send(Text(`发放成功, 当前${playerCount}人, 每人增加 ${name}${itemMeta.class === '装备' ? `(品质${quality})` : ''} x ${amount}`));

  return false;
});

import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
