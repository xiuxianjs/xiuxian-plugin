import { useLevelUp } from '../level.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?突破$/;
const res = onResponse(selects, e => {
    void useLevelUp(e, false);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
