import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getXianChongImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?仙宠楼$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getXianChongImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
