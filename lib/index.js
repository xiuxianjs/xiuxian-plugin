import { initPostlog } from './model/posthog.js';
import './task/index.js';

var index = defineChildren({
    onCreated() {
        logger.info('修仙扩展启动');
        initPostlog();
    }
});

export { index as default };
