import { createPlayerRepository } from './repository/playerRepository.js';
import { createNajieRepository } from './repository/najieRepository.js';
import { keys } from './keys.js';
import { getDataList } from './DataList.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey, existDataByKey } from './DataControl.js';
export { writePlayer } from './pub.js';

const experienceList = (await getDataList('experience'));
const playerRepo = createPlayerRepository(() => experienceList);
const najieRepo = createNajieRepository();
async function getPlayerDataSafe(usrid) {
    return await getDataJSONParseByKey(keys.player(usrid));
}
async function getEquipmentDataSafe(usrid) {
    const equipmentData = await getDataJSONParseByKey(keys.equipment(usrid));
    return equipmentData;
}
function existplayer(usrid) {
    return existDataByKey(keys.player(usrid));
}
async function readPlayer(usrid) {
    return await getDataJSONParseByKey(keys.player(usrid));
}
async function readNajie(usrid) {
    return await getDataJSONParseByKey(keys.najie(usrid));
}
async function writeNajie(usrid, najie) {
    await setDataJSONStringifyByKey(keys.najie(usrid), najie);
}
async function addExp4(usrid, exp = 0) {
    if (exp === 0 || isNaN(exp)) {
        return;
    }
    await playerRepo.addOccupationExp(usrid, exp);
}
async function addConFaByUser(usrid, gongfaName) {
    const player = await readPlayer(usrid);
    if (!player) {
        return;
    }
    if (!Array.isArray(player.学习的功法)) {
        player.学习的功法 = [];
    }
    player.学习的功法.push(gongfaName);
    await setDataJSONStringifyByKey(keys.player(usrid), player);
    import('./efficiency.js').then(m => m.playerEfficiency(usrid)).catch(() => { });
}
async function addBagCoin(usrid, lingshi) {
    const delta = Math.trunc(Number(lingshi));
    if (delta === 0) {
        return;
    }
    await najieRepo.addLingShi(usrid, delta);
}

export { addBagCoin, addConFaByUser, addExp4, existplayer, getEquipmentDataSafe, getPlayerDataSafe, readNajie, readPlayer, writeNajie };
