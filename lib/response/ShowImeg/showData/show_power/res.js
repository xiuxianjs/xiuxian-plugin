import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { getPowerImage } from '../../../../model/image.js';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/api.js';
import 'crypto';
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?我的炼体$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    }
    const img = await getPowerImage(e);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
