import './task/index.js';

var index = defineChildren({
    onCreated() {
        logger.info('修仙机器人开启');
    }
});

export { index as default };
