import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getWuqiImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?装备楼$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getWuqiImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
