import { readShop, writeShop } from '@src/model/shop';
import type { ShopSlot } from '@src/types';

/**
 * 读取商店数据（shop）。
遍历每个商品（slot），将其 Grade（等级）减1，最低不低于1。
更新后的商店数据写回存储。
 */
export const ShopGradetask = async () => {
  const shop = await readShop();

  for (const slot of shop as Array<ShopSlot & { Grade?: number }>) {
    const current = Number(slot.Grade ?? 1);

    slot.Grade = current - 1;
    if (slot.Grade < 1) {
      slot.Grade = 1;
    }
  }
  await writeShop(shop);
};
