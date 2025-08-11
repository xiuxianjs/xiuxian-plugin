function isRaidActionState(a) {
    return (!!a &&
        typeof a === 'object' &&
        ('xijie' in a || 'Place_address' in a) &&
        'end_time' in a);
}
function isExploreActionState(a) {
    return !!a && typeof a === 'object' && 'mojie' in a;
}
function isSecretPlaceActionState(a) {
    return (!!a &&
        typeof a === 'object' &&
        ('Place_action' in a || 'Place_actionplus' in a));
}
function isOccupationActionState(a) {
    return !!a && typeof a === 'object' && ('plant' in a || 'mine' in a);
}
function isControlActionState(a) {
    return !!a && typeof a === 'object' && 'acount' in a;
}

export { isControlActionState, isExploreActionState, isOccupationActionState, isRaidActionState, isSecretPlaceActionState };
