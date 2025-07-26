import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getStatezhiyeImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?职业等级$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getStatezhiyeImage(e, null);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
