import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getTuzhiImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?装备图纸$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getTuzhiImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
