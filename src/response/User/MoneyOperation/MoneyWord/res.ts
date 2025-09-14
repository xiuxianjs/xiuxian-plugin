import { Text, useSend } from 'alemonjs';

import { existplayer, convert2integer, readPlayer, addCoin } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?交税\s*\d+$/;

function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}
const MIN_TAX = 1;
const MAX_TAX = 1_000_000_000_000; // 上限避免异常输入

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const raw = e.MessageText.replace(/^(#|＃|\/)?交税/, '').trim();

  if (!raw) {
    void Send(Text('格式: 交税数量 (例: 交税10000)'));

    return false;
  }

  let amount = toInt(convert2integer(raw), 0);

  if (amount < MIN_TAX) {
    void Send(Text(`至少交税 ${MIN_TAX}`));

    return false;
  }
  if (amount > MAX_TAX) {
    amount = MAX_TAX;
  }

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('存档异常'));

    return false;
  }
  const lingshi = Number(player.灵石) || 0;

  if (lingshi <= 0) {
    void Send(Text('你身无分文，无需交税'));

    return false;
  }
  if (amount > lingshi) {
    void Send(Text('醒醒，你没有那么多'));

    return false;
  }

  await addCoin(userId, -amount);
  void Send(Text(`成功交税 ${amount} 灵石，剩余 ${lingshi - amount}`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
