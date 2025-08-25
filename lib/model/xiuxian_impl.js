import { getIoRedis } from '@alemonjs/db';
import { createPlayerRepository } from './repository/playerRepository.js';
import { createNajieRepository } from './repository/najieRepository.js';
import { keys } from './keys.js';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';
export { writePlayer } from './pub.js';

const experienceList = (await getDataList('experience'));
const playerRepo = createPlayerRepository(() => experienceList);
const najieRepo = createNajieRepository();
async function getPlayerDataSafe(usr_qq) {
    return await getDataJSONParseByKey(keys.player(usr_qq));
}
async function getEquipmentDataSafe(usr_qq) {
    const equipmentData = await getDataJSONParseByKey(keys.equipment(usr_qq));
    return equipmentData;
}
async function existplayer(usr_qq) {
    const redis = getIoRedis();
    const res = await redis.exists(keys.player(usr_qq));
    return res === 1;
}
async function readPlayer(usr_qq) {
    return await getDataJSONParseByKey(keys.player(usr_qq));
}
async function readNajie(usr_qq) {
    return await getDataJSONParseByKey(keys.najie(usr_qq));
}
async function writeNajie(usr_qq, najie) {
    await setDataJSONStringifyByKey(keys.najie(usr_qq), najie);
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
