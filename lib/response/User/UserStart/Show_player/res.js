import { useSend, Image, Text } from 'alemonjs';
import '@alemonjs/db';
import '../../../../model/DataList.js';
import { existplayer } from '../../../../model/xiuxian_impl.js';
import '../../../../model/XiuxianData.js';
import 'lodash-es';
import '../../../../model/settions.js';
import '../../../../model/api.js';
import { getPlayerImage } from '../../../../model/image.js';
import 'crypto';
import '../../../../route/core/auth.js';
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?我(的练气)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    const usr_qq = e.UserId;
    if (!(await existplayer(usr_qq)))
        return false;
    const img = await getPlayerImage(e);
    if (Buffer.isBuffer(img)) {
        Send(Image(img));
        return false;
    }
    Send(Text('图片加载失败'));
    return false;
});

export { res as default, regular };
