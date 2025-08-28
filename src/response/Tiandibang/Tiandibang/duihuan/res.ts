import { Text, useSend } from 'alemonjs';

import { getDataList } from '@src/model/DataList';
import { existplayer, addNajieThing } from '@src/model/index';
import { readTiandibang, writeTiandibang, TiandibangRow } from '../../../../model/tian';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import type { NajieCategory } from '@src/types/model';
export const regular = /^(#|＃|\/)?积分兑换(.*)$/;

interface TianditangItem {
  name: string;
  class: NajieCategory | string;
  积分: number;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(userId))) {
    return false;
  }

  const now = new Date();

  if (now.getDay() !== 0) {
    void Send(Text('物品筹备中，等到周日再来兑换吧'));

    return false;
  }

  const thingName = e.MessageText.replace(/^(#|＃|\/)?积分兑换/, '').trim();

  if (!thingName) {
    void Send(Text('请输入要兑换的物品名'));

    return false;
  }

  const table = ((await getDataList('Tianditang')) || []) as TianditangItem[];
  const item = table.find(it => it.name === thingName);

  if (!item) {
    void Send(Text(`天地堂还没有这样的东西: ${thingName}`));

    return false;
  }
  const needPoint = Number(item.积分) || 0;

  if (needPoint <= 0) {
    void Send(Text('该物品不可兑换'));

    return false;
  }

  const rank = (await readTiandibang()) as TiandibangRow[];

  if (!Array.isArray(rank) || rank.length === 0) {
    void Send(Text('请先报名!'));

    return false;
  }

  const row = rank.find(r => String(r.qq) === String(userId));

  if (!row) {
    void Send(Text('请先报名!'));

    return false;
  }

  if (row.积分 < needPoint) {
    void Send(Text(`积分不足, 还需 ${needPoint - row.积分} 积分兑换 ${thingName}`));

    return false;
  }

  row.积分 -= needPoint;
  await addNajieThing(userId, thingName, item.class as NajieCategory, 1);
  await writeTiandibang(rank);

  void Send(Text(`兑换成功! 获得[${thingName}], 剩余[${row.积分}]积分\n可以在【我的纳戒】中查看`));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
