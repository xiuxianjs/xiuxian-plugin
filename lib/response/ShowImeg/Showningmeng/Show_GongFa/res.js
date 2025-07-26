import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getGongfaImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?功法楼$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getGongfaImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
