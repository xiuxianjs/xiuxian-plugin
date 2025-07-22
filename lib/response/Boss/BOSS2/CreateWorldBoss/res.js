import { createEventName } from '../../../util.js';
import { InitWorldBoss } from '../../boss.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)开启金角大王$/;
var res = onResponse(selects, async (e) => {
    if (!e || e.IsMaster) {
        await InitWorldBoss();
    }
});

export { res as default, name, regular, selects };
