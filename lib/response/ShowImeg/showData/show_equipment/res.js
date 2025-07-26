import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getQquipmentImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?我的装备$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getQquipmentImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
