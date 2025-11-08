import { InitWorldBoss2 } from '../../../../model/boss.js';
import mw, { selects } from '../../../mw-captcha.js';

const regular = /^(#|＃|\/)?开启金角大王$/;
const res = onResponse(selects, async (e) => {
    if (e.IsMaster) {
        await InitWorldBoss2();
    }
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular };
