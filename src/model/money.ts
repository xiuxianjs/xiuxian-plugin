import { getIoRedis } from '@alemonjs/db'
const GAME_KEY = 'xiuxian@1.3.0:system:money_game'

/**
 * 猜大小
 * @param isBig 是否猜大，true为大，false为小
 * @param inputMoney 输入的金钱
 * @returns [玩家是否赢了, 骰子点数]
 */
export const openMoneySystem = async (
  isBig: boolean,
  inputMoney: number
): Promise<[boolean, number]> => {
  const redis = getIoRedis()
  // 得到当前的总金额
  const totalMoney = await redis.get(GAME_KEY)

  // 必须让玩家输
  const mustCoseResult = async (): Promise<[boolean, number]> => {
    const redis = getIoRedis()
    if (isBig) {
      // 玩家猜大，系统给小点数 [1,3]
      const randomNumber = Math.floor(Math.random() * 3) + 1
      await redis.set(
        GAME_KEY,
        (totalMoney ? Number(totalMoney) : 0) + inputMoney
      )
      return [false, randomNumber]
    }
    // 玩家猜小，系统给大点数 [4,6]
    const randomNumber = Math.floor(Math.random() * 3) + 4
    await redis.set(
      GAME_KEY,
      (totalMoney ? Number(totalMoney) : 0) + inputMoney
    )
    return [false, randomNumber]
  }

  // 必须让玩家赢
  // const mustWinResult = async (): Promise<[boolean, number]> => {
  //   if (isBig) {
  //     // 玩家猜大，系统给大点数 [4,6]
  //     const randomNumber = Math.floor(Math.random() * 3) + 4
  //     await redis.set(
  //       GAME_KEY,
  //       (totalMoney ? Number(totalMoney) : 0) - inputMoney
  //     )
  //     return [true, randomNumber]
  //   }
  //   // 玩家猜小，系统给小点数 [1,3]
  //   const randomNumber = Math.floor(Math.random() * 3) + 1
  //   await redis.set(
  //     GAME_KEY,
  //     (totalMoney ? Number(totalMoney) : 0) - inputMoney
  //   )
  //   return [true, randomNumber]
  // }

  // 正常随机结果
  const randomResult = async (): Promise<[boolean, number]> => {
    const randomNumber = Math.floor(Math.random() * 6) + 1
    const isWin = (isBig && randomNumber > 3) || (!isBig && randomNumber < 4)
    const redis = getIoRedis()
    await redis.set(
      GAME_KEY,
      (totalMoney ? Number(totalMoney) : 0) + (isWin ? -inputMoney : inputMoney)
    )
    return [isWin, randomNumber]
  }

  // 系统: 收益太多限制
  const maxMoney = (Math.floor(Math.random() * 10000) + 10000) * 30000

  // 风控：玩家限制大过最小值
  const minMoney = (Math.floor(Math.random() * 10000) + 10000) * 30000

  // 风控：金额过大时必须必赢
  const isMustWin = inputMoney > minMoney

  // 没有资金记录时
  if (totalMoney === null || totalMoney === undefined) {
    if (isMustWin) return await mustCoseResult()
    return await randomResult()
  }

  const currentMoney = Number(totalMoney)

  // 风控： 如果系统赢超过 一定金额。适当的给玩家赢
  // if (maxMoney < currentMoney) {
  //   // 但是如果想赢的金额。超过系统的最大赔付金额。必须得让玩家输。
  //   if (isMustWin) return await mustCoseResult()
  //   // 否则。就让他一直赢了
  //   return await mustWinResult()
  // }

  // 风控： 如果系统一直在赔钱。赔的太多了。
  // if (currentMoney < -maxMoney) {
  //   // 要把钱赢回来
  //   return await mustCoseResult()
  // }

  // 有资金记录时，判断系统能否赔付
  if (currentMoney < inputMoney) {
    // 超过最大赔付金额，必须让玩家输
    if (isMustWin) return await mustCoseResult()
    // 否则就随机结果
    return await randomResult()
  }

  // 正常情况
  return await randomResult()
}
