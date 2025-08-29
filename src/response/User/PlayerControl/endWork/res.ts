import { config, pushInfo } from '@src/model/api';
import { getPlayerAction, keys, keysAction, notUndAndNull, setFileValue } from '@src/model/index';
import { setDataByUserId } from '@src/model/Redis';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { Mention, DataMention } from 'alemonjs';
import type { ActionState } from '@src/types';
import { getDataList } from '@src/model/DataList';
import { delDataByKey, getDataJSONParseByKey } from '@src/model/DataControl';
export const regular = /^(#|＃|\/)?降妖归来$/;

const res = onResponse(selects, async e => {
  const rawAction = await getPlayerAction(e.UserId);

  if (!rawAction) {
    return;
  }
  const action: ActionState = rawAction as unknown as ActionState;

  if (action.action === '空闲') {
    return;
  }
  if (action.working === 1) {
    return false;
  }
  // 结算
  const end_time = action.end_time;
  const start_time = action.end_time - Number(action.time);
  const now_time = Date.now();
  let time;
  const cf = await config.getConfig('xiuxian', 'xiuxian');
  const y = cf.work.time; // 固定时间
  const x = cf.work.cycle; // 循环次数

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
    // 如果<15，不给收益
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
    // 如果<15，不给收益
    if (time < y) {
      time = 0;
    }
  }
  if (e.name === 'message.create' || e.name === 'interaction.create') {
    await dagong_jiesuan(e.UserId, time, false, e.ChannelId); // 提前闭关结束不会触发随机事件
  } else {
    await dagong_jiesuan(e.UserId, time, false); // 提前闭关结束不会触发随机事件
  }

  void delDataByKey(keysAction.action(e.UserId));

  await setDataByUserId(e.UserId, 'game_action', 0);
});

export default onResponse(selects, [mw.current, res.current]);

/**
 * 降妖结算
 * @param userId
 * @param time持续时间(单位用分钟)
 * @param isRandom是否触发随机事件  true,false
 * @param group_id  回复消息的地址，如果为空，则私聊
 * @return  falses {Promise<void>}
 */
async function dagong_jiesuan(user_id, time, isRandom, group_id?) {
  const userId = user_id;
  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  // 当前境界 id
  if (!notUndAndNull(player.level_id)) {
    return false;
  }
  const LevelList = await getDataList('Level1');
  const now_level_id = LevelList.find(item => item.level_id === player.level_id).level_id;
  const cf = await config.getConfig('xiuxian', 'xiuxian');
  const size = cf.work.size;
  const lingshi = Math.floor(size * now_level_id * (1 + player.修炼效率提升) * 0.5);
  let otherLingshi = 0; // 额外的灵石
  const Time = time;
  const msg: Array<DataMention | string> = [Mention(userId)];

  if (isRandom) {
    // 随机事件预留空间
    let rand = Math.random();

    if (rand < 0.2) {
      rand = Math.trunc(rand * 10) + 40;
      otherLingshi = rand * Time;
      msg.push('\n本次增加灵石' + rand * Time);
    } else if (rand > 0.8) {
      rand = Math.trunc(rand * 10) + 5;
      otherLingshi = -1 * rand * Time;
      msg.push('\n由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少' + rand * Time);
    }
  }
  const get_lingshi = Math.trunc(lingshi * time + otherLingshi * 1.5); // 最后获取到的灵石

  // 设置灵石
  await setFileValue(userId, get_lingshi, '灵石');

  // 给出消息提示
  if (isRandom) {
    msg.push('\n增加灵石' + get_lingshi);
  } else {
    msg.push('\n增加灵石' + get_lingshi);
  }

  if (group_id) {
    pushInfo(group_id, true, msg);
  } else {
    pushInfo(userId, false, msg);
  }

  return false;
}
