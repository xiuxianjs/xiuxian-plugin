import { Text, useSend } from 'alemonjs';
import { keys } from '@src/model/keys';
import { readPlayer, notUndAndNull } from '@src/model/index';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { isKeys } from '@src/model/utils/isKeys';
import type { ZongMen } from '@src/types/ass';
export const regular = /^(#|＃|\/)?宗门(开启|关闭)审核$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  if (!notUndAndNull(player?.宗门)) {
    void Send(Text('你还没有加入宗门'));

    return;
  }

  if (!isKeys(player.宗门, ['宗门名称', '职位'])) {
    void Send(Text('宗门信息不完整'));

    return;
  }

  const guildInfo = player.宗门;

  // 只有宗主可以设置
  if (guildInfo.职位 !== '宗主') {
    void Send(Text('只有宗主才能设置宗门审核'));

    return;
  }

  const ass: ZongMen | null = await getDataJSONParseByKey(keys.association(guildInfo.宗门名称));

  if (!ass) {
    void Send(Text('宗门数据异常'));

    return;
  }

  const action = e.MessageText.includes('开启') ? 'enable' : 'disable';

  if (action === 'enable') {
    if (ass.需要审核) {
      void Send(Text('宗门审核已经是开启状态'));

      return;
    }

    ass.需要审核 = true;
    await setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);
    void Send(Text('已开启宗门审核，新成员加入需要长老及以上审核通过'));
  } else {
    if (!ass.需要审核) {
      void Send(Text('宗门审核已经是关闭状态'));

      return;
    }

    ass.需要审核 = false;
    await setDataJSONStringifyByKey(keys.association(guildInfo.宗门名称), ass);
    void Send(Text('已关闭宗门审核，新成员可以直接加入'));
  }
});

export default onResponse(selects, [mw.current, res.current]);
