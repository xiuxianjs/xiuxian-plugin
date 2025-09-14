import { Image, useSend, Text } from 'alemonjs';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { screenshot } from '@src/image';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { keys } from '@src/model';
export const regular = /^(#|＃|\/)?金银坊记录$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const qq = e.UserId;
  const player = await getDataJSONParseByKey(keys.player(qq));

  if (!player) {
    return;
  }
  const toNum = (v): number => {
    const n = Number(v);

    return Number.isFinite(n) ? n : 0;
  };
  const victory = toNum(player.金银坊胜场);
  const victory_num = toNum(player.金银坊收入);
  const defeated = toNum(player.金银坊败场);
  const defeated_num = toNum(player.金银坊支出);
  const totalRounds = victory + defeated;
  const shenglv = totalRounds > 0 ? ((victory / totalRounds) * 100).toFixed(2) : '0';
  const img = await screenshot('moneyCheck', e.UserId, {
    userId: qq,
    victory,
    victory_num,
    defeated,
    defeated_num,
    shenglv
  });

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));

    return;
  }
  void Send(Text('生成记录失败'));
});

export default onResponse(selects, [mw.current, res.current]);
