import { useSend, Text } from 'alemonjs';
import '../../../api/api.js';
import '../../../model/Config.js';
import 'fs';
import 'path';
import '../../../model/paths.js';
import data from '../../../model/XiuxianData.js';
import { Read_shop, Write_shop } from '../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../index.js';

const regular = /^(#|＃|\/)?重置.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    let didian = e.MessageText.replace(/^(#|＃|\/)?重置/, '');
    didian = didian.trim();
    let shop;
    try {
        shop = await Read_shop();
    }
    catch {
        await Write_shop(data.shop_list);
        shop = await Read_shop();
    }
    let i;
    for (i = 0; i < shop.length; i++) {
        if (shop[i].name == didian) {
            break;
        }
    }
    if (i == shop.length) {
        return false;
    }
    shop[i].state = 0;
    await Write_shop(shop);
    Send(Text('重置成功!'));
});

export { res as default, regular };
