import { useSend, Text } from 'alemonjs';
import { selects } from '../../../index.js';

const regular = /^(#|＃|\/)?备份存档$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    Send(Text('新存储系统不需要备份存档'));
});

export { res as default, regular };
