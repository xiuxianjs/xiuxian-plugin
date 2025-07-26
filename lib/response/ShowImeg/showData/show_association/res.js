import { useSend, Image } from 'alemonjs';
import { selects } from '../../../index.js';
import { getAssociationImage } from '../../../../model/image.js';

const regular = /^(#|＃|\/)?我的宗门$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await getAssociationImage(e);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
