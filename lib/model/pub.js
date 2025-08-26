import { keys } from './keys.js';
import { setDataJSONStringifyByKey } from './DataControl.js';

async function writeIt(custom) {
    await setDataJSONStringifyByKey(keys.custom('custom'), custom);
}
async function writePlayer(usrQQ, player) {
    await setDataJSONStringifyByKey(keys.player(usrQQ), player);
}

export { writeIt, writePlayer };
