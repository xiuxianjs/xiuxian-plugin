import { LevelMax_up } from '../level.js';

const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)破体$/;
var res = onResponse(selects, async (e) => {
    LevelMax_up(e, false);
});

export { res as default, regular, selects };
