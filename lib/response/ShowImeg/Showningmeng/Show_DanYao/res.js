import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getDanyaoImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?丹药楼$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getDanyaoImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
