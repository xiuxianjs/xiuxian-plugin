import { useSend, Image } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { getEquipmentImage } from '../../../../model/image.js';
import '../../../../model/api.js';
import '../../../../model/keys.js';
import '@alemonjs/db';
import 'dayjs';
import { existplayer } from '../../../../model/xiuxiandata.js';
import '../../../../model/DataList.js';
import 'lodash-es';
import '../../../../model/settions.js';
import 'svg-captcha';
import 'sharp';
import '../../../../model/currency.js';
import 'crypto';
import 'posthog-node';
import '../../../../model/message.js';

const regular = /^(#|＃|\/)?我的装备$/;
const res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const userId = e.UserId;
    const ifexistplay = await existplayer(userId);
    if (!ifexistplay) {
        return false;
    }
    const img = await getEquipmentImage(e);
    if (Buffer.isBuffer(img)) {
        void Send(Image(img));
    }
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
