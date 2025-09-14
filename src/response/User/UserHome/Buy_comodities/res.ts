import { Text, useSend } from 'alemonjs';

import { addNajieThing, addCoin, convert2integer, existplayer, Go, readPlayer } from '@src/model/index';

import { getDataList } from '@src/model/DataList';
import type { NajieCategory } from '@src/types/model';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?购买((.*)|(.*)*(.*))$/;

interface Commodity {
  name: string;
  出售价: number;
  class: NajieCategory | string;
}
function toInt(v, d = 0) {
  const n = Number(v);

  return Number.isFinite(n) ? Math.trunc(n) : d;
}

const PRICE_RATE = 1.2;
const MAX_QTY = 9999;

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }
  if (!(await Go(e))) {
    return false;
  }

  const raw = e.MessageText.replace(/^(#|＃|\/)?购买/, '').trim();

  if (!raw) {
    void Send(Text('格式: 购买物品名*数量 (数量可省略)'));

    return false;
  }
  const [rawName, rawQty] = raw.split('*');
  const thingName = rawName?.trim();

  if (!thingName) {
    void Send(Text('物品名称不能为空'));

    return false;
  }

  const commodityData = await getDataList('Commodity');
  const commodity = (commodityData as Commodity[]).find(item => item.name === thingName);

  if (!commodity) {
    void Send(Text(`柠檬堂还没有这样的东西: ${thingName}`));

    return false;
  }

  let qty = toInt(convert2integer(rawQty), 1);

  if (!Number.isFinite(qty) || qty <= 0) {
    qty = 1;
  }
  if (qty > MAX_QTY) {
    qty = MAX_QTY;
  }

  const player = await readPlayer(userId);

  if (!player) {
    void Send(Text('存档异常'));

    return false;
  }
  const lingshi = Number(player.灵石) || 0;

  if (lingshi <= 0) {
    void Send(Text('掌柜：就你这穷酸样，也想来柠檬堂？走走走！'));

    return false;
  }

  const unitPrice = Math.max(0, Number(commodity.出售价) || 0);
  let totalPrice = Math.trunc(unitPrice * PRICE_RATE * qty);

  if (totalPrice <= 0) {
    totalPrice = 1;
  }
  // 防溢出
  if (!Number.isFinite(totalPrice) || totalPrice > 1e15) {
    void Send(Text('价格异常，购买已取消'));

    return false;
  }

  if (lingshi < totalPrice) {
    void Send(Text(`口袋里的灵石不足以支付 ${thingName}, 还需要 ${totalPrice - lingshi} 灵石`));

    return false;
  }

  await addNajieThing(userId, thingName, commodity.class as NajieCategory, qty);
  await addCoin(userId, -totalPrice);
  void Send(Text(`购买成功! 获得[${thingName}]*${qty}, 花费[${totalPrice}]灵石, 剩余[${lingshi - totalPrice}]灵石\n可以在【我的纳戒】中查看`));

  return false;
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
