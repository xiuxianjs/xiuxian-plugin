import { useSend, Text } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';
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
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
