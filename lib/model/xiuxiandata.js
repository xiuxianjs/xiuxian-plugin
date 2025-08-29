import { keys } from './keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey, existDataByKey } from './DataControl.js';

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
async function writeIt(custom) {
    await setDataJSONStringifyByKey(keys.custom('custom'), custom);
}
async function writePlayer(usrQQ, player) {
    await setDataJSONStringifyByKey(keys.player(usrQQ), player);
}

export { existplayer, readNajie, readPlayer, writeIt, writeNajie, writePlayer };
