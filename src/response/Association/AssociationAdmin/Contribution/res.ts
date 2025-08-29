import { Text, useSend } from 'alemonjs';
import { readPlayer } from '@src/model';
import { keys } from '@src/model/keys';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { ZongMen } from '@src/types';

export const regular = /^(#|＃|\/)?查看宗门贡献$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('玩家不存在'));

    return false;
  }

  if (!player.宗门) {
    void Send(Text('玩家未加入宗门'));

    return false;
  }

  if (!['宗主', '副宗主', '长老'].includes(player.宗门.职位)) {
    void Send(Text('您没有权限查看宗门贡献'));

    return false;
  }

  const ass: ZongMen | null = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (!ass) {
    void Send(Text('宗门不存在'));

    return false;
  }

  const allMembers = ass.所有成员;
  const list: Array<{ name: string; contribution: number }> = [];

  for (const member of allMembers) {
    const user = await readPlayer(member);

    if (!user?.宗门) {
      continue;
    }

    const money = user.宗门.lingshi_donate ?? 0;

    list.push({
      name: user.名号,
      contribution: Math.trunc(money / 10000)
    });
  }

  list.sort((a, b) => b.contribution - a.contribution);

  const msg = list.map(item => `${item.name} : ${item.contribution}`).join('\n');

  void Send(Text('名号     宗门贡献\n' + msg));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
