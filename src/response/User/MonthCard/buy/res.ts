import {
  getDataList,
  setDataJSONStringifyByKey,
  getDataJSONParseByKey,
  findUserRechargeInfo,
  consumeUserCurrency,
  addNajieThing,
  keys,
  keysLock
} from '@src/model';
import { withLock } from '@src/model/locks';
import type { NajieCategory, ExchangeRecord } from '@src/types/model';
import mw, { selects } from '@src/response/mw-captcha';
import { useMessage, Text } from 'alemonjs';

export const regular = /^(#|＃|\/)?仙缘兑换/;

/**
 * 根据物品名推断纳戒分类
 */
const resolveNajieCategoryByThingName = async (name: string): Promise<NajieCategory | undefined> => {
  const [equip, danyao, newDanyao, daoju, gongfa, caoyao, duanzhaoCailiao, duanzhaoWuqi, duanzhaoHuju, duanzhaoBaowu, zalei, pets, petFood] = await Promise.all(
    [
      getDataList('Equipment'),
      getDataList('Danyao'),
      getDataList('NewDanyao'),
      getDataList('Daoju'),
      getDataList('Gongfa'),
      getDataList('Caoyao'),
      getDataList('Duanzhaocailiao'),
      getDataList('Duanzhaowuqi'),
      getDataList('Duanzhaohuju'),
      getDataList('Duanzhaobaowu'),
      getDataList('Zalei'),
      getDataList('Xianchon'),
      getDataList('Xianchonkouliang')
    ]
  );

  if (
    equip.some(i => i.name === name)
    || duanzhaoWuqi.some(i => i.name === name)
    || duanzhaoHuju.some(i => i.name === name)
    || duanzhaoBaowu.some(i => i.name === name)
  ) {
    return '装备';
  }
  if (danyao.some(i => i.name === name) || newDanyao.some(i => i.name === name)) {
    return '丹药';
  }
  if (daoju.some(i => i.name === name) || zalei.some(i => i.name === name)) {
    return '道具';
  }
  if (gongfa.some(i => i.name === name)) {
    return '功法';
  }
  if (caoyao.some(i => i.name === name)) {
    return '草药';
  }
  if (duanzhaoCailiao.some(i => i.name === name)) {
    return '材料';
  }
  if (pets.some(i => i.name === name)) {
    return '仙宠';
  }
  if (petFood.some(i => i.name === name)) {
    return '仙宠口粮';
  }

  return undefined;
};

/**
 * 追加兑换记录
 */
const appendMonthMarketExchangeRecord = async (record: ExchangeRecord): Promise<void> => {
  const key = keys.exchange('MonthMarket');
  const old = await getDataJSONParseByKey(key);
  const list: ExchangeRecord[] = Array.isArray(old) ? old : [];

  list.push(record);
  await setDataJSONStringifyByKey(key, list);
};

/**
 * 处理仙缘兑换指令
 */
const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const [itemName, itemCount = 1] = e.MessageText.replace(/仙缘兑换/, '')
    .split(' ')
    .slice(1);

  if (!itemName) {
    void message.send(format(Text('用法：#仙缘兑换 物品名 数量')));

    return;
  }
  // 校验数量为正整数
  const countRaw = Number(itemCount);

  if (!Number.isFinite(countRaw) || !Number.isInteger(countRaw) || countRaw <= 0) {
    void message.send(format(Text('数量需为正整数')));

    return;
  }
  const count = countRaw;

  const lockKey = keysLock.task(`month_market_buy:${e.UserId}`);

  const lockResult = await withLock(
    lockKey,
    async () => {
      const monthMarketList = await getDataList('MonthMarket');
      const findItem = monthMarketList.find(item => item.name === itemName);

      if (!findItem) {
        void message.send(format(Text(`[${itemName}]不存在，请检查物品名称是否正确`)));

        return;
      }

      const unitPrice = Number(findItem.price) || 0;
      const totalPrice = unitPrice * count;

      const info = await findUserRechargeInfo(e.UserId);
      const balance = info?.currency ?? 0;

      const ok = await consumeUserCurrency(e.UserId, totalPrice);

      if (!ok) {
        void message.send(format(Text(`仙缘币不足，当前余额：${balance}，兑换所需：${totalPrice}`)));

        return;
      }

      const category: NajieCategory | undefined = (findItem as any)?.class || (await resolveNajieCategoryByThingName(itemName));

      if (!category) {
        void message.send(format(Text(`物品[${itemName}]无法识别分类，请联系管理员处理`)));

        return;
      }

      const isEquipment
        = category === '装备' || findItem.atk !== undefined || findItem.def !== undefined || findItem.HP !== undefined || findItem.bao !== undefined;

      if (isEquipment) {
        const equipmentObj = {
          name: itemName,
          class: category,
          type: (findItem as any).type,
          atk: (findItem as any).atk,
          def: (findItem as any).def,
          HP: (findItem as any).HP,
          bao: (findItem as any).bao,
          数量: 1,
          出售价: unitPrice
        };

        // 装备按件添加
        for (let i = 0; i < count; i++) {
          await addNajieThing(e.UserId, equipmentObj as any, '装备', 1);
        }
      } else {
        await addNajieThing(e.UserId, itemName, category as NajieCategory, count);
      }

      const record: ExchangeRecord = {
        thing: {
          name: itemName,
          class: category,
          数量: count,
          出售价: unitPrice
        },
        price: unitPrice,
        amount: count,
        qq: e.UserId,
        now_time: Date.now()
      };

      await appendMonthMarketExchangeRecord(record);

      const afterInfo = await findUserRechargeInfo(e.UserId);
      const afterBalance = afterInfo?.currency ?? Math.max(0, balance - totalPrice);

      void message.send(format(Text(`您兑换了${count}个[${itemName}]，共花费${totalPrice}仙缘币；当前余额：${afterBalance}`)));
    },
    {
      timeout: 30000,
      retryDelay: 100,
      maxRetries: 5,
      enableRenewal: true,
      renewalInterval: 10000
    }
  );

  if (!lockResult.success) {
    void message.send(format(Text('正在处理你的上一笔兑换，请稍后再试')));
  }
});

export default onResponse(selects, [mw.current, res.current]);
