import { getAppCofig } from './Config';
import { getIoRedis } from '@alemonjs/db';

// 基础 Redis Key 前缀
export const baseKey = 'xiuxian@1.3.0';

const keysAction = {
  system: (id: string) => `${baseKey}:system:${id}`
};

/**
 * 带botId的系统key生成器，用于多机器人部署
 * @param botId 机器人ID
 * @param id key标识符
 * @returns 带botId的系统key
 */
const keysActionWithBotId = {
  system: (id: string, botId: string) => `${baseKey}:system:${id}_${botId}`
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

// 星阁 - 旧版本key（兼容性保留，仅内部使用）
const KEY_AUCTION_GROUP_LIST = keysAction.system('auctionofficialtask_grouplist');
const KEY_AUCTION_OFFICIAL_TASK = keysAction.system('auctionofficialtask');

/**
 * 星阁系统Redis Key管理器
 * 统一管理星阁相关的Redis key，支持多机器人部署和旧数据自动迁移
 */
export class AuctionKeyManager {
  private static instance: AuctionKeyManager;
  private botId: string;
  private redis = getIoRedis();

  private constructor() {
    const { botId } = getAppCofig();

    this.botId = botId || 'default';
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): AuctionKeyManager {
    if (!AuctionKeyManager.instance) {
      AuctionKeyManager.instance = new AuctionKeyManager();
    }

    return AuctionKeyManager.instance;
  }

  /**
   * 获取新版本的key（带botId）
   */
  private getNewKeys() {
    return {
      AUCTION_OFFICIAL_TASK: keysActionWithBotId.system('auctionofficialtask', this.botId),
      AUCTION_GROUP_LIST: keysActionWithBotId.system('auctionofficialtask_grouplist', this.botId)
    };
  }

  /**
   * 获取旧版本的key（不带botId）
   */
  private getOldKeys() {
    return {
      AUCTION_OFFICIAL_TASK: KEY_AUCTION_OFFICIAL_TASK,
      AUCTION_GROUP_LIST: KEY_AUCTION_GROUP_LIST
    };
  }

  /**
   * 数据迁移：从旧key迁移数据到新key
   * @param oldKey 旧key
   * @param newKey 新key
   */
  private async migrateData(oldKey: string, newKey: string): Promise<void> {
    try {
      // 检查旧key是否存在数据
      const oldData = await this.redis.get(oldKey);

      if (oldData) {
        // 将数据迁移到新key
        await this.redis.set(newKey, oldData);
        console.log(`[星阁系统] 数据迁移成功: ${oldKey} -> ${newKey}`);

        // 可选：删除旧key（谨慎操作，建议先备份）
        // await this.redis.del(oldKey);
      }
    } catch (error) {
      console.error(`[星阁系统] 数据迁移失败: ${oldKey} -> ${newKey}`, error);
    }
  }

  /**
   * 数据迁移：从旧key迁移集合数据到新key
   * @param oldKey 旧key
   * @param newKey 新key
   */
  private async migrateSetData(oldKey: string, newKey: string): Promise<void> {
    try {
      // 检查旧key是否存在数据
      const oldMembers = await this.redis.smembers(oldKey);

      if (oldMembers && oldMembers.length > 0) {
        // 将集合数据迁移到新key
        await this.redis.sadd(newKey, ...oldMembers);
        console.log(
          `[星阁系统] 集合数据迁移成功: ${oldKey} -> ${newKey}, 迁移${oldMembers.length}个成员`
        );

        // 可选：删除旧key（谨慎操作，建议先备份）
        // await this.redis.del(oldKey);
      }
    } catch (error) {
      console.error(`[星阁系统] 集合数据迁移失败: ${oldKey} -> ${newKey}`, error);
    }
  }

  /**
   * 获取星阁官方任务key，支持自动数据迁移
   */
  public async getAuctionOfficialTaskKey(): Promise<string> {
    const newKeys = this.getNewKeys();
    const oldKeys = this.getOldKeys();

    // 检查新key是否存在数据
    const newKeyExists = await this.redis.exists(newKeys.AUCTION_OFFICIAL_TASK);

    if (!newKeyExists) {
      // 新key不存在，尝试从旧key迁移数据
      await this.migrateData(oldKeys.AUCTION_OFFICIAL_TASK, newKeys.AUCTION_OFFICIAL_TASK);
    }

    return newKeys.AUCTION_OFFICIAL_TASK;
  }

  /**
   * 获取星阁群组列表key，支持自动数据迁移
   */
  public async getAuctionGroupListKey(): Promise<string> {
    const newKeys = this.getNewKeys();
    const oldKeys = this.getOldKeys();

    // 检查新key是否存在数据
    const newKeyExists = await this.redis.exists(newKeys.AUCTION_GROUP_LIST);

    if (!newKeyExists) {
      // 新key不存在，尝试从旧key迁移集合数据
      await this.migrateSetData(oldKeys.AUCTION_GROUP_LIST, newKeys.AUCTION_GROUP_LIST);
    }

    return newKeys.AUCTION_GROUP_LIST;
  }

  /**
   * 检查群是否开启星阁（支持按需数据迁移）
   * @param groupId 群ID
   */
  public async isGroupAuctionEnabled(groupId: string): Promise<boolean> {
    const newKeys = this.getNewKeys();
    const oldKeys = this.getOldKeys();

    // 1. 先检查新key中是否有该群ID
    const isInNewKey = (await this.redis.sismember(newKeys.AUCTION_GROUP_LIST, groupId)) === 1;

    if (isInNewKey) {
      return true;
    }

    // 2. 如果新key中没有，再检查旧key中是否有该群ID
    const isInOldKey = (await this.redis.sismember(oldKeys.AUCTION_GROUP_LIST, groupId)) === 1;

    if (isInOldKey) {
      // 3. 如果旧key中有该群ID，则将该群ID迁移到新key中
      await this.redis.sadd(newKeys.AUCTION_GROUP_LIST, groupId);
      console.log(`[星阁系统] 按需迁移群数据: ${groupId} 从旧key迁移到新key`);

      return true;
    }

    // 4. 新旧key中都没有，返回false
    return false;
  }

  /**
   * 开启群星阁
   * @param groupId 群ID
   */
  public async enableGroupAuction(groupId: string): Promise<void> {
    const groupListKey = await this.getAuctionGroupListKey();

    await this.redis.sadd(groupListKey, groupId);
  }

  /**
   * 关闭群星阁
   * @param groupId 群ID
   */
  public async disableGroupAuction(groupId: string): Promise<void> {
    const groupListKey = await this.getAuctionGroupListKey();

    await this.redis.srem(groupListKey, groupId);
  }
}

/**
 * 获取星阁key管理器实例
 */
export const getAuctionKeyManager = () => AuctionKeyManager.getInstance();

/**
 * 兼容性函数：获取带botId的星阁相关key（已废弃，建议使用AuctionKeyManager）
 * @deprecated 请使用 getAuctionKeyManager() 替代
 */
export function getAuctionKeys(botId?: string) {
  const actualBotId = botId || getAppCofig()?.botId || 'default';

  return {
    AUCTION_OFFICIAL_TASK: keysActionWithBotId.system('auctionofficialtask', actualBotId),
    AUCTION_GROUP_LIST: keysActionWithBotId.system('auctionofficialtask_grouplist', actualBotId)
  };
}
