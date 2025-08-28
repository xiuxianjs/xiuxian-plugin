import { Text, useSend } from 'alemonjs';

import { existplayer, readPlayer, notUndAndNull, writePlayer } from '@src/model/index';
import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?猎户转.*$/;
const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const player = await readPlayer(userId);

  if (player.occupation !== '猎户') {
    void Send(Text('你不是猎户,无法自选职业'));

    return false;
  }
  const occupation = e.MessageText.replace(/^(#|＃|\/)?猎户转/, '');
  const OccupationData = await getDataList('Occupation');

  if (!Array.isArray(OccupationData)) {
    void Send(Text('职业数据获取错误'));

    return false;
  }
  const x = OccupationData.find(item => item.name === occupation);

  if (!notUndAndNull(x)) {
    void Send(Text(`没有[${occupation}]这项职业`));

    return false;
  }
  player.occupation = occupation;
  await writePlayer(userId, player);
  void Send(Text(`恭喜${player.名号}转职为[${occupation}]`));
});

import mw from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
export default onResponse(selects, [mw.current, res.current]);
