import { useSend, Image } from 'alemonjs';
import '../../../../model/Config.js';
import 'fs';
import 'path';
import '../../../../model/paths.js';
import '../../../../model/XiuxianData.js';
import { get_state_img } from '../../../../model/xiuxian.js';
import 'dayjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?练气境界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await get_state_img(e, null);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
