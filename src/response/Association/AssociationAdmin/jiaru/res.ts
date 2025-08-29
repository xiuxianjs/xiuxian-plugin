import { Text, useSend } from 'alemonjs';
import { keys } from '@src/model';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?设置门槛.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  if (!isKeys(player['宗门'], ['宗门名称', '职位'])) {
    void Send(Text('你尚未加入宗门'));

    return false;
  }

  const playerGuild = player['宗门'] as any;
  const role = playerGuild.职位;
  const allow = role === '宗主' || role === '副宗主' || role === '长老';

  if (!allow) {
    void Send(Text('只有宗主、副宗主或长老可以操作'));

    return false;
  }

  const jiar = e.MessageText.replace(/^(#|＃|\/)?设置门槛/, '').trim();

  if (!jiar) {
    void Send(Text('请输入境界名称'));

    return false;
  }

  const levelList = await getDataList('Level1');
  const levelInfo = levelList.find(item => item.level === jiar);

  if (!levelInfo) {
    void Send(Text('境界不存在'));

    return false;
  }

  let jrLevelId = levelInfo.level_id;

  const ass = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));

  if (!ass || !isKeys(ass, ['宗门名称', 'power', '最低加入境界'])) {
    void Send(Text('宗门数据异常'));

    return false;
  }

  if (ass.power === 0 && jrLevelId > 41) {
    jrLevelId = 41;
    void Send(Text('不知哪位大能立下誓言：凡界无仙！'));
  }

  if (ass.power === 1 && jrLevelId < 42) {
    jrLevelId = 42;
    void Send(Text('仅仙人可加入仙宗'));
  }

  ass.最低加入境界 = jrLevelId;
  await setDataJSONStringifyByKey(keys.association(ass.宗门名称), ass);

  void Send(Text('已成功设置宗门门槛，当前门槛:' + jiar));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
