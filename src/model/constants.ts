// 基础 Redis Key 前缀
export const baseKey = 'xiuxian@1.3.0';

const keysAction = {
  system: (id: string) => `${baseKey}:system:${id}`
};

export const keysFuzhi = (id: string) => `xiuxian:player:${id}:fuzhi`;

// 金银坊 - 资金池 Redis Key
export const GAME_KEY = keysAction.system('money_game');

// 妖王 - demon king
export const KEY_WORLD_BOOS_STATUS = keysAction.system('world_boss_demon_king_status');
export const KEY_RECORD = keysAction.system('record_demon_king');

// 金角 大王 - king
export const KEY_WORLD_BOOS_STATUS_TWO = keysAction.system('world_boss_king_status');
export const KEY_RECORD_TWO = keysAction.system('record_king');

// 星阁
export const KEY_AUCTION_GROUP_LIST = keysAction.system('auctionofficialtask_grouplist');

// 星阁
export const KEY_AUCTION_OFFICIAL_TASK = keysAction.system('auctionofficialtask');
