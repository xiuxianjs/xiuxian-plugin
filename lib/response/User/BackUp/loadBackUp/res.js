import { useSend, Text } from 'alemonjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?读取存档(.*)/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有主人可以执行操作'));
        return false;
    }
});

export { res as default, regular };
