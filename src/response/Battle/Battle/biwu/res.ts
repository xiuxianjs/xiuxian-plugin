import { Image, Text, useMention, useSend } from 'alemonjs';
import { existplayer, keys, redis, zdBattle } from '@src/model/index';
import type { Player } from '@src/types';
import { getAvatar } from '@src/model/utils/utilsx.js';
import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { screenshot } from '@src/image';
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
    Send(Text('你还跟自己修炼上了是不是?'));

    return false;
  }
  const ext = await redis.exists(keys.player(A));

  if (ext < 1) {
    Send(Text('修仙者不可对凡人出手!'));

    return false;
  }
  const dataA = await redis.get(keys.player(A));

  if (!dataA) {
    Send(Text('你的数据不存在'));

    return;
  }
  const dataB = await redis.get(keys.player(B));

  if (!dataB) {
    Send(Text('对方数据不存在'));

    return;
  }
  let A_player: Player;
  let B_player: Player;

  try {
    A_player = JSON.parse(dataA);
    B_player = JSON.parse(dataB);
  } catch (_err) {
    Send(Text('数据解析错误'));

    return;
  }
  // 复制（避免副作用）
  const a = { ...A_player };
  const b = { ...B_player };

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
    const Data_battle = await zdBattle(a, b);

    const header = `${A_player.名号}向${B_player.名号}发起了切磋。\n`;

    const A_win = `${A_player.名号}击败了${B_player.名号}`;
    const B_win = `${B_player.名号}击败了${A_player.名号}`;

    const img = await screenshot('CombatResult', A, {
      msg: [header, ...(Data_battle.msg || [])],
      playerA: {
        id: A,
        name: A_player.名号,
        avatar: getAvatar(A),
        power: A_player.战力,
        hp: A_player.当前血量,
        maxHp: A_player.血量上限
      },
      playerB: {
        id: B,
        name: B_player.名号,
        avatar: getAvatar(B),
        power: B_player.战力,
        hp: B_player.当前血量,
        maxHp: B_player.血量上限
      },
      result: Data_battle.msg.includes(A_win) ? 'A' : Data_battle.msg.includes(B_win) ? 'B' : 'draw'
    });

    if (Buffer.isBuffer(img)) {
      Send(Image(img));
    } else {
      const result = Data_battle.msg.includes(A_win)
        ? 'A'
        : Data_battle.msg.includes(B_win)
          ? 'B'
          : 'draw';

      Send(Text(header + result));
    }
  } catch (_err) {
    Send(Text('战斗过程出现异常'));
  }

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
