import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getPowerImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?我的炼体$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getPowerImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
