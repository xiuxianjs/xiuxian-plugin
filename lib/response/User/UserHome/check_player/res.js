import { useSend, Text } from 'alemonjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?检查存档.*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        Send(Text('只有主人可以执行操作'));
        return false;
    }
    Send(Text('新存档不需要进行检查...'));
});

export { res as default, regular };
