import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
import { getAdminsetImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?修仙设置$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return false;
    }
    const img = await getAdminsetImage(e);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
