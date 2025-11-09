import { getDataList } from '@src/model';
import mw, { selects } from '@src/response/mw-captcha';
import { useMessage, Text } from 'alemonjs';

export const regular = /^(#|＃|\/)?仙缘商店$/;

const res = onResponse(selects, async e => {
    const [message] = useMessage(e);

    const monthMarketList = await getDataList('MonthMarket');

    const lines: string[] = [];

    lines.push('【仙缘商店】');
    monthMarketList.forEach((item) => {
        lines.push(`${item.name}，${item.price}仙缘币}`);
    });
    void message.send(format(Text(lines.join('\n'))));
});

export default onResponse(selects, [mw.current, res.current]);
