import { getDataList, checkUserMonthCardStatus } from '@src/model';
import mw, { selects } from '@src/response/mw-captcha';
import { useMessage, Text } from 'alemonjs';

export const regular = /^(#|＃|\/)?仙缘商店$/;

/**
 * 展示仙缘商店列表与当前仙缘币余额
 */
const res = onResponse(selects, async e => {
    const [message] = useMessage(e);

    const monthMarketList = await getDataList('MonthMarket');
    const userStatus = await checkUserMonthCardStatus(e.UserId);
    const currency = userStatus?.currency ?? 0;

    const lines: string[] = [];

    lines.push('【仙缘商店】');
    lines.push(`仙缘币余额：${currency}`);
    monthMarketList.forEach((item) => {
        lines.push(`${item.name}，${item.price}仙缘币`);
    });
    void message.send(format(Text(lines.join('\n'))));
});

export default onResponse(selects, [mw.current, res.current]);
