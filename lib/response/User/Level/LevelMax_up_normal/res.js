import { createEventName } from '../../../util.js';
import { LevelMax_up } from '../level.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)破体$/;
var res = onResponse(selects, async (e) => {
    LevelMax_up(e, false);
});

export { res as default, name, regular, selects };
