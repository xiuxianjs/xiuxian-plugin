import { userLevelMaxUp } from '../level.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?破体$/;
const res = onResponse(selects, e => {
    void userLevelMaxUp(e, false);
});
var res$1 = onResponse(selects, [mw.current, res.current]);

export { res$1 as default, regular };
