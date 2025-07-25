import { useSend, Image } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { get_ningmenghome_img } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?柠檬堂(装备|丹药|功法|道具|草药|武器|护具|法宝|血量|修为|血气|天赋)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let thing_type = e.MessageText.replace(/^(#|＃|\/)?柠檬堂/, '');
    let img = await get_ningmenghome_img(e, thing_type);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
