import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getDaojuImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?道具楼$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getDaojuImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
