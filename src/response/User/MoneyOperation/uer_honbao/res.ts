import { Text, useMessage } from 'alemonjs';

import { RedEnvelopesKey } from '../Give_honbao/res';
import { addUserCurrency, redis } from '@src/model';
import mw, { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?抢红包/;

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const redEnvelopesId = e.MessageText.replace(/^(#|＃|\/)?抢红包/, '').trim();

  if (!redEnvelopesId) {
    void message.send(format(Text('红包ID不能为空，请使用 #抢红包 <红包ID>，如 #抢红包 1234567')));

    return;
  }
  const redEnvelopes = await redis.get(`${RedEnvelopesKey}${redEnvelopesId}`);

  if (!redEnvelopes) {
    void message.send(format(Text('红包不存在，请检查红包ID是否正确')));

    return;
  }
  const { num, currency, userId, time } = JSON.parse(redEnvelopes) as {
    num: number;
    currency: number;
    userId: string;
    time: number;
  };

  if (num <= 0) {
    void message.send(format(Text('红包已被抢完')));
    await redis.del(`${RedEnvelopesKey}${redEnvelopesId}`);

    return;
  }
  if (userId === e.UserId) {
    void message.send(format(Text('不能抢自己的红包')));

    return;
  }
  await redis.set(`${RedEnvelopesKey}${redEnvelopesId}`, JSON.stringify({ num: num - 1, currency, userId, time }));
  await addUserCurrency(e.UserId, currency);
  if (num - 1 <= 0) {
    await redis.del(`${RedEnvelopesKey}${redEnvelopesId}`);
  }

  void message.send(format(Text(`恭喜你抢到一个${currency}仙缘的红包`)));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
