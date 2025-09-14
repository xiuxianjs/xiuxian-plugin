import { Text, useSend } from 'alemonjs';

import { existplayer, existNajieThing, addNajieThing, sleep, addPet } from '@src/model/index';
import { getDataList } from '@src/model/DataList';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?抽(天地卡池|灵界卡池|凡界卡池)$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;
  // 有无存档
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  let tianluoRandom;
  let thing = e.MessageText.replace(/^(#|＃|\/)?/, '');

  thing = thing.replace('抽', '');
  if (thing === '天地卡池') {
    const x = await existNajieThing(userId, '天罗地网', '道具');

    if (!x) {
      void Send(Text('你没有【天罗地网】'));

      return false;
    }
    await addNajieThing(userId, '天罗地网', '道具', -1);
  } else if (thing === '灵界卡池') {
    const x = await existNajieThing(userId, '金丝仙网', '道具');

    if (!x) {
      void Send(Text('你没有【金丝仙网】'));

      return false;
    }
    await addNajieThing(userId, '金丝仙网', '道具', -1);
  } else if (thing === '凡界卡池') {
    const x = await existNajieThing(userId, '银丝仙网', '道具');

    if (!x) {
      void Send(Text('你没有【银丝仙网】'));

      return false;
    }
    await addNajieThing(userId, '银丝仙网', '道具', -1);
  }
  const changzhuxianchonData = await getDataList('Changzhuxianchon');

  tianluoRandom = Math.floor(Math.random() * changzhuxianchonData.length);
  tianluoRandom = (Math.ceil((tianluoRandom + 1) / 5) - 1) * 5;
  void Send(Text('一道金光从天而降'));
  await sleep(5000);
  void Send(Text('金光掉落在地上，走近一看是【' + changzhuxianchonData[tianluoRandom].品级 + '】' + changzhuxianchonData[tianluoRandom].name));
  await addPet(userId, changzhuxianchonData[tianluoRandom].name, 1);
  void Send(Text('恭喜获得' + changzhuxianchonData[tianluoRandom].name));
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
