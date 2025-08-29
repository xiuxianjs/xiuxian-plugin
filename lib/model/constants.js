import { getAppCofig } from './Config.js';
import { getIoRedis } from '@alemonjs/db';

const baseKey = 'xiuxian@1.3.0';
const keysAction = {
    system: (id) => `${baseKey}:system:${id}`
};
const keysActionWithBotId = {
    system: (id, botId) => `${baseKey}:system:${id}_${botId}`
};
const keysFuzhi = (id) => `xiuxian:player:${id}:fuzhi`;
const GAME_KEY = keysAction.system('money_game');
const KEY_WORLD_BOOS_STATUS = keysAction.system('world_boss_demon_king_status');
const KEY_RECORD = keysAction.system('record_demon_king');
const KEY_WORLD_BOOS_STATUS_TWO = keysAction.system('world_boss_king_status');
const KEY_RECORD_TWO = keysAction.system('record_king');
const KEY_AUCTION_GROUP_LIST = keysAction.system('auctionofficialtask_grouplist');
const KEY_AUCTION_OFFICIAL_TASK = keysAction.system('auctionofficialtask');
class AuctionKeyManager {
    static instance;
    botId;
    redis = getIoRedis();
    constructor() {
        const { botId } = getAppCofig();
        this.botId = botId || 'default';
    }
    static getInstance() {
        if (!AuctionKeyManager.instance) {
            AuctionKeyManager.instance = new AuctionKeyManager();
        }
        return AuctionKeyManager.instance;
    }
    getNewKeys() {
        return {
            AUCTION_OFFICIAL_TASK: keysActionWithBotId.system('auctionofficialtask', this.botId),
            AUCTION_GROUP_LIST: keysActionWithBotId.system('auctionofficialtask_grouplist', this.botId)
        };
    }
    getOldKeys() {
        return {
            AUCTION_OFFICIAL_TASK: KEY_AUCTION_OFFICIAL_TASK,
            AUCTION_GROUP_LIST: KEY_AUCTION_GROUP_LIST
        };
    }
    async migrateData(oldKey, newKey) {
        try {
            const oldData = await this.redis.get(oldKey);
            if (oldData) {
                await this.redis.set(newKey, oldData);
                console.log(`[星阁系统] 数据迁移成功: ${oldKey} -> ${newKey}`);
            }
        }
        catch (error) {
            console.error(`[星阁系统] 数据迁移失败: ${oldKey} -> ${newKey}`, error);
        }
    }
    async migrateSetData(oldKey, newKey) {
        try {
            const oldMembers = await this.redis.smembers(oldKey);
            if (oldMembers && oldMembers.length > 0) {
                await this.redis.sadd(newKey, ...oldMembers);
                console.log(`[星阁系统] 集合数据迁移成功: ${oldKey} -> ${newKey}, 迁移${oldMembers.length}个成员`);
            }
        }
        catch (error) {
            console.error(`[星阁系统] 集合数据迁移失败: ${oldKey} -> ${newKey}`, error);
        }
    }
    async getAuctionOfficialTaskKey() {
        const newKeys = this.getNewKeys();
        const oldKeys = this.getOldKeys();
        const newKeyExists = await this.redis.exists(newKeys.AUCTION_OFFICIAL_TASK);
        if (!newKeyExists) {
            await this.migrateData(oldKeys.AUCTION_OFFICIAL_TASK, newKeys.AUCTION_OFFICIAL_TASK);
        }
        return newKeys.AUCTION_OFFICIAL_TASK;
    }
    async getAuctionGroupListKey() {
        const newKeys = this.getNewKeys();
        const oldKeys = this.getOldKeys();
        const newKeyExists = await this.redis.exists(newKeys.AUCTION_GROUP_LIST);
        if (!newKeyExists) {
            await this.migrateSetData(oldKeys.AUCTION_GROUP_LIST, newKeys.AUCTION_GROUP_LIST);
        }
        return newKeys.AUCTION_GROUP_LIST;
    }
    async isGroupAuctionEnabled(groupId) {
        const newKeys = this.getNewKeys();
        const oldKeys = this.getOldKeys();
        const isInNewKey = (await this.redis.sismember(newKeys.AUCTION_GROUP_LIST, groupId)) === 1;
        if (isInNewKey) {
            return true;
        }
        const isInOldKey = (await this.redis.sismember(oldKeys.AUCTION_GROUP_LIST, groupId)) === 1;
        if (isInOldKey) {
            await this.redis.sadd(newKeys.AUCTION_GROUP_LIST, groupId);
            console.log(`[星阁系统] 按需迁移群数据: ${groupId} 从旧key迁移到新key`);
            return true;
        }
        return false;
    }
    async enableGroupAuction(groupId) {
        const groupListKey = await this.getAuctionGroupListKey();
        await this.redis.sadd(groupListKey, groupId);
    }
    async disableGroupAuction(groupId) {
        const groupListKey = await this.getAuctionGroupListKey();
        await this.redis.srem(groupListKey, groupId);
    }
}
const getAuctionKeyManager = () => AuctionKeyManager.getInstance();
function getAuctionKeys(botId) {
    const actualBotId = botId || getAppCofig()?.botId || 'default';
    return {
        AUCTION_OFFICIAL_TASK: keysActionWithBotId.system('auctionofficialtask', actualBotId),
        AUCTION_GROUP_LIST: keysActionWithBotId.system('auctionofficialtask_grouplist', actualBotId)
    };
}

export { AuctionKeyManager, GAME_KEY, KEY_RECORD, KEY_RECORD_TWO, KEY_WORLD_BOOS_STATUS, KEY_WORLD_BOOS_STATUS_TWO, baseKey, getAuctionKeyManager, getAuctionKeys, keysFuzhi };
