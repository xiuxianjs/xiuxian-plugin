import { readForum, writeForum } from '@src/model/trade';
import { addCoin } from '@src/model/economy';

/**
 * 读取论坛奖励记录（Forum）。
 * 检查每条记录的时间，如果已超过3天，则将灵石奖励发放给对应用户，并从记录中移除该条。
 * 最后将更新后的论坛记录写回存储。
 * @returns
 */
export const ForumTask = async () => {
  const Forum = await readForum();

  const now_time = Date.now();

  for (let i = 0; i < Forum.length; i++) {
    const time = (now_time - Forum[i].now_time) / 24 / 60 / 60 / 1000;

    if (time < 3) {
      break;
    }
    const userId = Forum[i].qq;
    const lingshi = Forum[i].whole;

    await addCoin(userId, lingshi);
    Forum.splice(i, 1);
    i--;
  }

  await writeForum(Forum);

  return false;
};
