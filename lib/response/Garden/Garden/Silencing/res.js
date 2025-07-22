import { useSend, Text } from 'alemonjs';
import { createEventName } from '../../../util.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)^(禁言术|残云封天剑).*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    Send(Text('待开发'));
});

export { res as default, name, regular, selects };
