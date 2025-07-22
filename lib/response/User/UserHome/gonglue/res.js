import { useSend, Text } from 'alemonjs';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)修仙攻略$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    Send(Text('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC'));
});

export { res as default, regular, selects };
