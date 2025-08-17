import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getWuqiImage } from '../../../../model/image.js';
import '@alemonjs/db';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/api.js';
import 'crypto';
import '../../../../route/core/auth.js';

const regular = /^(#|＃|\/)?装备楼$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    const img = await getWuqiImage(e);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
    }
});

export { res as default, regular };
