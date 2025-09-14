import { Text, useSend } from 'alemonjs';
import { readPlayer } from '@src/model/index';
import { readTiandibang, writeTiandibang } from '../../../../model/tian';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataList } from '@src/model/DataList';
import { createRankEntry } from '@src/model/Tiandibang';

export const regular = /^(#|＃|\/)?报名比赛/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }

  const tiandibang: any[] = await readTiandibang();

  const index = tiandibang.findIndex(item => item.qq === userId);

  if (index !== -1) {
    void Send(Text('你已经参赛了!'));

    return false;
  }
  const levelList = await getDataList('Level1');

  if (!levelList) {
    return;
  }

  const curLevel = levelList.find(item => item.level_id === player.level_id);

  if (!curLevel) {
    return;
  }

  const playerA = createRankEntry(player, curLevel.level_id, userId);

  tiandibang.push(playerA);

  void writeTiandibang(tiandibang);

  void Send(Text('参赛成功!'));
});

export default onResponse(selects, [mw.current, res.current]);
