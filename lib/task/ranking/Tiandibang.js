import { keysLock } from '../../model/keys.js';
import { withLock } from '../../model/locks.js';
import { reSetTiandibang } from '../../model/Tiandibang.js';

const executeBossBattleWithLock = async () => {
    const lockKey = keysLock.task('Tiandibang');
    const result = await withLock(lockKey, async () => {
        await reSetTiandibang();
    }, {
        timeout: 1000 * 25,
        retryDelay: 100,
        maxRetries: 0,
        enableRenewal: true,
        renewalInterval: 1000 * 10
    });
    if (!result.success) {
        logger.warn('Tiandibang lock failed:', result.error);
    }
};
const TiandibangTask = () => {
    const delay = Math.floor(Math.random() * (180 - 60 + 1)) + 60;
    setTimeout(() => {
        void executeBossBattleWithLock();
    }, delay * 1000);
};

export { TiandibangTask };
