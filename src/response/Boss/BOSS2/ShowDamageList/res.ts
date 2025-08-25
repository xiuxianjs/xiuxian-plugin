import { Image, Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { existplayer, sortBy } from '@src/model/index';
import { BossIsAlive, SortPlayer } from '../../../../model/boss';

import { selects } from '@src/response/mw';
import { KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/constants';
import { screenshot } from '@src/image';
export const regular = /^(#|＃|\/)?金角大王贡献榜$/;

interface WorldBossStatus {
  Reward?: number;
  Health?: number;
}
interface PlayerRecordData {
  QQ: Array<string | number>;
  TotalDamage: number[];
  Name: string[];
}
function parseJson<T> (raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const user_qq = e.UserId; //用户qq
  //有无存档
  if (!(await existplayer(user_qq))) return false;

  if (!(await BossIsAlive())) {
    Send(Text('金角大王未开启！'));
    return false;
  }
  const PlayerRecord = parseJson<PlayerRecordData>(await redis.get(KEY_RECORD_TWO));
  const WorldBossStatusStr = parseJson<WorldBossStatus>(await redis.get(KEY_WORLD_BOOS_STATUS_TWO));
  if (!PlayerRecord || !Array.isArray(PlayerRecord.Name)) {
    Send(Text('还没人挑战过金角大王'));
    return false;
  }
  const PlayerList = await SortPlayer(PlayerRecord);
  if (!Array.isArray(PlayerList) || PlayerList.length === 0) {
    Send(Text('还没人挑战过金角大王'));
    return false;
  }
  let TotalDamage = 0;
  const limit = Math.min(PlayerList.length, 20);
  for (let i = 0; i < limit; i++) {
    const idx = PlayerList[i];
    TotalDamage += PlayerRecord.TotalDamage[idx] || 0;
  }
  if (TotalDamage <= 0) TotalDamage = 1;
  const rewardBase = WorldBossStatusStr?.Reward || 0;
  const bossDead = (WorldBossStatusStr?.Health || 0) === 0;
  let CurrentQQ: number | undefined;

  const temp = [];

  for (let i = 0; i < PlayerList.length && i < 20; i++) {
    const idx = PlayerList[i];
    const dmg = PlayerRecord.TotalDamage[idx] || 0;
    let Reward = Math.trunc((dmg / TotalDamage) * rewardBase);
    if (Reward < 200000) Reward = 200000;

    temp[i] = {
      power: dmg,
      qq: PlayerRecord.QQ[idx],
      name: PlayerRecord.Name[idx],
      sub: [
        {
          label: bossDead ? '已得到灵石' : '预计得到灵石',
          value: Reward
        }
      ],
      level_id: 0
    };

    if (PlayerRecord.QQ[idx] == e.UserId) CurrentQQ = i + 1;
  }

  if (CurrentQQ) {
    const idx = PlayerList[CurrentQQ - 1];
    Send(
      Text(
        `你在金角大王周本贡献排行榜中排名第${CurrentQQ}，造成伤害${
          PlayerRecord.TotalDamage[idx] || 0
        }，再接再厉！`
      )
    );
  }

  //根据力量排序
  temp.sort(sortBy('power'));

  //取前10名
  const top = temp.slice(0, 10);
  const image = await screenshot('immortal_genius', user_qq, {
    allplayer: top,
    title: '金角大王贡献榜',
    label: '伤害'
  });

  if (Buffer.isBuffer(image)) {
    Send(Image(image));
    return;
  }

  Send(Text('图片生产失败'));

  return;
});
import mw from '@src/response/mw';
export default onResponse(selects, [mw.current, res.current]);
