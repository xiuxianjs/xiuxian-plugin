import { useSend, Text } from 'alemonjs';
import mw, { selects } from '../../../mw.js';
import { reSetTiandibang } from '../../../../model/Tiandibang.js';

const regular = /^(#|＃|\/)?重置天地榜/;
const res = onResponse(selects, e => {
    const Send = useSend(e);
    if (!e.IsMaster) {
        return;
    }
    void reSetTiandibang();
    void Send(Text('重置天地榜成功'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
