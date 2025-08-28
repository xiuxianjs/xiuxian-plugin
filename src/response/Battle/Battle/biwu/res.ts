import { Image, Text, useMention, useSend } from 'alemonjs';
import { existplayer, keys, redis, zdBattle } from '@src/model/index';
import type { Player } from '@src/types';
import { getAvatar } from '@src/model/utils/utilsx.js';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { screenshot } from '@src/image';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export const regular = /^(#|＃|\/)?以武会友$/;
function extractFaQiu(lg): number | undefined {
  if (!lg || typeof lg !== 'object') {
    return undefined;
  }
  const o = lg;
  const v = o.法球倍率;

  return typeof v === 'number' ? v : undefined;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const A = e.UserId;

  if (!(await existplayer(A))) {
    return false;
  }
  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) {
    return false;
  }
  const B = target.UserId;

  if (A === B) {
    void Send(Text('你还跟自己修炼上了是不是?'));

    return false;
  }
  const ext = await redis.exists(keys.player(A));

  if (ext < 1) {
    void Send(Text('修仙者不可对凡人出手!'));

    return false;
  }
  const player = await getDataJSONParseByKey(keys.player(A));

  if (!player) {
    void Send(Text('你的数据不存在'));

    return;
  }

  const playerB = await getDataJSONParseByKey(keys.player(B));

  if (!playerB) {
    void Send(Text('对方数据不存在'));

    return;
  }

  const playerA: Player = player;
  const playerB: Player = playerB;

  // 复制（避免副作用）
  const a = { ...playerA };
  const b = { ...playerB };

  if (a.灵根) {
    const v = extractFaQiu(a.灵根);

    if (v !== undefined) {
      a.法球倍率 = v;
    }
  }
  if (b.灵根) {
    const v = extractFaQiu(b.灵根);

    if (v !== undefined) {
      b.法球倍率 = v;
    }
  }
  a.当前血量 = a.血量上限;
  b.当前血量 = b.血量上限;

  try {
    const dataBattle = await zdBattle(a, b);

    const header = `${playerA.名号}向${playerB.名号}发起了切磋。\n`;

    const winA = `${playerA.名号}击败了${playerB.名号}`;
    const winB = `${playerB.名号}击败了${playerA.名号}`;

    const img = await screenshot('CombatResult', A, {
      msg: [header, ...(dataBattle.msg || [])],
      playerA: {
        id: A,
        name: playerA.名号,
        avatar: getAvatar(A),
        power: playerA.战力,
        hp: playerA.当前血量,
        maxHp: playerA.血量上限
      },
      playerB: {
        id: B,
        name: playerB.名号,
        avatar: getAvatar(B),
        power: playerB.战力,
        hp: playerB.当前血量,
        maxHp: playerB.血量上限
      },
      result: dataBattle.msg.includes(winA) ? 'A' : dataBattle.msg.includes(winB) ? 'B' : 'draw'
    });

    if (Buffer.isBuffer(img)) {
      void Send(Image(img));
    } else {
      const result = dataBattle.msg.includes(winA)
        ? 'A'
        : dataBattle.msg.includes(winB)
          ? 'B'
          : 'draw';

      void Send(Text(header + result));
    }
  } catch (_err) {
    void Send(Text('战斗过程出现异常'));
  }

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
