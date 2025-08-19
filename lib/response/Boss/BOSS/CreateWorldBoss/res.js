import { InitWorldBoss } from '../../../../model/boss.js';

const selects = onSelects(['message.create']);
const regular = /^(#|＃|\/)?开启妖王$/;
var res = onResponse(selects, async (e) => {
    if (!e || e.IsMaster) {
        await InitWorldBoss();
        return false;
    }
});

export { res as default, regular, selects };
