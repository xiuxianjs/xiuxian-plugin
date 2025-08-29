import { readExchange, writeExchange } from '@src/model/trade';
import type { ExchangeEntry } from '@src/types';
import { addNajieThing } from '@src/model/najie';
import { ExchangeRecord } from '@src/types';

/**
 * 读取兑换记录（ExchangeRecord），并兼容旧格式的数据。
 * 检查每条兑换记录的时间，如果已超过3天，则将物品发放到用户纳戒（背包），并从兑换记录中移除该条记录。
 * 最后将更新后的兑换记录写回存储。
 * @returns
 */
export const ExchangeTask = async () => {
  console.log('ExchangeTask');
  const Exchange: ExchangeRecord[] = await readExchange();
  const now_time = Date.now();

  // 现行 ExchangeRecord 不含旧逻辑字段，保持向前兼容：若首条具备 now_time/qq 等字段则按旧规则回退
  if (Exchange.length && 'now_time' in Exchange[0]) {
    const list = Exchange as (ExchangeRecord & ExchangeEntry)[];

    for (let i = 0; i < list.length; i++) {
      const rec = list[i];

      if (!('now_time' in rec)) {
        break;
      }
      const time = (now_time - rec.now_time) / 24 / 60 / 60 / 1000;

      if (time < 3) {
        break;
      }
      const userId = rec.qq;
      const nm = rec.thing as ExchangeEntry['name'];
      const quanity = rec.aconut;

      await addNajieThing(userId, nm.name, nm.class, quanity, Number(nm.pinji));
      list.splice(i, 1);
      i--;
    }
    await writeExchange(list);
  }

  return false;
};
