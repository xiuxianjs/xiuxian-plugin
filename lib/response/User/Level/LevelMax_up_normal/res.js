import { userLevelMaxUp } from '../level.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?破体$/;
const res = onResponse(selects, e => {
    void userLevelMaxUp(e, false);
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
