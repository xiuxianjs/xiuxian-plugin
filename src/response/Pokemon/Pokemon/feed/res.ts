import { Text, useSend } from 'alemonjs';

import { convert2integer, notUndAndNull, existNajieThing, addNajieThing } from '@src/model/index';
import { readPlayer, existplayer, writePlayer } from '@src/model';

import { selects } from '@src/response/mw-captcha';
import { getDataList } from '@src/model/DataList';
import { PetItem } from '@src/types';
export const regular = /^(#|＃|\/)?喂给仙宠.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  // 用户不存在
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  const player = await readPlayer(userId);

  if (!player.仙宠) {
    // 有无仙宠
    void Send(Text('你没有仙宠'));

    return false;
  }

  const thing = e.MessageText.replace(/^(#|＃|\/)?喂给仙宠/, '');
  const code = thing.split('*');
  const thingName = code[0]; // 物品
  const thingValue = convert2integer(code[1]); // 数量
  const xianchonkouliangData = await getDataList('Xianchonkouliang');
  const ifexist = xianchonkouliangData.find(item => item.name === thingName); // 查找

  if (!notUndAndNull(ifexist)) {
    void Send(Text('此乃凡物,仙宠不吃' + thingName));

    return false;
  }
  if (!player.仙宠.等级上限) {
    const list = ['Xianchon', 'Changzhuxianchon'];

    for (const item of list) {
      const i = ((await getDataList(item as 'Xianchon' | 'Changzhuxianchon')) as PetItem[]).find(x => x.name === player.仙宠.name);

      if (i) {
        player.仙宠.等级上限 = i.等级上限;
        break;
      }
    }
    if (!notUndAndNull(player.仙宠.等级上限)) {
      void Send(Text('存档出错，请联系管理员'));

      return false;
    }
  }
  if (player.仙宠.等级 === player.仙宠.等级上限 && player.仙宠.品级 !== '仙灵') {
    void Send(Text('等级已达到上限,请主人尽快为仙宠突破品级'));

    return false;
  }
  if (player.仙宠.品级 === '仙灵' && player.仙宠.等级 === player.仙宠.等级上限) {
    void Send(Text('您的仙宠已达到天赋极限'));

    return false;
  }
  // 纳戒中的数量
  const thingQuantity = (await existNajieThing(userId, thingName, '仙宠口粮')) || 0;

  if (thingQuantity < thingValue || !thingQuantity) {
    // 没有
    void Send(Text(`【${thingName}】数量不足`));

    return false;
  }
  // 纳戒数量减少
  await addNajieThing(userId, thingName, '仙宠口粮', -thingValue);
  // 待完善加成
  let jiachen = +ifexist.level * thingValue; // 加的等级

  if (jiachen > player.仙宠.等级上限 - player.仙宠.等级) {
    jiachen = player.仙宠.等级上限 - player.仙宠.等级;
  }
  // 保留
  player.仙宠.加成 += jiachen * player.仙宠.每级增加;
  if (player.仙宠.type === '修炼') {
    player.修炼效率提升 += jiachen * player.仙宠.每级增加;
  }
  if (player.仙宠.type === '幸运') {
    player.幸运 += jiachen * player.仙宠.每级增加;
  }
  if (player.仙宠.等级上限 > player.仙宠.等级 + jiachen) {
    player.仙宠.等级 += jiachen;
  } else {
    if (player.仙宠.品级 === '仙灵') {
      void Send(Text('您的仙宠已达到天赋极限'));
    } else {
      void Send(Text('等级.已达到上限,请主人尽快为仙宠突破品级'));
    }
    player.仙宠.等级 = player.仙宠.等级上限;
  }
  await writePlayer(userId, player);
  void Send(Text(`喂养成功，仙宠的等级增加了${jiachen},当前为${player.仙宠.等级}`));
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
