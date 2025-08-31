import { getConfig, getDataJSONParseByKey, getDataList } from '@src/model';
import { __PATH, keysAction, keysByPath, keysLock } from '@src/model/keys';
import { withLock } from '@src/model/locks';
import { handelAction as handelActionMojie } from '../../model/actions/mojietask';
import { handelAction as handelActionOccupation } from '../../model/actions/OccupationTask';
import { handelAction as handelActionPlayerControl } from '../../model/actions/PlayerControlTask';
import { handelAction as handelActionSecretPlace } from '../../model/actions/SecretPlaceTask';
import { handelAction as handelActionSecretPlaceplus } from '../../model/actions/SecretPlaceplusTask';
import { handelAction as handelActionShenjie } from '../../model/actions/shenjietask';
import { handelAction as handelActionTaopaotask } from '../../model/actions/Taopaotask';
import { handelAction as handelActionXijie } from '../../model/actions/Xijietask';

/**
 * todo
 * 后续需要确保。在task进行完成后。直接del掉。
 * 避免task过大。
 */

/**
 * 处理用户actions
 */
const startTask = async (): Promise<void> => {
  try {
    const playerList = await keysByPath(__PATH.player_path);

    if (!playerList || playerList.length === 0) {
      return;
    }

    // 读取必要的任务数据
    const npcList = await getDataList('NPC');
    const monsterList = await getDataList('Monster');
    const config = await getConfig('xiuxian', 'xiuxian');

    // tudo 待优化该数据
    const mojieDataList = await getDataList('Mojie');
    const shenjieData = await getDataList('Shenjie');

    for (const playerId of playerList) {
      try {
        const action = await getDataJSONParseByKey(keysAction.action(playerId));

        if (!action) {
          continue;
        }

        // mojie
        void handelActionMojie(playerId, action, { mojieDataList });
        // occupation
        void handelActionOccupation(playerId, action);
        // playerControl
        void handelActionPlayerControl(playerId, action, { config });
        // secretPlace
        void handelActionSecretPlace(playerId, action, { monsterList, config });
        // secretPlaceplus
        void handelActionSecretPlaceplus(playerId, action, { monsterList, config });
        // shenjie
        void handelActionShenjie(playerId, action, { shenjieData });
        // taopaotask
        void handelActionTaopaotask(playerId, action, { npcList });
        // xijie
        void handelActionXijie(playerId, action, { npcList });

        // 根据 actoin类型来处理。
      } catch (error) {
        logger.error(error);
      }
    }
  } catch (error) {
    logger.error(error);
  }
};

const executeBossBattleWithLock = () => {
  const lockKey = keysLock.task('ActionsTask');

  return withLock(
    lockKey,
    async () => {
      await startTask();
    },
    {
      timeout: 1000 * 25, // 25秒超时
      retryDelay: 100, // 100ms重试间隔
      maxRetries: 0, // 不重试
      enableRenewal: true, // 启用锁续期
      renewalInterval: 1000 * 10 // 10秒续期间隔
    }
  );
};

export const ActionsTask = () => {
  // 随机 延迟 [5,35] 秒再执行。
  const delay = Math.floor(Math.random() * (35 - 5 + 1)) + 5;

  setTimeout(() => {
    void executeBossBattleWithLock();
  }, delay * 1000);
};
