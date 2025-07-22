import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../util.js';
import '../../../api/api.js';
import 'yaml';
import 'fs';
import '../../../config/help/Association.yaml.js';
import '../../../config/help/help.yaml.js';
import '../../../config/help/helpcopy.yaml.js';
import '../../../config/help/set.yaml.js';
import '../../../config/help/shituhelp.yaml.js';
import '../../../config/parameter/namelist.yaml.js';
import '../../../config/task/task.yaml.js';
import '../../../config/version/version.yaml.js';
import '../../../config/xiuxian/xiuxian.yaml.js';
import 'path';
import '../../../model/paths.js';
import data from '../../../model/XiuxianData.js';
import { Read_shop, Write_shop } from '../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)重置.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    let didian = e.MessageText.replace('#重置', '');
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

export { res as default, name, regular, selects };
