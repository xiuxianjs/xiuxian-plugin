import { keys } from './keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

async function readTemp() {
    const data = await getDataJSONParseByKey(keys.temp('temp'));
    return data ?? [];
}
async function writeTemp(list) {
    await setDataJSONStringifyByKey(keys.temp('temp'), list);
}
var temp = { readTemp, writeTemp };

export { temp as default, readTemp, writeTemp };
