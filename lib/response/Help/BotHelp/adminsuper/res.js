import { useSend, Image } from 'alemonjs';
import Help from '../../../../model/help.js';
import { cache } from '../../help.js';
import { selects } from '../../../index.js';

const regular = /^(#|\/)修仙管理$/;
var res = onResponse(selects, async (e) => {
    logger.info(await e.UserAvatar.toURL());
    const Send = useSend(e);
    let data = await Help.setup(e);
    if (!data)
        return false;
    let img = await cache(data, e.UserId);
    await Send(Image(img));
});

export { res as default, regular };
