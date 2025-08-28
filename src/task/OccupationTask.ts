import { notUndAndNull } from '@src/model/common';
import { readPlayer } from '@src/model/xiuxian_impl';
import { __PATH, keysByPath } from '@src/model/keys';
import { getDataByUserId, setDataByUserId } from '@src/model/Redis';
import { safeParse } from '@src/model/utils/safe';
import type { ActionState } from '@src/types';
import { mine_jiesuan, plant_jiesuan, calcEffectiveMinutes } from '@src/response/Occupation/api';

/**
 * 遍历所有玩家，检查每个玩家的当前动作（如闭关、采集等）。
判断动作是否为闭关（plant === '0'），并在动作结束后进行结算：
计算并发放经验值。
根据玩家等级和职业等级，计算采集草药的数量并发放到纳戒。
通过推送消息通知玩家或群组结算结果。
 */
export const OccupationTask = async () => {
  const playerList = await keysByPath(__PATH.player_path);

  for (const playerId of playerList) {
    // 得到动作
    const actionRaw = await getDataByUserId(playerId, 'action');
    const action = safeParse<ActionState | null>(actionRaw, null);

    // 不为空，存在动作
    if (!action) {
      continue;
    }

    let push_address: string | undefined; // 消息推送地址

    if ('group_id' in action && notUndAndNull(action.group_id)) {
      push_address = action.group_id;
    }

    // 动作结束时间（预处理提前量）
    const now_time = Date.now();

    // 闭关状态结算
    if (action.plant === '0') {
      const end_time = action.end_time - 60000 * 2; // 提前 2 分钟

      if (now_time > end_time) {
        // 若已结算，跳过
        if (action.is_jiesuan === 1) {
          continue;
        }

        // 计算开始时间和有效时间（使用统一的时间槽计算逻辑）
        const start_time = action.end_time - Number(action.time);
        const now = Date.now();
        const timeMin = calcEffectiveMinutes(start_time, action.end_time, now);

        // 使用统一的采药结算函数
        await plant_jiesuan(playerId, timeMin, push_address);

        // 状态复位
        const arr = { ...action };

        // 设为已结算
        arr.is_jiesuan = 1;
        arr.plant = 1;
        arr.shutup = 1;
        arr.working = 1;
        arr.power_up = 1;
        arr.Place_action = 1;
        arr.Place_actionplus = 1;
        delete (arr as Partial<ActionState>).group_id;
        await setDataByUserId(playerId, 'action', JSON.stringify(arr));
      }
    }

    // 采矿状态结算
    if (action.mine === '0') {
      const end_time = action.end_time - 60000 * 2;

      if (now_time > end_time) {
        const playerRaw = await readPlayer(playerId);

        if (!playerRaw || Array.isArray(playerRaw)) {
          continue;
        }
        const player = playerRaw;

        if (!notUndAndNull(player.level_id)) {
          continue;
        }
        const rawTime2
          = typeof action.time === 'string' ? parseInt(action.time) : Number(action.time);
        const timeMin = (isNaN(rawTime2) ? 0 : rawTime2) / 1000 / 60;

        await mine_jiesuan(playerId, timeMin, push_address);

        // const mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * timeMin)
        // const occRow = data.occupation_exp_list.find(
        //   (o: { id: number; name: string; experience: number }) =>
        //     o.id === player.occupation_level
        // )
        // // 原代码使用 occRow.rate，不存在该字段，改为基于 experience 推导一个倍率（示例：experience / 1000）
        // const rateBase = occRow ? occRow.experience / 1000 : 0
        // const rate = rateBase * 10
        // const exp = timeMin * 10
        // const ext = `你是采矿师，获得采矿经验${exp}，额外获得矿石${Math.floor(rate * 100)}%，`
        // let end_amount = Math.floor(4 * (rate + 1) * mine_amount1)
        // const num = Math.floor(((rate / 12) * timeMin) / 30)
        // const A = [
        //   '金色石胚',
        //   '棕色石胚',
        //   '绿色石胚',
        //   '红色石胚',
        //   '蓝色石胚',
        //   '金色石料',
        //   '棕色石料',
        //   '绿色石料',
        //   '红色石料',
        //   '蓝色石料'
        // ] as const
        // const B = [
        //   '金色妖石',
        //   '棕色妖石',
        //   '绿色妖石',
        //   '红色妖石',
        //   '蓝色妖石',
        //   '金色妖丹',
        //   '棕色妖丹',
        //   '绿色妖丹',
        //   '红色妖丹',
        //   '蓝色妖丹'
        // ] as const
        // const xuanze = Math.trunc(Math.random() * A.length)
        // end_amount = Math.floor(end_amount * (player.level_id / 40))
        // await addNajieThing(playerId, '庚金', '材料', end_amount)
        // await addNajieThing(playerId, '玄土', '材料', end_amount)
        // await addNajieThing(playerId, A[xuanze], '材料', num)
        // await addNajieThing(playerId, B[xuanze], '材料', Math.trunc(num / 48))
        // await addExp4(playerId, exp)
        // msg.push(
        //   `\n采矿归来，${ext}\n收获庚金×${end_amount}\n玄土×${end_amount}`
        // )
        // msg.push(`\n${A[xuanze]}x${num}\n${B[xuanze]}x${Math.trunc(num / 48)}`)
        // 状态复位
        const arr = { ...action };

        arr.mine = 1;
        arr.shutup = 1;
        arr.working = 1;
        arr.power_up = 1;
        arr.Place_action = 1;
        arr.Place_actionplus = 1;
        delete (arr as Partial<ActionState>).group_id;
        await setDataByUserId(playerId, 'action', JSON.stringify(arr));
        // if (isGroup && push_address) {
        //   pushInfo(push_address, isGroup, msg)
        // } else {
        //   pushInfo(playerId, isGroup, msg)
        // }
      }
    }
  }
};
