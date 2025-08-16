import { initPostlog } from './model/posthog.js';
import { initDefaultAdmin } from './route/core/auth.js';
import { startAllTasks } from './task/index.js';

var index = defineChildren({
    onCreated() {
        logger.info('修仙扩展启动');
        initPostlog();
        initDefaultAdmin();
        startAllTasks().catch(error => {
            logger.error('启动定时任务失败:', error);
        });
    }
});

export { index as default };
