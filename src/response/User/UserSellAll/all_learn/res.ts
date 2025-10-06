import { Text, useSend } from 'alemonjs';
import { readPlayer, keys, addConsFaByUser, batchAddNajieThings } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { getDataList } from '@src/model/DataList';

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

  // 获取功法数据列表，用于排序
  const gongfaDataList = await getDataList('Gongfa');
  const timeGongfaList = await getDataList('TimeGongfa');
  const allGongfaData = [...gongfaDataList, ...timeGongfaList];

  // 筛选未学习的功法，并附加修炼加成信息
  const unlearnedGongfa = najie.功法
    .filter(l => !player.学习的功法.find(item => item === l.name))
    .map(l => {
      const gongfaData = allGongfaData.find((g: any) => g.name === l.name);

      return {
        name: l.name,
        加成: gongfaData?.修炼加成 ?? 0
      };
    })
    .sort((a, b) => b.加成 - a.加成); // 按修炼加成从高到低排序

  // 选择需要学习的功法
  const canLearnCount = max - player.学习的功法.length;
  const names: string[] = unlearnedGongfa.slice(0, canLearnCount).map(g => g.name);

  if (!names.length) {
    void Send(Text('无新功法'));

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
