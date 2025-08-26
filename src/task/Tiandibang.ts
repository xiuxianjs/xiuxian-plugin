import { writeTiandibang } from '@src/model/tian';
import { __PATH, keys, keysByPath } from '@src/model/keys';
import type { TiandibangRankEntry as RankEntry } from '@src/types';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey } from '@src/model/DataControl';

/**
 * 遍历所有玩家，读取玩家的属性（如名号、境界、攻击、防御、血量、暴击率、灵根、功法、魔道值、神石等）。
构建排行榜条目（RankEntry），将所有玩家信息收集到一个数组中。
对排行榜条目按积分字段进行排序（积分高的排前）。
调用 writeTiandibang 方法，将排行榜数据写入存储或展示。
总结：生成“天帝榜”排行榜，展示玩家的综合实力排名，实现排行榜的自动刷新和维护。
 * @returns
 */
export const TiandibangTask = async () => {
  const playerList = await keysByPath(__PATH.player_path);
  const temp: RankEntry[] = [];
  let t: RankEntry | undefined;
  let k: number;

  await Promise.all(
    playerList.map(async user_qq => {
      const player = await getDataJSONParseByKey(keys.player(user_qq));

      if (!player) {
        return;
      }

      const levelList = await getDataList('Level1');
      const level = levelList.find(item => item.level_id == player.level_id);

      if (!level) {
        return;
      }
      const level_id = level?.level_id;

      temp[k] = {
        名号: player.名号,
        境界: level_id,
        攻击: player.攻击,
        防御: player.防御,
        当前血量: player.血量上限,
        暴击率: player.暴击率,
        灵根: player.灵根,
        法球倍率: player.灵根.法球倍率,
        学习的功法: player.学习的功法,
        魔道值: player.魔道值,
        神石: player.神石,
        qq: user_qq,
        次数: 3,
        积分: 0
      };
      k++;
    })
  );
  for (let i = 0; i < playerList.length - 1; i++) {
    let count = 0;

    for (let j = 0; j < playerList.length - i - 1; j++) {
      if (temp[j].积分 < temp[j + 1].积分) {
        t = temp[j];
        temp[j] = temp[j + 1];
        temp[j + 1] = t;
        count = 1;
      }
    }
    if (count == 0) {
      break;
    }
  }
  await writeTiandibang(temp);

  return false;
};
