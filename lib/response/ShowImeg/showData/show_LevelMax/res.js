import { useSend, Image } from 'alemonjs';
import { createEventName } from '../../../util.js';
import { get_statemax_img } from '../../../../model/xiuxian.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)炼体境界$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    let img = await get_statemax_img(e, null);
    if (img)
        Send(Image(img));
});

export { res as default, name, regular, selects };
