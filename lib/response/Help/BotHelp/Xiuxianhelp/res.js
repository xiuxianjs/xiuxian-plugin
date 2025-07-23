import { useSend, Image } from 'alemonjs';
import Help from '../../../../model/help.js';
import { cache } from '../../help.js';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)??修仙帮助$/;
var res = onResponse(selects, async (e) => {
    logger.info('修仙帮助');
    const Send = useSend(e);
    let data = await Help.get();
    if (!data)
        return false;
    let img = await cache(data, e.UserId);
    if (img)
        Send(Image(img));
});

export { res as default, regular };
