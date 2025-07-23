import { InitWorldBoss } from '../../boss.js';
import { selects } from '../../../index.js';

const regular = /^(#|\/)开启金角大王$/;
var res = onResponse(selects, async (e) => {
    if (!e || e.IsMaster) {
        await InitWorldBoss();
    }
});

export { res as default, regular };
