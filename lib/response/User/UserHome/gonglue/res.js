import { useSend, Text } from 'alemonjs';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?修仙攻略$/;
const res = onResponse(selects, e => {
    const Send = useSend(e);
    void Send(Text('修仙攻略\nhttps://docs.qq.com/doc/DTHhuVnRLWlhjclhC'));
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
