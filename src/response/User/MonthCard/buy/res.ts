import { getDataList } from '@src/model';
import mw, { selects } from '@src/response/mw-captcha';
import { useMessage, Text } from 'alemonjs';

export const regular = /^(#|＃|\/)?仙缘兑换/;

const res = onResponse(selects, async e => {
    const [message] = useMessage(e);
    // 物品名 数量
    const [itemName, itemCount = 1] = e.MessageText.replace(/仙缘兑换/, '').split(' ').slice(1);

    const monthMarketList = await getDataList('MonthMarket');
    const findItem = monthMarketList.find((item) => item.name === itemName);

    if (!findItem) {
        void message.send(format(Text(`[${itemName}]不存在，请检查物品名称是否正确`)));

        return;
    }
    const count = Math.max(1, Number(itemCount));
    const totalPrice = findItem.price * count;

    void message.send(format(Text(`您兑换了${count}个[${itemName}]，共花费${totalPrice}仙缘币`)));
});

export default onResponse(selects, [mw.current, res.current]);
