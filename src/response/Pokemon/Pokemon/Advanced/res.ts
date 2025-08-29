import { Text, useSend } from 'alemonjs';

import { existNajieThing, addNajieThing, writePlayer, keys, petGrade, notUndAndNull, petLevel } from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?进阶仙宠$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  if (!notUndAndNull(player.仙宠)) {
    // 有无仙宠
    void Send(Text('你没有仙宠'));

    return false;
  }

  const currentIndex = petGrade.findIndex(l => l === player.仙宠.品级);

  if (currentIndex === petGrade.length - 1) {
    void Send(Text('[' + player.仙宠.name + ']已达到最高品级'));

    return false;
  }

  const n = currentIndex + 1;
  const name = n + '级仙石';
  const quantity = await existNajieThing(userId, name, '道具'); // 查找纳戒

  if (!quantity) {
    // 没有
    void Send(Text(`你没有[${name}]`));

    return false;
  }
  const playerLevel = player.仙宠.等级;
  const lastJiachen = player.仙宠.加成;

  if (playerLevel === petLevel[currentIndex]) {
    const xianchonData = await getDataList('Xianchon');
    // 判断是否满级
    const thing = xianchonData.find(item => item.id === player.仙宠.id + 1); // 查找下个等级仙宠

    if (!thing) {
      void Send(Text('仙宠不存在'));

      return;
    }
    player.仙宠 = thing;
    player.仙宠.等级 = playerLevel; // 赋值之前的等级
    player.仙宠.加成 = lastJiachen; // 赋值之前的加成
    await addNajieThing(userId, name, '道具', -1);
    await writePlayer(userId, player);
    void Send(Text('恭喜进阶【' + player.仙宠.name + '】成功'));
  } else {
    const need = Number(petLevel[currentIndex]) - Number(playerLevel);

    void Send(Text('仙宠的灵泉集韵不足,还需要【' + need + '】级方可进阶'));

    return false;
  }
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { getDataList } from '@src/model/DataList';
export default onResponse(selects, [mw.current, res.current]);
