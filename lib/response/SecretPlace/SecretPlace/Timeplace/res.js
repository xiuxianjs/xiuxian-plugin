import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)仙府$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    Send(Text('仙府乃民间传说之地,请自行探索'));
});

export { res as default, name, regular, selects };
