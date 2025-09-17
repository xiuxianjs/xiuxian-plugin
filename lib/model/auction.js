import { getIoRedis } from '@alemonjs/db';
import { getAppConfig } from './Config.js';
import { keysAction, KEY_AUCTION_GROUP_LIST, KEY_AUCTION_OFFICIAL_TASK } from './keys.js';

class AuctionKeyManager {
    static instance;
    botId;
    redis = getIoRedis();
    constructor() {
        const { botId } = getAppConfig();
        this.botId = botId ?? 'default';
    }
    static getInstance() {
        if (!AuctionKeyManager.instance) {
            AuctionKeyManager.instance = new AuctionKeyManager();
        }
        return AuctionKeyManager.instance;
    }
    getNewKeys() {
        return {
            AUCTION_OFFICIAL_TASK: keysAction.system('auctionofficialtask', this.botId),
            AUCTION_GROUP_LIST: keysAction.system('auctionofficialtask_grouplist', this.botId)
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
                logger.info(`[星阁系统] 数据迁移成功: ${oldKey} -> ${newKey}`);
            }
        }
        catch (error) {
            logger.error(`[星阁系统] 数据迁移失败: ${oldKey} -> ${newKey}`, error);
        }
    }
    async migrateSetData(oldKey, newKey) {
        try {
            const oldMembers = await this.redis.smembers(oldKey);
            if (oldMembers && oldMembers.length > 0) {
                await this.redis.sadd(newKey, ...oldMembers);
                logger.info(`[星阁系统] 集合数据迁移成功: ${oldKey} -> ${newKey}, 迁移${oldMembers.length}个成员`);
            }
        }
        catch (error) {
            logger.error(`[星阁系统] 集合数据迁移失败: ${oldKey} -> ${newKey}`, error);
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
            logger.info(`[星阁系统] 按需迁移群数据: ${groupId} 从旧key迁移到新key`);
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

export { AuctionKeyManager, getAuctionKeyManager };
