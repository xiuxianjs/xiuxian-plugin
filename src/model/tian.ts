import { screenshot } from '@src/image';
import { redis } from '@src/model/api';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { getDataList } from '@src/model/DataList';
import { __PATH, shijianc, readPlayer } from '@src/model/index';
import { getRedisKey, keys } from '@src/model/keys';
import type { TiandibangRow } from '@src/types';

/**
 *
 * @param wupin
 */
export async function writeTiandibang(wupin: TiandibangRow[]) {
  await setDataJSONStringifyByKey(keys.tiandibang('tiandibang'), wupin);
}

/**
 *
 * @returns
 */
export async function readTiandibang() {
  const data: any[] | null = await getDataJSONParseByKey(keys.tiandibang('tiandibang'));

  return data ?? [];
}

/**
 *
 * @param usrId
 * @returns
 */
export async function getLastbisai(usrId: string | number) {
  const timeStr = await redis.get(getRedisKey(String(usrId), 'lastbisai_time'));

  if (timeStr !== null) {
    const details = shijianc(parseInt(timeStr, 10));

    return details;
  }

  return false;
}

/**
 *
 * @param e
 * @param jifen
 * @returns
 */
export async function getTianditangImage(e, jifen) {
  const userId = e.UserId;
  const player = await readPlayer(userId);

  if (!player) {
    return;
  }

  //
  const commoditiesList = await getDataList('Tianditang');

  const img = await screenshot('tianditang', e.UserId, {
    name: player.名号,
    jifen,
    commodities_list: commoditiesList
  });

  return img;
}
