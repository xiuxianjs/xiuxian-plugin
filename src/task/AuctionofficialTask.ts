import { redis, pushInfo } from '@src/model/api';
import { openAU } from '@src/model/trade';
import { readPlayer } from '@src/model';
import { addCoin } from '@src/model/economy';
import { addNajieThing } from '@src/model/najie';
import type { AuctionSession, CoreNajieCategory as NajieCategory } from '@src/types';
import { getConfig } from '@src/model';
import { getAuctionKeyManager } from '@src/model/auction';

export const AuctionofficialTask = async () => {
  // 获取星阁key管理器，支持多机器人部署和自动数据迁移
  const auctionKeyManager = getAuctionKeyManager();

  const set = await getConfig('xiuxian', 'xiuxian');
  const auctionTaskKey = await auctionKeyManager.getAuctionOfficialTaskKey();
  const wupinStr = await redis.get(auctionTaskKey);

  if (!wupinStr) {
    // 未在拍卖中 -> 判断时间窗口
    const now = new Date();
    const { openHour, closeHour } = set.Auction;
    const startOfDay = new Date(now).setHours(0, 0, 0, 0);
    const openTime = startOfDay + openHour * 3600_000;
    const closeTime = startOfDay + closeHour * 3600_000;
    const nowTime = now.getTime();

    if (nowTime < openTime || nowTime > closeTime) {
      return false;
    }

    // 开启新拍卖
    const auction = await openAU();
    let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;

    if (auction.last_offer_player === 0) {
      msg += '暂无人出价';
    } else {
      const player = await readPlayer(String(auction.last_offer_player));

      if (player) {
        msg += `最高出价是${player.名号}叫出的${auction.lastPrice}`;
      }
    }
    auction.groupList.forEach(g => pushInfo(String(g), true, msg));

    return false;
  }

  // 已在拍卖中 -> 结算或广播剩余时间
  const wupin = JSON.parse(wupinStr) as AuctionSession;
  const nowTime = Date.now();
  const interMinu: number = set.Auction.interval;
  let msg: string;
  const endTime = wupin.last_offer_price + interMinu * 60_000;

  if (endTime > nowTime) {
    const remain = endTime - nowTime;
    const m = Math.floor(remain / 1000 / 60);
    const s = Math.floor((remain - m * 60_000) / 1000);

    msg = `星阁限定物品【${wupin.thing.name}】拍卖中\n距离拍卖结束还有${m}分${s}秒\n目前最高价${wupin.last_price}`;
    wupin.groupList.forEach(g => pushInfo(String(g), true, msg));

    return false;
  }

  // 拍卖结束结算
  if (wupin.last_offer_player === 0) {
    msg = `流拍，${wupin.thing.name}已退回神秘人的纳戒`;
  } else {
    const pid = String(wupin.last_offer_player);

    await addCoin(pid, -wupin.last_price);
    // 拍卖物品分类校验并回退到 '道具'
    const cls = (() => {
      const raw = String(wupin.thing.class);
      const list: NajieCategory[] = ['装备', '丹药', '道具', '功法', '草药', '材料', '仙宠', '仙宠口粮'];

      return (list as string[]).includes(raw) ? (raw as NajieCategory) : '道具';
    })();
    const pinji = Number(wupin.thing.pinji);

    await addNajieThing(pid, wupin.thing.name, cls, wupin.amount, isNaN(pinji) ? 0 : pinji);
    const player = await readPlayer(pid);

    if (player) {
      msg = `拍卖结束，${player.名号}最终拍得该物品！`;
    }
  }
  wupin.groupList.forEach(g => pushInfo(String(g), true, msg));
  await redis.del(auctionTaskKey);

  return false;
};
