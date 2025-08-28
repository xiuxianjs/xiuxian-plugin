import { screenshot } from '@src/image';
import { redis } from '@src/model/api';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { getDataList } from '@src/model/DataList';
import { __PATH, shijianc, readPlayer } from '@src/model/index';
import { getRedisKey, keys, keysByPath } from '@src/model/keys';
import type { Player, TalentInfo } from '@src/types';

// 榜单条目类型（简化，只列出必需字段，允许附加动态属性）
export interface TiandibangRow {
  名号: string;
  境界: number;
  攻击: number;
  防御: number;
  当前血量: number;
  暴击率: number;
  灵根: TalentInfo | Record<string, unknown>;
  法球倍率?: number | string;
  学习的功法;
  魔道值: number;
  神石: number;
  qq: string;
  次数: number;
  积分: number;
}

export async function writeTiandibang(wupin: TiandibangRow[]) {
  await setDataJSONStringifyByKey(keys.tiandibang('tiandibang'), wupin);
}

export async function readTiandibang() {
  const data = await getDataJSONParseByKey(keys.tiandibang('tiandibang'));

  return data ?? [];
}

export async function getLastbisai(usrId: string | number) {
  const timeStr = await redis.get(getRedisKey(String(usrId), 'lastbisai_time'));

  if (timeStr !== null) {
    const details = shijianc(parseInt(timeStr, 10));

    return details;
  }

  return false;
}

export async function getTianditangImage(e, jifen) {
  const userId = e.UserId;
  const player = await readPlayer(userId);
  const commodities_list = await getDataList('Tianditang');
  const tianditang_data = {
    name: player.名号,
    jifen,
    commodities_list: commodities_list
  };

  const img = await screenshot('tianditang', e.UserId, tianditang_data);

  return img;
}

export async function reBangdang() {
  const playerList = await keysByPath(__PATH.player_path);
  const temp: TiandibangRow[] = [];

  for (let k = 0; k < playerList.length; k++) {
    const thisQqStr = playerList[k];
    const player = await readPlayer(thisQqStr);
    const levelList = await getDataList('Level1');
    const level_id = levelList.find(item => item.level_id === player.level_id)?.level_id;

    if (level_id === null) {
      continue;
    }
    temp.push({
      名号: player.名号,
      境界: level_id,
      攻击: player.攻击,
      防御: player.防御,
      当前血量: player.血量上限,
      暴击率: player.暴击率,
      灵根: player.灵根,
      法球倍率: player.灵根.法球倍率,
      学习的功法: player.学习的功法,
      魔道值: (player as Player & { 魔道值?: number }).魔道值 ?? 0,
      神石: (player as Player & { 神石?: number }).神石 ?? 0,
      qq: thisQqStr,
      次数: 3,
      积分: 0
    });
  }
  // 按积分排序（冒泡替换为内置排序）
  temp.sort((a, b) => b.积分 - a.积分);
  await writeTiandibang(temp);

  return false;
}
