import { randomInt } from 'crypto';
import { getIoRedis } from '@alemonjs/db';
import type { DiceGameResult, RiskProfile } from '../types/model';
import { GAME_KEY } from './constants';

function buildRiskProfile(inputMoney: number): RiskProfile {
  const minMoney = (Math.floor(Math.random() * 10000) + 10000) * 30000;

  return { forceLose: inputMoney > minMoney };
}

/**
 * 骰子猜大小游戏（带简单风控）
 * @param isBig 是否押大 (true:4~6)
 * @param inputMoney 下注金额（正数）
 */
export async function openMoneySystem(isBig: boolean, inputMoney: number): Promise<DiceGameResult> {
  inputMoney = Math.max(0, Math.trunc(inputMoney));
  const redis = getIoRedis();
  const totalMoneyRaw = await redis.get(GAME_KEY);
  const totalMoney = totalMoneyRaw ? Number(totalMoneyRaw) : 0;
  const risk = buildRiskProfile(inputMoney);

  // 强制输：直接给相反范围点数
  if (risk.forceLose) {
    const dice = isBig ? randomInt(1, 4) : randomInt(4, 7);

    await redis.set(GAME_KEY, String(totalMoney + inputMoney));

    return { win: false, dice };
  }

  // 正常随机
  const dice = randomInt(1, 7);
  const win = (isBig && dice > 3) || (!isBig && dice < 4);
  const next = totalMoney + (win ? -inputMoney : inputMoney);

  await redis.set(GAME_KEY, String(next));

  return { win, dice };
}

export default { openMoneySystem };
