// 玩家效率/收益相关逻辑抽取
import { readPlayer, addConFaByUser } from './xiuxian_impl.js'
export { addConFaByUser }

export interface PlayerEfficiencyResult {
  灵石每小时: number
  修为每小时: number
  阴德每小时: number
}

// 占位实现：需要依据原逻辑补全
export async function playerEfficiency(
  userId: string
): Promise<PlayerEfficiencyResult> {
  const player = await readPlayer(userId)
  void player // 占位使用，后续将使用 player 真实数据计算
  // TODO: 使用 player 的境界/功法/灵根等属性计算真实效率
  return {
    灵石每小时: 0,
    修为每小时: 0,
    阴德每小时: 0
  }
}

export default { playerEfficiency }
