import { selects } from '../../../index.js';
import { useSend, Text } from 'alemonjs';

const regular = /^(#|＃|\/)?一键同步$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    Send(Text('新存储设计不需要同步'));
    return false;
});

export { res as default, regular };
