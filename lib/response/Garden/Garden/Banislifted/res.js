const selects = onSelects(['message.create', 'private.message.create']);
const regular = /^(#|\/)^(除你禁言|废除).*$/;

export { regular, selects };
