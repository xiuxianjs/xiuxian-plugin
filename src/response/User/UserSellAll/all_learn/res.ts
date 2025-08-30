import { Text, useSend } from 'alemonjs';
import { readPlayer, addNajieThing, keys, addConsFaByUser } from '@src/model/index';
import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?一键学习$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const player = await readPlayer(userId);

  if (!player) {
    return;
  }
  // 检索方法
  const najie: null | { 功法: Array<{ name: string }> } = await getDataJSONParseByKey(keys.najie(userId));

  if (!najie || !Array.isArray(najie?.功法)) {
    return;
  }

  const names: string[] = [];

  najie.功法.map(l => {
    const islearned = player.学习的功法.find(item => item === l.name);

    if (!islearned) {
      names.push(l.name);
    }
  });

  if (!names.length) {
    void Send(Text('无新功法'));

    return;
  }

  for (const n of names) {
    await addNajieThing(userId, n, '功法', -1);
  }

  void addConsFaByUser(userId, names);

  void Send(Text(`你学会了${names.join('|')},可以在【#我的炼体】中查看`));
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
