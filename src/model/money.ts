import { redis } from '@src/api/api'

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
  // 得到当前的总金额
  const totalMoney = await redis.get(GAME_KEY)

  // 必须让玩家输
  const mustWinResult = async (): Promise<[boolean, number]> => {
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

  // 正常随机结果
  const randomResult = async (): Promise<[boolean, number]> => {
    const randomNumber = Math.floor(Math.random() * 6) + 1
    const isWin = (isBig && randomNumber > 3) || (!isBig && randomNumber < 4)
    await redis.set(
      GAME_KEY,
      (totalMoney ? Number(totalMoney) : 0) + (isWin ? -inputMoney : inputMoney)
    )
    return [isWin, randomNumber]
  }

  // 风控：金额过大时必须必赢
  const isMustWin =
    inputMoney > (Math.floor(Math.random() * 51) + 50) * 1000 * 10

  // 没有资金记录时
  if (totalMoney === null || totalMoney === undefined) {
    if (isMustWin) return await mustWinResult()
    return await randomResult()
  }

  // 有资金记录时，判断系统能否赔付
  const currentMoney = Number(totalMoney)
  if (currentMoney < inputMoney) {
    const isMustWinMin =
      inputMoney > (Math.floor(Math.random() * 20) + 20) * 1000 * 10
    if (currentMoney < -1000 * 1000 * 10 && isMustWinMin)
      return await mustWinResult()
    if (isMustWin) return await mustWinResult()
    return await randomResult()
  }

  // 正常情况
  return await randomResult()
}
