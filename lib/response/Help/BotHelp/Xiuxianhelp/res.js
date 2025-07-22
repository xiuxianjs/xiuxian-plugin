import { useSend, Image } from 'alemonjs';
import { createEventName } from '../../../util.js';
import Help from '../../../../model/help.js';
import { cache } from '../../help.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)?修仙帮助$/;
var res = onResponse(selects, async (e) => {
    logger.info('修仙帮助');
    const Send = useSend(e);
    let data = await Help.get(e);
    if (!data)
        return false;
    let img = await cache(data, e.UserId);
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
