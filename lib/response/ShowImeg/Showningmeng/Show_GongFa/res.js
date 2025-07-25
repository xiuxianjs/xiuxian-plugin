import { useSend, Image } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { get_gongfa_img } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?功法楼$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await get_gongfa_img(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
