import { redis } from '../api/api.js';

const incrbyMoney = (money) => {
    redis.incrby('xiuxian@1.3.0:total:money', money);
};
const decrbyMoney = (money) => {
    redis.decrby('xiuxian@1.3.0:total:money', money);
};

export { decrbyMoney, incrbyMoney };
