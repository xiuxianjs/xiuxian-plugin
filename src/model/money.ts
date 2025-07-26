/**
 * 记录系统转了多少钱。陪了多少钱。
 * 达到收入和支出都是 无限接近 1:1 的状态。
 * 才算是 50%的概率，而不是 随机 1-6。
 */

import { redis } from '@src/api/api'

/**
 * 增加总金额
 * @param money
 */
export const incrbyMoney = (money: number) => {
  redis.incrby('xiuxian@1.3.0:total:money', money)
}

/**
 * 减少总金额
 * @param money
 */
export const decrbyMoney = (money: number) => {
  redis.decrby('xiuxian@1.3.0:total:money', money)
}
