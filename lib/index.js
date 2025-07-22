import './task/index.js';

var index = defineChildren({
    onCreated() {
        logger.info('修仙扩展启动');
    }
});

export { index as default };
