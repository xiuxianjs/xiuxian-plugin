import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
import { getDanyaoImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?丹药楼$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const img = await getDanyaoImage(e);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
