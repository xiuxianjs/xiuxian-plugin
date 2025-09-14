import { Image, Text, useSend } from 'alemonjs';
import { existplayer, sortBy } from '@src/model/index';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { bossStatus, isBossWord2, SortPlayer } from '../../../../model/boss';
import { KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS_TWO } from '@src/model/keys';
import { screenshot } from '@src/image';
import mw from '@src/response/mw-captcha';

const selects = onSelects(['message.create']);

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

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    void Send(Text('你还未开始修仙'));

    return false;
  }

  if (!(await isBossWord2())) {
    void Send(Text('金角大王未刷新'));

    return;
  }

  const bossStatusResult = await bossStatus('2');

  if (bossStatusResult === 'dead') {
    void Send(Text('金角大王已经被击败了，请等待下次刷新'));

    return;
  } else if (bossStatusResult === 'initializing') {
    void Send(Text('金角大王正在初始化，请稍后'));

    return;
  }

  const playerRecord = (await getDataJSONParseByKey(KEY_RECORD_TWO)) as PlayerRecordData;
  const worldBossStatus = (await getDataJSONParseByKey(KEY_WORLD_BOOS_STATUS_TWO)) as WorldBossStatus;

  if (!playerRecord || !Array.isArray(playerRecord.Name)) {
    void Send(Text('还没人挑战过金角大王'));

    return false;
  }

  const playerList = SortPlayer(playerRecord);

  if (!Array.isArray(playerList) || playerList.length === 0) {
    void Send(Text('还没人挑战过金角大王'));

    return false;
  }

  let totalDamage = 0;
  const limit = Math.min(playerList.length, 20);

  for (let i = 0; i < limit; i++) {
    const idx = playerList[i];

    totalDamage += playerRecord.TotalDamage[idx] || 0;
  }

  if (totalDamage <= 0) {
    totalDamage = 1;
  }

  const rewardBase = worldBossStatus?.Reward ?? 0;
  const bossDead = (worldBossStatus?.Health ?? 0) === 0;
  let currentQq: number | undefined;

  const temp: any[] = [];

  for (let i = 0; i < playerList.length && i < 20; i++) {
    const idx = playerList[i];
    const dmg = playerRecord.TotalDamage[idx] || 0;
    let reward = Math.trunc((dmg / totalDamage) * rewardBase);

    if (reward < 200000) {
      reward = 200000;
    }

    temp[i] = {
      power: dmg,
      qq: playerRecord.QQ[idx],
      name: playerRecord.Name[idx],
      sub: [
        {
          label: bossDead ? '已得到灵石' : '预计得到灵石',
          value: reward
        }
      ],
      level_id: 0
    };

    if (playerRecord.QQ[idx] === userId) {
      currentQq = i + 1;
    }
  }

  if (currentQq) {
    const idx = playerList[currentQq - 1];

    void Send(Text(`你在金角大王周本贡献排行榜中排名第${currentQq}，造成伤害${playerRecord.TotalDamage[idx] || 0}，再接再厉！`));
  }

  // 根据力量排序
  temp.sort(sortBy('power'));

  // 取前10名
  const top = temp.slice(0, 10);
  const image = await screenshot('immortal_genius', userId, {
    allplayer: top,
    title: '金角大王贡献榜',
    label: '伤害'
  });

  if (Buffer.isBuffer(image)) {
    void Send(Image(image));

    return false;
  }

  void Send(Text('图片生产失败'));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
