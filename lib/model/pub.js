import { keys } from './keys.js';
import { setDataJSONStringifyByKey } from './DataControl.js';

async function writeIt(custom) {
    await setDataJSONStringifyByKey(keys.custom('custom'), custom);
}
async function writePlayer(usr_qq, player) {
    await setDataJSONStringifyByKey(keys.player(usr_qq), player);
}

export { writeIt, writePlayer };
