import data from './XiuxianData.js';
import { getIoRedis } from '@alemonjs/db';
import { createPlayerRepository } from './repository/playerRepository.js';
import { createNajieRepository } from './repository/najieRepository.js';
import { keys } from './keys.js';
import { getDataList } from './DataList.js';
export { writePlayer } from './pub.js';

const experienceList = (await getDataList('Occupation'));
const playerRepo = createPlayerRepository(() => experienceList);
const najieRepo = createNajieRepository();
async function getPlayerDataSafe(usr_qq) {
    const dataStr = await getIoRedis().get(keys.player(usr_qq));
    if (!dataStr)
        return null;
    const playerData = JSON.parse(dataStr);
    if (!playerData || Array.isArray(playerData)) {
        return null;
    }
    return playerData;
}
async function getEquipmentDataSafe(usr_qq) {
    const equipmentData = await data.getData('equipment', usr_qq);
    if (equipmentData === 'error' || Array.isArray(equipmentData)) {
        return null;
    }
    return equipmentData;
}
async function existplayer(usr_qq) {
    const redis = getIoRedis();
    const res = await redis.exists(keys.player(usr_qq));
    return res === 1;
}
async function readPlayer(usr_qq) {
    const redis = getIoRedis();
    const player = await redis.get(keys.player(usr_qq));
    if (!player)
        return null;
    try {
        const playerData = JSON.parse(player);
        return playerData;
    }
    catch (error) {
        logger.warn('Error parsing player data:', error);
        return null;
    }
}
async function readNajie(usr_qq) {
    const redis = getIoRedis();
    const raw = await redis.get(keys.najie(usr_qq));
    if (!raw)
        return null;
    return JSON.parse(raw);
}
async function writeNajie(usr_qq, najie) {
    const redis = getIoRedis();
    await redis.set(keys.najie(usr_qq), JSON.stringify(najie));
}
async function addExp4(usr_qq, exp = 0) {
    if (exp === 0 || isNaN(exp))
        return;
    await playerRepo.addOccupationExp(usr_qq, exp);
}
async function addConFaByUser(usr_qq, gongfa_name) {
    const player = await readPlayer(usr_qq);
    if (!player)
        return;
    if (!Array.isArray(player.学习的功法))
        player.学习的功法 = [];
    player.学习的功法.push(gongfa_name);
    await import('./pub.js').then(m => m.writePlayer(usr_qq, player));
    import('./efficiency.js')
        .then(m => m.playerEfficiency(usr_qq))
        .catch(() => { });
}
async function addBagCoin(usr_qq, lingshi) {
    const delta = Math.trunc(Number(lingshi));
    if (delta === 0)
        return;
    await najieRepo.addLingShi(usr_qq, delta);
}

export { addBagCoin, addConFaByUser, addExp4, existplayer, getEquipmentDataSafe, getPlayerDataSafe, readNajie, readPlayer, writeNajie };
