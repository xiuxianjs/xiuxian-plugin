import { useSend, Image } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { existplayer } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';
import { getPlayerImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?我(的练气)?$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let usr_qq = e.UserId;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay)
        return false;
    let img = await getPlayerImage(e);
    if (img)
        Send(Image(img));
    return false;
});

export { res as default, regular };
