import { readPlayer } from './xiuxian_impl.js';
import { playerRepo } from './utils/safe.js';

async function addCoin(userId, delta) {
    delta = Math.trunc(delta);
    if (!delta)
        return;
    const val = await playerRepo.atomicAdjust(userId, '灵石', delta);
    return val ?? (await readPlayer(userId))?.灵石;
}
async function addHP(userId, delta) {
    delta = Math.trunc(delta);
    if (!delta)
        return;
    await playerRepo.atomicAdjust(userId, '当前血量', delta);
    const player = (await readPlayer(userId));
    if (!player)
        return;
    if (player.当前血量 > player.血量上限)
        player.当前血量 = player.血量上限;
    if (player.当前血量 < 0)
        player.当前血量 = 0;
    await playerRepo.setObject(userId, player);
    return player.当前血量;
}
async function addExp(userId, delta) {
    delta = Math.trunc(delta);
    if (!delta)
        return;
    const val = await playerRepo.atomicAdjust(userId, '修为', delta);
    return val ?? (await readPlayer(userId))?.修为;
}
async function addExp2(userId, delta) {
    delta = Math.trunc(delta);
    if (!delta)
        return;
    const val = await playerRepo.atomicAdjust(userId, '血气', delta);
    return val ?? (await readPlayer(userId))?.血气;
}
async function addExp3(userId, delta) {
    delta = Math.trunc(delta);
    if (!delta)
        return;
    const val = await playerRepo.atomicAdjust(userId, '魔道值', delta);
    return val ?? (await readPlayer(userId))?.魔道值;
}
var economy = { addCoin, addHP, addExp, addExp2, addExp3 };

export { addCoin, addExp, addExp2, addExp3, addHP, economy as default };
