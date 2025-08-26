// 临时数据存取逻辑抽离
import { __PATH } from './keys.js';
import { keys } from './keys.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

export async function readTemp(): Promise<any[]> {
  const data = await getDataJSONParseByKey(keys.temp('temp'));

  return data ?? [];
}

export async function writeTemp(list: any[]) {
  await setDataJSONStringifyByKey(keys.temp('temp'), list);
}

export default { readTemp, writeTemp };
