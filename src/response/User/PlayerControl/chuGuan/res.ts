import { config, pushInfo } from '@src/model/api';
import { getJSON, userKey } from '@src/model/utils/redisHelper';
import type { ActionState } from '@src/types';
import {
  notUndAndNull,
  readDanyao,
  existNajieThing,
  addNajieThing,
  addExp,
  addExp2,
  setFileValue,
  writeDanyao,
  keys
} from '@src/model/index';
import { setDataByUserId } from '@src/model/Redis';

import { selects } from '@src/response/mw';
import { DataMention, Mention } from 'alemonjs';
export const regular = /^(#|＃|\/)?出关$/;

const res = onResponse(selects, async e => {
  const action = await getPlayerAction(e.UserId);

  if (!action) {
    return;
  }
  if (action.shutup === 1) {
    return;
  }

  // 结算
  const end_time = action.end_time;
  const start_time = action.end_time - Number(action.time);
  const now_time = Date.now();
  let time;

  const cf = await config.getConfig('xiuxian', 'xiuxian');

  const y = cf.biguan.time; // 固定时间
  const x = cf.biguan.cycle; // 循环次数

  if (end_time > now_time) {
    // 属于提前结束
    time = Math.floor((Date.now() - start_time) / 1000 / 60);
    // 超过就按最低的算，即为满足30分钟才结算一次
    // 如果是 >=16*33 ----   >=30
    for (let i = x; i > 0; i--) {
      if (time >= y * i) {
        time = y * i;
        break;
      }
    }
    if (time < y) {
      time = 0;
    }
  } else {
    // 属于结束了未结算
    time = Math.floor(Number(action.time) / 1000 / 60);
    // 超过就按最低的算，即为满足30分钟才结算一次
    // 如果是 >=16*33 ----   >=30
    for (let i = x; i > 0; i--) {
      if (time >= y * i) {
        time = y * i;
        break;
      }
    }
    if (time < y) {
      time = 0;
    }
  }

  if (e.name === 'message.create' || e.name === 'interaction.create') {
    await biguanJiesuan(e.UserId, time, false, e.ChannelId); // 提前闭关结束不会触发随机事件
  } else {
    await biguanJiesuan(e.UserId, time, false); // 提前闭关结束不会触发随机事件
  }
  const arr = action;

  // 把状态都关了
  arr.shutup = 1; // 闭关状态
  arr.working = 1; // 降妖状态
  arr.power_up = 1; // 渡劫状态
  arr.Place_action = 1; // 秘境
  arr.end_time = Date.now(); // 结束的时间也修改为当前时间
  delete arr.group_id; // 结算完去除group_id
  await setDataByUserId(e.UserId, 'action', JSON.stringify(arr));
  await setDataByUserId(e.UserId, 'game_action', 0);
});

async function getPlayerAction(userId: string): Promise<ActionState | false> {
  const raw = await getJSON<ActionState>(userKey(userId, 'action'));

  if (!raw) {
    return false;
  }

  return raw;
}
/**
 * 闭关结算
 * @param userId
 * @param time持续时间(单位用分钟)
 * @param isRandom是否触发随机事件  true,false
 * @param group_id  回复消息的地址，如果为空，则私聊
 * @return  falses {Promise<void>}
 */
async function biguanJiesuan(userId, time, isRandom, group_id?) {
  await playerEfficiency(userId);
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  if (!notUndAndNull(player.level_id)) {
    return false;
  }
  const LevelList = await getDataList('Level1');
  const now_level_id = LevelList.find(item => item.level_id === player.level_id).level_id;
  // 闭关收益倍率计算 倍率*境界id*天赋*时间
  const cf = await config.getConfig('xiuxian', 'xiuxian');
  const size = cf.biguan.size;
  // 增加的修为
  const xiuwei = Math.floor(size * now_level_id * (player.修炼效率提升 + 1));
  // 恢复的血量
  const blood = Math.floor(player.血量上限 * 0.02);
  // 额外修为
  let otherEXP = 0;

  const msg: Array<DataMention | string> = [Mention(userId)];
  // 炼丹师丹药修正
  let transformation = '修为';
  let xueqi = 0;
  const dy = await readDanyao(userId);

  console.log('dy', dy);
  if (dy.biguan > 0) {
    dy.biguan--;
    if (dy.biguan === 0) {
      dy.biguanxl = 0;
    }
  }
  if (dy.lianti > 0) {
    transformation = '血气';
    dy.lianti--;
  }
  // 随机事件预留空间
  if (isRandom) {
    let rand = Math.random();

    // 顿悟
    if (rand < 0.2) {
      rand = Math.trunc(rand * 10) + 45;
      otherEXP = rand * time;
      xueqi = Math.trunc(rand * time * dy.beiyong4);
      if (transformation === '血气') {
        msg.push('\n本次闭关顿悟,受到炼神之力修正,额外增加血气:' + xueqi);
      } else {
        msg.push('\n本次闭关顿悟,额外增加修为:' + rand * time);
      }
    } else if (rand > 0.8) {
      rand = Math.trunc(rand * 10) + 5;
      otherEXP = -1 * rand * time;
      xueqi = Math.trunc(rand * time * dy.beiyong4);
      if (transformation === '血气') {
        msg.push('\n,由于你闭关时隔壁装修,导致你差点走火入魔,受到炼神之力修正,血气下降' + xueqi);
      } else {
        msg.push('\n由于你闭关时隔壁装修,导致你差点走火入魔,修为下降' + rand * time);
      }
    }
  }
  let other_x = 0;
  let qixue = 0;

  if ((await existNajieThing(userId, '魔界秘宝', '道具')) && player.魔道值 > 999) {
    other_x = Math.trunc(xiuwei * 0.15 * time);
    await addNajieThing(userId, '魔界秘宝', '道具', -1);
    msg.push('\n消耗了道具[魔界秘宝],额外增加' + other_x + '修为');
    await addExp(userId, other_x);
  }
  if (
    (await existNajieThing(userId, '神界秘宝', '道具')) &&
    player.魔道值 < 1 &&
    (player.灵根.type === '转生' || player.level_id > 41)
  ) {
    qixue = Math.trunc(xiuwei * 0.1 * time);
    await addNajieThing(userId, '神界秘宝', '道具', -1);
    msg.push('\n消耗了道具[神界秘宝],额外增加' + qixue + '血气');
    await addExp2(userId, qixue);
  }
  // 设置修为，设置血量

  await setFileValue(userId, blood * time, '当前血量');

  // 给出消息提示
  if (transformation === '血气') {
    await setFileValue(userId, (xiuwei * time + otherEXP) * dy.beiyong4, transformation); // 丹药修正
    msg.push(
      '\n受到炼神之力的影响,增加血气:' + xiuwei * time * dy.beiyong4,
      '  获得治疗,血量增加:' + blood * time
    );
  } else {
    await setFileValue(userId, xiuwei * time + otherEXP, transformation);
    if (isRandom) {
      msg.push(
        '\n增加气血:' + xiuwei * time,
        ',获得治疗,血量增加:' + blood * time + '炼神之力消散了'
      );
    } else {
      msg.push('\n增加修为:' + xiuwei * time, ',获得治疗,血量增加:' + blood * time);
    }
  }

  if (group_id) {
    pushInfo(group_id, true, msg);
  } else {
    pushInfo(userId, false, msg);
  }
  if (dy.lianti <= 0) {
    dy.lianti = 0;
    dy.beiyong4 = 0;
  }
  // 炼丹师修正结束
  // 写回当前丹药状态
  await writeDanyao(userId, dy);

  return false;
}
import mw from '@src/response/mw';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { playerEfficiency } from '@src/model';
export default onResponse(selects, [mw.current, res.current]);
