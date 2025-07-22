import { createEventName } from '../../../util.js';
import { Level_up } from '../level.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)突破$/;
var res = onResponse(selects, async (e) => {
    Level_up(e, false);
});

export { res as default, name, regular, selects };
