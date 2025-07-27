import { redis } from '../api/api.js';

const GAME_KEY = 'xiuxian@1.3.0:system:money_game';
const openMoneySystem = async (isBig, inputMoney) => {
    const totalMoney = await redis.get(GAME_KEY);
    const mustCoseResult = async () => {
        if (isBig) {
            const randomNumber = Math.floor(Math.random() * 3) + 1;
            await redis.set(GAME_KEY, (totalMoney ? Number(totalMoney) : 0) + inputMoney);
            return [false, randomNumber];
        }
        const randomNumber = Math.floor(Math.random() * 3) + 4;
        await redis.set(GAME_KEY, (totalMoney ? Number(totalMoney) : 0) + inputMoney);
        return [false, randomNumber];
    };
    const mustWinResult = async () => {
        if (isBig) {
            const randomNumber = Math.floor(Math.random() * 3) + 4;
            await redis.set(GAME_KEY, (totalMoney ? Number(totalMoney) : 0) - inputMoney);
            return [true, randomNumber];
        }
        const randomNumber = Math.floor(Math.random() * 3) + 1;
        await redis.set(GAME_KEY, (totalMoney ? Number(totalMoney) : 0) - inputMoney);
        return [true, randomNumber];
    };
    const randomResult = async () => {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        const isWin = (isBig && randomNumber > 3) || (!isBig && randomNumber < 4);
        await redis.set(GAME_KEY, (totalMoney ? Number(totalMoney) : 0) + (isWin ? -inputMoney : inputMoney));
        return [isWin, randomNumber];
    };
    const isMustWin = inputMoney > (Math.floor(Math.random() * 51) + 50) * 1000 * 100;
    if (totalMoney === null || totalMoney === undefined) {
        if (isMustWin)
            return await mustCoseResult();
        return await randomResult();
    }
    const maxMoney = (Math.floor(Math.random() * 501) + 500) * 10000;
    const currentMoney = Number(totalMoney);
    if (currentMoney < inputMoney) {
        const isMustWinMin = inputMoney > (Math.floor(Math.random() * 20) + 20) * 1000 * 10;
        if (currentMoney < -maxMoney && isMustWinMin)
            return await mustWinResult();
        if (isMustWin)
            return await mustCoseResult();
        return await randomResult();
    }
    if (maxMoney < currentMoney) {
        if (isMustWin)
            return await mustCoseResult();
        return await mustWinResult();
    }
    return await randomResult();
};

export { openMoneySystem };
