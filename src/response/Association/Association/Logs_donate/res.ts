import { Text, useSend } from 'alemonjs';
import { notUndAndNull } from '@src/model/common';
import { readPlayer } from '@src/model';
import { __PATH, keys } from '@src/model/keys';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { isKeys } from '@src/model/utils/isKeys';

export const regular = /^(#|＃|\/)?宗门捐献记录$/;

interface PlayerGuildRef {
  宗门名称: string;
  职位: string;
  lingshi_donate?: number;
}

function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }

  if (!isKeys(player.宗门, ['宗门名称'])) {
    void Send(Text('宗门信息不完整'));

    return false;
  }

  const ass = await getDataJSONParseByKey(keys.association(player.宗门.宗门名称));

  if (!ass) {
    void Send(Text('宗门数据异常'));

    return false;
  }

  const members = Array.isArray(ass.所有成员) ? ass.所有成员 : [];

  if (members.length === 0) {
    void Send(Text('宗门暂无成员'));

    return false;
  }

  const donate_list: Array<{ name: string; lingshi_donate: number }> = [];

  for (const member_qq of members) {
    const member_data = await getDataJSONParseByKey(keys.player(member_qq));

    if (!member_data) {
      continue;
    }

    if (!notUndAndNull(member_data.宗门) || !isPlayerGuildRef(member_data.宗门)) {
      continue;
    }

    const donate = Number(member_data.宗门.lingshi_donate || 0);

    donate_list.push({
      name: String(member_data.名号 || member_qq),
      lingshi_donate: donate
    });
  }

  if (donate_list.length === 0) {
    void Send(Text('暂无捐献记录'));

    return false;
  }

  donate_list.sort((a, b) => b.lingshi_donate - a.lingshi_donate);

  const msg: string[] = [`${ass.宗门名称} 灵石捐献记录表`];

  donate_list.forEach((row, idx) => {
    msg.push(`第${idx + 1}名  ${row.name}  捐赠灵石:${row.lingshi_donate}`);
  });

  void Send(Text(msg.join('\n')));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
