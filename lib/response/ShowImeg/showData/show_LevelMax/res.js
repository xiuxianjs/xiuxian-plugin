import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getStatemaxImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?炼体境界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const img = await getStatemaxImage(e, null);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});

export { res as default, regular };
