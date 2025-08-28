import { useSend, Text } from 'alemonjs';
import mw, { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?修仙攻略$/;
const res = onResponse(selects, e => {
    const Send = useSend(e);
    void Send(Text('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC'));
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
