import { Text, useSend } from 'alemonjs';

import {
  existplayer,
  looktripod,
  convert2integer,
  foundthing,
  existNajieThing,
  readMytripod,
  readTripod,
  writeDuanlu,
  addNajieThing,
  keys
} from '@src/model/index';

import { selects } from '@src/response/mw';
export const regular = /^(#|＃|\/)?熔炼.*$/;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const user_qq = e.UserId; // 用户qq

  // 有无存档
  if (!(await existplayer(user_qq))) {
    return false;
  }
  // 不开放私聊
  // （已弃用 game_action 直接 redis 检查，若需要应接入统一状态辅助工具）
  const A = await looktripod(user_qq);

  if (A !== 1) {
    void Send(Text('请先去#炼器师能力评测,再来煅炉吧'));

    return false;
  }

  const player = await getDataJSONParseByKey(keys.player(user_qq));

  if (!player) {
    return;
  }

  if (player.occupation !== '炼器师') {
    void Send(Text('切换到炼器师后再来吧,宝贝'));

    return false;
  }
  const thing = e.MessageText.replace(/^(#|＃|\/)?熔炼/, '');
  const code = thing.split('*');
  const thingName = code[0]; // 物品
  const account = code[1]; // 数量
  const parsedCount = convert2integer(account);
  const thing_acount
    = typeof parsedCount === 'number' && !Number.isNaN(parsedCount) ? parsedCount : 1;
  const wupintype = await foundthing(thingName);

  if (!wupintype || wupintype.type !== '锻造') {
    void Send(Text('凡界物品无法放入煅炉'));

    return false;
  }
  const mynumRaw = await existNajieThing(user_qq, thingName, '材料');
  const mynum = typeof mynumRaw === 'number' ? mynumRaw : 0;

  if (mynum < thing_acount) {
    void Send(Text('材料不足,无法放入'));

    return false;
  }

  // 开始放入

  const tripod = await readMytripod(user_qq);

  if (tripod.状态 === 1) {
    void Send(Text('正在炼制中,无法熔炼更多材料'));

    return false;
  }
  let num1 = 0;

  if (player.仙宠.type === '炼器') {
    num1 = Math.trunc(player.仙宠.等级 / 33);
  }
  let num = 0;

  for (const item in tripod.数量) {
    num += Number(tripod.数量[item]);
  }
  const shengyu
    = tripod.容纳量 + num1 + Math.floor(player.occupation_level / 2) - num - Number(thing_acount);

  if (num + Number(thing_acount) > tripod.容纳量 + num1 + Math.floor(player.occupation_level / 2)) {
    void Send(Text(`该煅炉当前只能容纳[${shengyu + Number(thing_acount)}]物品`));

    return false;
  }
  let newtripod = [];

  try {
    newtripod = await readTripod();
  } catch {
    await writeDuanlu([]);
  }
  for (const item of newtripod) {
    if (user_qq === item.qq) {
      item.材料.push(thingName);
      item.数量.push(thing_acount);
      await writeDuanlu(newtripod);
      await addNajieThing(user_qq, thingName, '材料', -thing_acount);
      const yongyou = num + Number(thing_acount);

      void Send(
        Text(
          `熔炼成功,当前煅炉内拥有[${yongyou}]个材料,根据您现有等级,您还可以放入[${shengyu}]个材料`
        )
      );

      return false;
    }
  }
});

import mw from '@src/response/mw';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export default onResponse(selects, [mw.current, res.current]);
