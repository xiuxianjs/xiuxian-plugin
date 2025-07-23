import { useSend, Image } from 'alemonjs';
import { cache } from '../../help.js';
import Help from '../../../../model/help.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?宗门管理$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let data = await Help.Association(e);
    if (!data)
        return false;
    let img = await cache(data, e.UserId);
    await Send(Image(img));
});

export { res as default, regular };
