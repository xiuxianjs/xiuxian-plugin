import { Text, useSend } from 'alemonjs';
import { Go, keys, readPlayer, writePlayer } from '@src/model/index';
import mw from '@src/response/mw';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?转换副职$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const usrId = e.UserId;
  // 校验当前是否可进行操作
  const flag = await Go(e);

  if (!flag) {
    return false;
  }

  const player = await readPlayer(usrId);

  if (!player) {
    return false;
  }
  const action = await getDataJSONParseByKey(keys.fuzhi(usrId));

  if (!action) {
    return;
  }
  const a = action.职业名;
  const b = action.职业经验;
  const c = action.职业等级;

  action.职业名 = player.occupation;
  action.职业经验 = player.occupation_exp;
  action.职业等级 = player.occupation_level;
  player.occupation = a;
  player.occupation_exp = b;
  player.occupation_level = c;
  await setDataJSONStringifyByKey(keys.fuzhi(usrId), action);
  await writePlayer(usrId, player);
  void Send(Text(`恭喜${player.名号}转职为[${player.occupation}],您的副职为${action.职业名}`));
});

export default onResponse(selects, [mw.current, res.current]);
