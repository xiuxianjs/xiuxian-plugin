import { useSend, Image } from 'alemonjs';
import Help2 from '../../../../model/shituhelp.js';
import { cache } from '../../help.js';
import { selects } from '../../../index.js';

const regular = /^(#|\/)师徒帮助$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let data = await Help2.shituhelp(e);
    if (!data)
        return false;
    let img = await cache(data, e.UserId);
    await Send(Image(img));
});

export { res as default, regular };
