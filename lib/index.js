import { initPostlog } from './model/posthog.js';
import { initDefaultAdmin } from './route/core/auth.js';
import { startTask } from './task/index.js';
import { startScheduledTasks } from './task/Scheduler.js';

var index = defineChildren({
    onCreated() {
        logger.info('修仙扩展启动');
        initPostlog();
        initDefaultAdmin();
        startTask();
        startScheduledTasks().catch(error => {
            console.error('启动定时任务失败:', error);
        });
    }
});

export { index as default };
