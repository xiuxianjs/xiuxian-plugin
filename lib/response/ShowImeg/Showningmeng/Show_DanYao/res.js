import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { getDanyaoImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?丹药楼$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const img = await getDanyaoImage(e);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
