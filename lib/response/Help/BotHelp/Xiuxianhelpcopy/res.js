import { useSend, Image } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { cache } from '../../help.js';
import Help from '../../../../model/help.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)修仙扩展$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let data = await Help.gethelpcopy(e);
    if (!data)
        return false;
    let img = await cache(data, e.UserId);
    await Send(Image(img));
});

export { res as default, name, regular, selects };
