import { useSend, Text } from 'alemonjs';
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?发红包.*$/;
var res = onResponse(selects, e => {
    const Send = useSend(e);
    void Send(Text('该功能优化中……'));
    return false;
});

export { res as default, regular };
