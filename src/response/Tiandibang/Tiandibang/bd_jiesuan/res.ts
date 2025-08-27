import { Text, useSend } from 'alemonjs';

import { readTiandibang, writeTiandibang, reBangdang } from '../../../../model/tian';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
export const regular = /^(#|＃|\/)?清空积分/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    Send(Text('只有主人可以执行操作'));

    return false;
  }
  try {
    await readTiandibang();
  } catch {
    // 没有表要先建立一个！
    await writeTiandibang([]);
  }
  await reBangdang();
  Send(Text('积分已经重置！'));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
