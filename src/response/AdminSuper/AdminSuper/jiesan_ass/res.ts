import { Text, useSend } from 'alemonjs';
import { __PATH, keys, readPlayer, writePlayer } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { redis } from '@src/model/api';
import type { AssociationDetailData } from '@src/types';
import { getDataJSONParseByKey } from '@src/model/DataControl';

export const regular = /^(#|＃|\/)?解散宗门.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  if (!e.IsMaster) {
    return false;
  }
  const didian = e.MessageText.replace(/^(#|＃|\/)?解散宗门/, '').trim();

  if (!didian) {
    void Send(Text('请输入要解散的宗门名称'));

    return false;
  }

  const ass: AssociationDetailData | null = await getDataJSONParseByKey(keys.association(didian));

  if (!ass) {
    return;
  }

  if (!Array.isArray(ass.所有成员)) {
    void Send(Text('未找到该宗门成员信息'));

    return;
  }

  const members = ass.所有成员;

  void Promise.all(
    members.map(async qq => {
      const player = await readPlayer(qq);

      if (!player) {
        return;
      }

      if (player.宗门) {
        delete player.宗门;

        await writePlayer(qq, player);
      }
      //
    })
  ).finally(() => {
    void redis.del(keys.association(didian));
    void Send(Text('解散成功!'));
  });
});

export default onResponse(selects, [mw.current, res.current]);
