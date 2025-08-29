// 丹药存取逻辑抽离
import { __PATH, keys } from './keys.js';
import { readAll } from './duanzaofu.js';
import { DanyaoStatus } from '@src/types/player.js';
import { getDataJSONParseByKey, setDataJSONStringifyByKey } from './DataControl.js';

const baseData = {
  biguan: 0, // 闭关状态
  biguanxl: 0, // 增加效率
  xingyun: 0,
  lianti: 0,
  ped: 0,
  modao: 0,
  beiyong1: 0, // ped
  beiyong2: 0,
  beiyong3: 0,
  beiyong4: 0,
  beiyong5: 0
};

/**
 * 读取玩家丹药列表。
 * 兼容旧版本：历史上可能以“单个对象(聚合状态)”形式存储，而不是数组。
 * 如果解析结果不是数组，则包装为数组；若是 null/其它类型，返回空数组。
 */
export async function readDanyao(userId: string): Promise<DanyaoStatus> {
  const data = await getDataJSONParseByKey(keys.danyao(userId));

  return data ?? baseData;
}

export async function writeDanyao(userId: string, data: DanyaoStatus) {
  await setDataJSONStringifyByKey(keys.danyao(userId), data);
}

export { readAll };
export default { readDanyao, writeDanyao, readAll };
