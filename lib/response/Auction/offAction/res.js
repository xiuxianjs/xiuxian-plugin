import { useSend, Text } from 'alemonjs';
import mw, { selects } from '../../mw-captcha.js';
import { closeAuctionKeys } from '../../../model/Config.js';

const regular = /^(#|＃|\/)?关闭星阁体系$/;
const res = onResponse(selects, e => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        void Send(Text('只有主人可以关闭'));
        return;
    }
    closeAuctionKeys();
    void Send(Text('星阁体系已关闭！'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
