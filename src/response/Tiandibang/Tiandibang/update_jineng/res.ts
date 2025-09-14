import { Text, useSend } from 'alemonjs';
import { readPlayer } from '@src/model/index';
import { readTiandibang, writeTiandibang } from '../../../../model/tian';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getDataList } from '@src/model/DataList';
export const regular = /^(#|＃|\/)?更新属性$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  // 查看存档
  const player = await readPlayer(userId);

  if (!player) {
    return false;
  }

  const tiandibang = await readTiandibang();

  const index = tiandibang.findIndex(item => item.qq === userId);

  if (index === -1) {
    void Send(Text('请先报名!'));

    return false;
  }

  // 若缺失补全默认字段
  if (typeof tiandibang[index].魔道值 !== 'number') {
    tiandibang[index].魔道值 = player.魔道值 || 0;
  }
  if (typeof tiandibang[index].神石 !== 'number') {
    tiandibang[index].神石 = player.神石 || 0;
  }
  if (typeof tiandibang[index].次数 !== 'number') {
    tiandibang[index].次数 = 0;
  }
  const levelList = await getDataList('Level1');
  const cur = levelList.find(item => item.level_id === player.level_id);

  if (!cur) {
    return;
  }

  //
  const row = tiandibang[index];

  row.名号 = player.名号;
  row.境界 = cur.level_id;
  row.攻击 = player.攻击;
  row.防御 = player.防御;
  row.当前血量 = player.血量上限;
  row.暴击率 = player.暴击率;
  row.学习的功法 = player.学习的功法;
  row.灵根 = player.灵根;
  row.法球倍率 = player.灵根.法球倍率;

  await writeTiandibang(tiandibang);

  const refreshed = row;

  refreshed.暴击率 = Math.trunc(refreshed.暴击率 * 100);

  //
  const msg = [
    '名次：' +
      (index + 1) +
      '\n名号：' +
      refreshed.名号 +
      '\n攻击：' +
      refreshed.攻击 +
      '\n防御：' +
      refreshed.防御 +
      '\n血量：' +
      refreshed.当前血量 +
      '\n暴击：' +
      refreshed.暴击率 +
      '%\n积分：' +
      refreshed.积分
  ];

  void Send(Text(msg.join('')));
});

export default onResponse(selects, [mw.current, res.current]);
