import { getDataJSONParseByKey, keys } from '@src/model';
import type { ExchangeRecord } from '@src/types/model';
import mw, { selects } from '@src/response/mw-captcha';
import { useMessage, Text, format } from 'alemonjs';

// 指令：仙缘兑换记录
export const regular = /^(#|＃|\/)?兑换记录(?=$|\s)/;

/**
 * 处理仙缘兑换记录指令：支持分页展示（每页最多5条，默认第一页）
 */
const res = onResponse(selects, async e => {
  const [message] = useMessage(e);
  const PAGE_SIZE = 5;

  // 解析可选页码参数，默认第一页
  const afterCmd = e.MessageText.replace(/^(#|＃|\/)?兑换记录\s*/, '');
  const pageText = afterCmd.trim();
  let page = 1;

  if (pageText !== '') {
    const n = Number(pageText);

    if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
      await message.send(format(Text('页码需为正整数')));

      return;
    }
    page = n;
  }

  const key = keys.exchange('MonthMarket');
  const raw = await getDataJSONParseByKey(key);
  const list: ExchangeRecord[] = Array.isArray(raw) ? raw : [];
  const mine = list.filter(r => String(r.qq) === e.UserId).sort((a, b) => Number(b.now_time || 0) - Number(a.now_time || 0));

  if (mine.length === 0) {
    await message.send(format(Text('暂无兑换记录')));

    return;
  }

  const totalPages = Math.max(1, Math.ceil(mine.length / PAGE_SIZE));

  if (page > totalPages) {
    await message.send(format(Text(`页码超出范围，最大${totalPages}页`)));

    return;
  }

  const start = (page - 1) * PAGE_SIZE;
  const items = mine.slice(start, start + PAGE_SIZE);
  const lines = items.map((r, i) => {
    const name = r.thing && (r.thing as any).name ? String((r.thing as any).name) : '未知物品';
    const amount = Number(r.amount ?? (r.thing as any)?.数量 ?? 0) || 0;
    const price = Number(r.price ?? (r.thing as any)?.出售价 ?? 0) || 0;
    const total = price * amount;
    const time = r.now_time ? new Date(r.now_time).toLocaleString('zh-CN', { hour12: false }) : '未知时间';

    return `${start + i + 1}. ${time} 物品：[${name}] x${amount}，单价：${price}，合计：${total}`;
  });

  const header = `最近${lines.length}条仙缘兑换记录（第${page}/${totalPages}页）：`;

  await message.send(format(Text([header, ...lines].join('\n'))));
});

export default onResponse(selects, [mw.current, res.current]);
