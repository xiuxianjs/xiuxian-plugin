import { useSend, Image } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { get_association_img } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?我的宗门$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await get_association_img(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
