import { initPostlog } from './model/posthog.js';
import { initDefaultAdmin } from './route/core/auth.js';
import './task/index.js';

var index = defineChildren({
    onCreated() {
        logger.info('修仙扩展启动');
        initPostlog();
        initDefaultAdmin();
    }
});

export { index as default };
