import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getAdminsetImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?修仙设置$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster)
        return false;
    let img = await getAdminsetImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
