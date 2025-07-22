import { useSend, Text } from 'alemonjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)仙府$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    Send(Text('仙府乃民间传说之地,请自行探索'));
});

export { res as default, regular, selects };
