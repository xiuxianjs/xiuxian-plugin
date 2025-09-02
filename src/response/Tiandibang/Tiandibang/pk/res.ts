import { Image, Text, useSend } from 'alemonjs';

import { redis } from '@src/model/api';
import { existplayer, shijianc, existNajieThing, addNajieThing, zdBattle, addCoin } from '@src/model/index';
import { readTiandibang, writeTiandibang, getLastbisai } from '../../../../model/tian';

import { selects } from '@src/response/mw';
import mw from '@src/response/mw';
import { screenshot } from '@src/image';
export const regular = /^(#|＃|\/)?比试$/;

// === 类型与工具 ===
type RankEntry = any;

// 添加配置常量
const CONFIG = {
  MAX_SCORE: 100000, // 积分上限：10万
  MAX_LINGSHI: 1000000, // 灵石上限：100万
  BASE_SCORE_WIN_WILD: 1500, // 击败野生怪物胜利积分
  BASE_SCORE_WIN_PLAYER: 2000, // 击败玩家胜利积分
  BASE_SCORE_LOSE_WILD: 800, // 被野生怪物击败积分
  BASE_SCORE_LOSE_PLAYER: 1000, // 被玩家击败积分
  LINGSHI_MULTIPLIER_WIN_WILD: 8, // 击败野生怪物胜利灵石倍数
  LINGSHI_MULTIPLIER_LOSE_WILD: 6, // 被野生怪物击败灵石倍数
  LINGSHI_MULTIPLIER_WIN_PLAYER: 4, // 击败玩家胜利灵石倍数
  LINGSHI_MULTIPLIER_LOSE_PLAYER: 2 // 被玩家击败灵石倍数
} as const;

interface BattlePlayer {
  名号: string;
  攻击: number;
  防御: number;
  当前血量: number;
  暴击率: number;
  学习的功法: any[];
  灵根: { 法球倍率?: number; name?: string; type?: string } & Record<string, unknown>;
  血量上限: number;
  法球倍率?: number;
}
const toNum = (v, d = 0) => (typeof v === 'number' && !isNaN(v) ? v : typeof v === 'string' && !isNaN(+v) ? +v : d);

import { getRedisKey } from '@src/model/keys';
import { ActionRecord } from '@src/types';
const randomScale = () => 0.8 + 0.4 * Math.random();

function buildBattlePlayer(src: RankEntry, atkMul = 1, defMul = 1, hpMul = 1): BattlePlayer {
  const lgRaw = src.灵根;
  const linggenObj = lgRaw && typeof lgRaw === 'object' ? lgRaw : {};
  const linggen = linggenObj as {
    法球倍率?: number;
    name?: string;
    type?: string;
  } & Record<string, unknown>;

  return {
    名号: src.名号,
    攻击: Math.floor(toNum(src.攻击) * atkMul),
    防御: Math.floor(toNum(src.防御) * defMul),
    当前血量: Math.floor(toNum(src.当前血量) * hpMul),
    暴击率: toNum(src.暴击率),
    学习的功法: Array.isArray(src.学习的功法) ? src.学习的功法 : [],
    灵根: linggen,
    血量上限: Math.floor(toNum(src.当前血量) * hpMul), // 使用当前血量作为血量上限
    法球倍率: typeof src.法球倍率 === 'number' ? src.法球倍率 : toNum(src.法球倍率)
  };
}

/**
 * 优化后的结算函数，包含积分和灵石上限
 */
function settleWin(self: RankEntry, isWild: boolean, lastMsg: string[], opponentName: string, win: boolean) {
  // 计算基础积分增加
  let scoreIncrease = 0;

  if (win) {
    scoreIncrease = isWild ? CONFIG.BASE_SCORE_WIN_WILD : CONFIG.BASE_SCORE_WIN_PLAYER;
  } else {
    scoreIncrease = isWild ? CONFIG.BASE_SCORE_LOSE_WILD : CONFIG.BASE_SCORE_LOSE_PLAYER;
  }

  // 检查积分上限
  const currentScore = self.积分 || 0;
  const newScore = Math.min(currentScore + scoreIncrease, CONFIG.MAX_SCORE);
  const actualScoreIncrease = newScore - currentScore;

  // 更新积分
  self.积分 = newScore;
  self.次数 -= 1;

  // 计算灵石奖励（基于当前积分，但不超过上限）
  let lingshiMultiplier = 0;

  if (win) {
    lingshiMultiplier = isWild ? CONFIG.LINGSHI_MULTIPLIER_WIN_WILD : CONFIG.LINGSHI_MULTIPLIER_WIN_PLAYER;
  } else {
    lingshiMultiplier = isWild ? CONFIG.LINGSHI_MULTIPLIER_LOSE_WILD : CONFIG.LINGSHI_MULTIPLIER_LOSE_PLAYER;
  }

  const lingshi = Math.min(self.积分 * lingshiMultiplier, CONFIG.MAX_LINGSHI);

  // 构建消息
  const scoreMsg = actualScoreIncrease < scoreIncrease ? `积分已达上限，仅增加${actualScoreIncrease}积分` : `积分增加${actualScoreIncrease}`;

  const lingshiMsg = lingshi >= CONFIG.MAX_LINGSHI ? `灵石已达上限${CONFIG.MAX_LINGSHI}` : `获得${lingshi}灵石`;

  lastMsg.push(
    win
      ? `${self.名号}击败了[${opponentName}]，${scoreMsg}，当前积分[${self.积分}]，${lingshiMsg}`
      : `${self.名号}被[${opponentName}]打败了，${scoreMsg}，当前积分[${self.积分}]，${lingshiMsg}`
  );

  return lingshi;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);

  const userId = e.UserId;
  const ifexistplay = await existplayer(userId);

  if (!ifexistplay) {
    return false;
  }
  // 获取游戏状态
  const game_action = await redis.get(getRedisKey(userId, 'game_action'));

  // 防止继续其他娱乐行为
  if (+game_action === 1) {
    void Send(Text('修仙：游戏进行中...'));

    return false;
  }
  // 查询redis中的人物动作
  let action: ActionRecord | null = null;
  const actionStr = await redis.get(getRedisKey(userId, 'action'));

  if (actionStr) {
    try {
      action = JSON.parse(actionStr);
    } catch {}
  }
  if (action) {
    // 人物有动作查询动作结束时间
    const action_end_time = action.end_time;
    const now_time = Date.now();

    if (now_time <= action_end_time) {
      const m = Math.floor((action_end_time - now_time) / 1000 / 60);
      const s = Math.floor((action_end_time - now_time - m * 60 * 1000) / 1000);

      void Send(Text('正在' + action.action + '中,剩余时间:' + m + '分' + s + '秒'));

      return false;
    }
  }
  let tiandibang: RankEntry[] = [];

  try {
    tiandibang = await readTiandibang();
  } catch {
    // 没有表要先建立一个！
    await writeTiandibang([]);
  }
  const x = tiandibang.findIndex(item => String(item.qq) === userId);

  if (x === -1) {
    void Send(Text('请先报名!'));

    return;
  }
  const lastMessage: string[] = [];
  let atk = 1;
  let def = 1;
  let blood = 1;
  const now = new Date();
  const nowTime = now.getTime(); // 获取当前日期的时间戳
  const Today = shijianc(nowTime);
  const lastbisai_time = await getLastbisai(userId); // 获得上次签到日期

  if (!lastbisai_time) {
    await redis.set(getRedisKey(userId, 'lastbisai_time'), nowTime); // redis设置签到时间
    tiandibang[x].次数 = 3;
  }
  if (lastbisai_time && (Today.Y !== lastbisai_time.Y || Today.M !== lastbisai_time.M || Today.D !== lastbisai_time.D)) {
    await redis.set(getRedisKey(userId, 'lastbisai_time'), nowTime); // redis设置签到时间
    tiandibang[x].次数 = 3;
  }
  if (lastbisai_time && Today.Y === lastbisai_time.Y && Today.M === lastbisai_time.M && Today.D === lastbisai_time.D && tiandibang[x].次数 < 1) {
    const zbl = await existNajieThing(userId, '摘榜令', '道具');

    if (typeof zbl === 'number' && zbl > 0) {
      tiandibang[x].次数 = 1;
      await addNajieThing(userId, '摘榜令', '道具', -1);
      lastMessage.push(`${tiandibang[x].名号}使用了摘榜令\n`);
    } else {
      void Send(Text('今日挑战次数用光了,请明日再来吧'));

      return false;
    }
  }
  await writeTiandibang(tiandibang);
  let lingshi = 0;

  tiandibang = await readTiandibang();
  if (x !== 0) {
    let k;

    for (k = x - 1; k >= 0; k--) {
      if (tiandibang[x].境界 > 41) {
        break;
      } else {
        if (tiandibang[k].境界 > 41) {
          continue;
        } else {
          break;
        }
      }
    }
    let playerB: BattlePlayer;

    if (k !== -1) {
      if (tiandibang[k].攻击 / tiandibang[x].攻击 > 2) {
        atk = 2;
        def = 2;
        blood = 2;
      } else if (tiandibang[k].攻击 / tiandibang[x].攻击 > 1.6) {
        atk = 1.6;
        def = 1.6;
        blood = 1.6;
      } else if (tiandibang[k].攻击 / tiandibang[x].攻击 > 1.3) {
        atk = 1.3;
        def = 1.3;
        blood = 1.3;
      }
      playerB = buildBattlePlayer(tiandibang[k]);
    } else {
      // 如果没有找到合适的对手，创建野生怪物
      atk = randomScale();
      def = randomScale();
      blood = randomScale();
      playerB = buildBattlePlayer(tiandibang[x], atk, def, blood);
      playerB.名号 = '灵修兽';
    }
    const playerA = buildBattlePlayer(tiandibang[x], atk, def, blood);
    const dataBattle = await zdBattle(playerA, playerB);
    const msg: string[] = dataBattle.msg || [];
    const winA = `${playerA.名号}击败了${playerB.名号}`;
    const winB = `${playerB.名号}击败了${playerA.名号}`;

    if (msg.includes(winA)) {
      lingshi = settleWin(tiandibang[x], k === -1, lastMessage, playerB.名号, true);
      await writeTiandibang(tiandibang);
    } else if (msg.includes(winB)) {
      lingshi = settleWin(tiandibang[x], k === -1, lastMessage, playerB.名号, false);
      await writeTiandibang(tiandibang);
    } else {
      void Send(Text('战斗过程出错'));

      return false;
    }
    await addCoin(userId, lingshi);
    void Send(Text(lastMessage.join('\n')));
    const img = await screenshot('CombatResult', userId, {
      msg: msg,
      playerA: {
        id: playerA?.qq,
        name: playerA?.名号,
        power: playerA?.攻击,
        hp: playerA?.当前血量,
        maxHp: playerA?.血量上限
      },
      playerB: {
        id: playerB?.qq,
        name: playerB?.名号,
        power: playerB?.攻击,
        hp: playerB?.当前血量,
        maxHp: playerB?.血量上限
      },
      result: msg.includes(winA) ? 'A' : msg.includes(winB) ? 'B' : 'draw'
    });

    if (Buffer.isBuffer(img)) {
      void Send(Image(img));
    }
  } else {
    const playerA = buildBattlePlayer(tiandibang[x]);

    atk = randomScale();
    def = randomScale();
    blood = randomScale();
    const playerB = buildBattlePlayer(tiandibang[x], atk, def, blood);

    playerB.名号 = '灵修兽';
    const dataBattle = await zdBattle(playerA, playerB);
    const msg: string[] = dataBattle.msg || [];
    const winA = `${playerA.名号}击败了${playerB.名号}`;
    const winB = `${playerB.名号}击败了${playerA.名号}`;

    if (msg.includes(winA)) {
      lingshi = settleWin(tiandibang[x], true, lastMessage, playerB.名号, true);
      await writeTiandibang(tiandibang);
    } else if (msg.includes(winB)) {
      lingshi = settleWin(tiandibang[x], true, lastMessage, playerB.名号, false);
      await writeTiandibang(tiandibang);
    } else {
      void Send(Text('战斗过程出错'));

      return false;
    }

    //
    await addCoin(userId, lingshi);

    //
    void Send(Text(lastMessage.join('\n')));
    const img = await screenshot('CombatResult', userId, {
      msg: msg,
      playerA: {
        id: playerA?.qq,
        name: playerA?.名号,
        power: playerA?.攻击,
        hp: playerA?.当前血量,
        maxHp: playerA?.血量上限
      },
      playerB: {
        id: playerB?.qq,
        name: playerB?.名号,
        power: playerB?.攻击,
        hp: playerB?.当前血量,
        maxHp: playerB?.血量上限
      },
      result: msg.includes(winA) ? 'A' : msg.includes(winB) ? 'B' : 'draw'
    });

    if (Buffer.isBuffer(img)) {
      void Send(Image(img));
    }
  }
  tiandibang = await readTiandibang();
  tiandibang.sort((a, b) => b.积分 - a.积分);
  await writeTiandibang(tiandibang);
});

export default onResponse(selects, [mw.current, res.current]);
