import { readAll } from './duanzaofu.js';
import { keys } from './keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

const baseData = {
    biguan: 0,
    biguanxl: 0,
    xingyun: 0,
    lianti: 0,
    ped: 0,
    modao: 0,
    beiyong1: 0,
    beiyong2: 0,
    beiyong3: 0,
    beiyong4: 0,
    beiyong5: 0
};
async function readDanyao(userId) {
    const data = await getDataJSONParseByKey(keys.danyao(userId));
    return data ?? baseData;
}
async function writeDanyao(userId, data) {
    await setDataJSONStringifyByKey(keys.danyao(userId), data);
}
var danyao = { readDanyao, writeDanyao, readAll };

export { danyao as default, readAll, readDanyao, writeDanyao };
