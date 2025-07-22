import { useSend, Text } from 'alemonjs';
import { Read_tiandibang, Write_tiandibang, re_bangdang } from '../tian.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)清空积分/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有主人可以执行操作'));
        return false;
    }
    try {
        await Read_tiandibang();
    }
    catch {
        await Write_tiandibang([]);
    }
    await re_bangdang();
    Send(Text('积分已经重置！'));
    return false;
});

export { res as default, regular, selects };
