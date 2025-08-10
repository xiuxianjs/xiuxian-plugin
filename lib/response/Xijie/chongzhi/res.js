import { useSend, Text } from 'alemonjs';
import '../../../api/api.js';
import '../../../model/Config.js';
import '../../../config/Association.yaml.js';
import '../../../config/help.yaml.js';
import '../../../config/help2.yaml.js';
import '../../../config/set.yaml.js';
import '../../../config/shituhelp.yaml.js';
import '../../../config/namelist.yaml.js';
import '../../../config/task.yaml.js';
import '../../../config/version.yaml.js';
import '../../../config/xiuxian.yaml.js';
import data from '../../../model/XiuxianData.js';
import '@alemonjs/db';
import { readShop, writeShop } from '../../../model/xiuxian.js';
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
        shop = await readShop();
    }
    catch {
        await writeShop(data.shop_list);
        shop = await readShop();
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
    await writeShop(shop);
    Send(Text('重置成功!'));
});

export { res as default, regular };
