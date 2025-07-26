import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getdanfangImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?丹药配方$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getdanfangImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
