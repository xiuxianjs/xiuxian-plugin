import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getStateImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?练气境界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getStateImage(e, null);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
