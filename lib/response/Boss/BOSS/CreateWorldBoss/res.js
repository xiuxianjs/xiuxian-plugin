import { InitWorldBoss } from '../../../../model/boss.js';
import mw from '../../../mw-captcha.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?开启妖王$/;
const res = onResponse(selects, async (e) => {
    if (!e || e.IsMaster) {
        await InitWorldBoss();
        return false;
    }
});
var res_default = onResponse(selects, [mw.current, res.current]);

export { res_default as default, regular, selects };
