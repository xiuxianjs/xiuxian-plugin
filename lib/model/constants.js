const baseKey = 'xiuxian@1.3.0';
const keysAction = {
    system: (id) => `${baseKey}:system:${id}`
};
const keysFuzhi = (id) => `xiuxian:player:${id}:fuzhi`;
const GAME_KEY = keysAction.system('money_game');
const KEY_WORLD_BOOS_STATUS = keysAction.system('world_boss_demon_king_status');
const KEY_RECORD = keysAction.system('record_demon_king');
const KEY_WORLD_BOOS_STATUS_TWO = keysAction.system('world_boss_king_status');
const KEY_RECORD_TWO = keysAction.system('record_king');
const KEY_AUCTION_GROUP_LIST = keysAction.system('auctionofficialtask_grouplist');
const KEY_AUCTION_OFFICIAL_TASK = keysAction.system('auctionofficialtask');

export { GAME_KEY, KEY_AUCTION_GROUP_LIST, KEY_AUCTION_OFFICIAL_TASK, KEY_RECORD, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS, KEY_WORLD_BOOS_STATUS_TWO, baseKey, keysFuzhi };
