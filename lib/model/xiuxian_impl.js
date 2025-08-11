import data from './XiuxianData.js';
import { __PATH } from './paths.js';
import { getIoRedis } from '@alemonjs/db';
import { createPlayerRepository } from './repository/playerRepository.js';
import { createNajieRepository } from './repository/najieRepository.js';
export { writePlayer } from './pub.js';

const redis = getIoRedis();
const playerRepo = createPlayerRepository(() => data.occupation_exp_list);
const najieRepo = createNajieRepository();
async function getPlayerDataSafe(usr_qq) {
    const playerData = await data.getData('player', usr_qq);
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
    const res = await redis.exists(`${__PATH.player_path}:${usr_qq}`);
    return res === 1;
}
async function readPlayer(usr_qq) {
    const player = await redis.get(`${__PATH.player_path}:${usr_qq}`);
    if (!player)
        return null;
    const playerData = JSON.parse(decodeURIComponent(player));
    return playerData;
}
async function readNajie(usr_qq) {
    const raw = await redis.get(`${__PATH.najie_path}:${usr_qq}`);
    if (!raw)
        return null;
    return JSON.parse(raw);
}
async function Write_najie(usr_qq, najie) {
    await redis.set(`${__PATH.najie_path}:${usr_qq}`, JSON.stringify(najie));
}
async function addExp4(usr_qq, exp = 0) {
    if (exp === 0)
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

export { Write_najie, addBagCoin, addConFaByUser, addExp4, existplayer, getEquipmentDataSafe, getPlayerDataSafe, readNajie, readPlayer };
