import { Text, useSend } from 'alemonjs';

import { existplayer, existNajieThing, addNajieThing, addExp2, keys } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?一键服用血气丹$/;

function num(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? n : d;
}

function normalizeCategory(v): Parameters<typeof existNajieThing>[2] {
  return String(v) as Parameters<typeof existNajieThing>[2];
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const najie = await getDataJSONParseByKey(keys.najie(userId));

  if (!najie) {
    return;
  }

  const pills = Array.isArray(najie?.丹药) ? najie.丹药 : [];

  if (!pills.length) {
    void Send(Text('纳戒内没有丹药'));

    return false;
  }

  let totalGain = 0;

  for (const pill of pills) {
    if (!pill || pill.type !== '血气') {
      continue;
    }
    const category = normalizeCategory(pill.class);
    const qty = num(await existNajieThing(userId, pill.name, category), 0);

    if (qty <= 0) {
      continue;
    }
    const gain = num(pill.xueqi, 0) * qty;

    if (gain > 0) {
      await addNajieThing(userId, pill.name, category, -qty);
      totalGain += gain;
    }
  }
  if (totalGain <= 0) {
    void Send(Text('没有可服用的血气丹'));

    return false;
  }
  await addExp2(userId, totalGain);
  void Send(Text(`服用成功，血气增加${totalGain}`));

  return false;
});

import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
