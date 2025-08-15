import { randomInt } from 'crypto';
import { getIoRedis } from '@alemonjs/db';
import { GAME_KEY } from './settions.js';

function buildRiskProfile(inputMoney) {
    const minMoney = (Math.floor(Math.random() * 10000) + 10000) * 30000;
    return { forceLose: inputMoney > minMoney };
}
async function openMoneySystem(isBig, inputMoney) {
    inputMoney = Math.max(0, Math.trunc(inputMoney));
    const redis = getIoRedis();
    const totalMoneyRaw = await redis.get(GAME_KEY);
    const totalMoney = totalMoneyRaw ? Number(totalMoneyRaw) : 0;
    const risk = buildRiskProfile(inputMoney);
    if (risk.forceLose) {
        const dice = isBig ? randomInt(1, 4) : randomInt(4, 7);
        await redis.set(GAME_KEY, String(totalMoney + inputMoney));
        return { win: false, dice };
    }
    const dice = randomInt(1, 7);
    const win = (isBig && dice > 3) || (!isBig && dice < 4);
    const next = totalMoney + (win ? -inputMoney : inputMoney);
    await redis.set(GAME_KEY, String(next));
    return { win, dice };
}
var money = { openMoneySystem };

export { money as default, openMoneySystem };
