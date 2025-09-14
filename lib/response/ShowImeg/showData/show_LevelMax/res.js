import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
import { getStatemaxImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?炼体境界$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const img = await getStatemaxImage(e, null);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
