import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getAdminsetImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?修仙设置$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const img = await getAdminsetImage(e);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});

export { res as default, regular };
