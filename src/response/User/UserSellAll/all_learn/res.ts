import { Text, useSend } from 'alemonjs';
import { readPlayer, keys, addConsFaByUser, batchAddNajieThings } from '@src/model/index';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';

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

  const max = player.level_id + player.Physique_id;

  if (player.学习的功法.length >= max) {
    void Send(Text('您当前学习功法数量已达上限，请突破后再来'));

    return;
  }

  const names: string[] = [];

  for (const l of najie.功法) {
    const islearned = player.学习的功法.find(item => item === l.name);

    if (!islearned) {
      names.push(l.name);
    }
    if (player.学习的功法.length + names.length >= player.level_id) {
      break;
    }
  }

  if (!names.length) {
    void Send(Text('无新功法'));

    return;
  }
  if (player.学习的功法.length + names.length >= max) {
    void Send(Text('你要学习的功法太多，学不进了，请突破后再来'));

    return;
  }
  void batchAddNajieThings(
    userId,
    names.map(n => ({ name: n, count: -1, category: '功法' }))
  );

  void addConsFaByUser(userId, names);

  void Send(Text(`你学会了${names.join('|')},可以在【#我的炼体】中查看`));
});

export default onResponse(selects, [mw.current, res.current]);
