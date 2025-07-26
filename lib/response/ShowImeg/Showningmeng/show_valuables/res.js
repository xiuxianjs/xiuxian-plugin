import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getValuablesImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?万宝楼$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getValuablesImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
