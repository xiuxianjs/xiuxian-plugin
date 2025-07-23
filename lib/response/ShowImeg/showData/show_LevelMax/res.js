import { useSend, Image } from 'alemonjs';
import { get_statemax_img } from '../../../../model/xiuxian.js';
import { selects } from '../../../index.js';

const regular = /^(#|\/)炼体境界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await get_statemax_img(e, null);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
