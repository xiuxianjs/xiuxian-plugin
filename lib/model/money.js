import { getIoRedis } from '@alemonjs/db';

const GAME_KEY = 'xiuxian@1.3.0:system:money_game';
const openMoneySystem = async (isBig, inputMoney) => {
    const redis = getIoRedis();
    const totalMoney = await redis.get(GAME_KEY);
    const mustCoseResult = async () => {
        const redis = getIoRedis();
        if (isBig) {
            const randomNumber = Math.floor(Math.random() * 3) + 1;
            await redis.set(GAME_KEY, (totalMoney ? Number(totalMoney) : 0) + inputMoney);
            return [false, randomNumber];
        }
        const randomNumber = Math.floor(Math.random() * 3) + 4;
        await redis.set(GAME_KEY, (totalMoney ? Number(totalMoney) : 0) + inputMoney);
        return [false, randomNumber];
    };
    const randomResult = async () => {
        const randomNumber = Math.floor(Math.random() * 6) + 1;
        const isWin = (isBig && randomNumber > 3) || (!isBig && randomNumber < 4);
        const redis = getIoRedis();
        await redis.set(GAME_KEY, (totalMoney ? Number(totalMoney) : 0) + (isWin ? -inputMoney : inputMoney));
        return [isWin, randomNumber];
    };
    const minMoney = (Math.floor(Math.random() * 10000) + 10000) * 30000;
    const isMustWin = inputMoney > minMoney;
    if (totalMoney === null || totalMoney === undefined) {
        if (isMustWin)
            return await mustCoseResult();
        return await randomResult();
    }
    const currentMoney = Number(totalMoney);
    if (currentMoney < inputMoney) {
        if (isMustWin)
            return await mustCoseResult();
        return await randomResult();
    }
    return await randomResult();
};

export { openMoneySystem };
