import { Text, useMessage } from 'alemonjs';
import mw, { selects } from '@src/response/mw';
import { keys, readPlayer } from '@src/model';
import { getDataJSONParseByKey } from '@src/model/DataControl';

export const regular = /^(#|＃|\/)?查看宗门贡献$/;

const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const player = await readPlayer(e.UserId);

  if (!player) {
    void message.send(format(Text('玩家不存在')));

    return;
  }
  if (!player.宗门) {
    void message.send(format(Text('玩家未加入宗门')));

    return;
  }
  if (!['宗主', '副宗主', '长老'].includes(player.宗门['职位'])) {
    void message.send(format(Text('您没有权限查看宗门贡献')));

    return;
  }
  const ass = await getDataJSONParseByKey(keys.association(player.宗门['宗门名称']));

  if (!ass) {
    void message.send(format(Text('宗门不存在')));

    return;
  }
  const allMembers = ass.所有成员;
  const list = [];

  for (const member of allMembers) {
    const user = await readPlayer(member);

    if (!user) {
      continue;
    }
    const money = user.宗门['lingshi_donate'] ?? 0;

    list.push({
      name: user.名号,
      contribution: Math.trunc(money / 10000)
    });
  }
  list.sort((a, b) => b.contribution - a.contribution);
  const msg = list.map(item => `${item.name} : ${item.contribution}`).join('\n');

  void message.send(format(Text('名号     宗门贡献\n' + msg)));
});

export default onResponse(selects, [mw.current, res.current]);
