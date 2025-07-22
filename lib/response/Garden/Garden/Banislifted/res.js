import { createEventName } from '../../../util.js';

const name = createEventName(import.meta.url);
const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)^(除你禁言|废除).*$/;

export { name, regular, selects };
