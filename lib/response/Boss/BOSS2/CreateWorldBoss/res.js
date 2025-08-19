import { InitWorldBoss2 } from '../../boss.js';
import { selects } from '../../../mw.js';

const regular = /^(#|＃|\/)?开启金角大王$/;
var res = onResponse(selects, async (e) => {
    if (e.IsMaster) {
        await InitWorldBoss2();
    }
});

export { res as default, regular };
