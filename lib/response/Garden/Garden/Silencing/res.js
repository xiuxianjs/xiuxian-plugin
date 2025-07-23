import { useSend, Text } from 'alemonjs';
import { selects } from '../../../index.js';

const regular = /^(#|\/)^(禁言术|残云封天剑).*$/;
var res = onResponse(selects, async (e) => {
    const Send = useSend(e);
    Send(Text('待开发'));
});

export { res as default, regular };
