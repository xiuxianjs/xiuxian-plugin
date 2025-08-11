// 玩家效率/收益相关逻辑抽取
import { readPlayer, addConFaByUser } from './xiuxian_impl.js'
import data from './XiuxianData.js'
import type { Player } from '../types/player.js'
export { addConFaByUser }
import type { PlayerEfficiencyResult, EfficiencyFactors } from '../types/model'

function calcTalentMultiplier(p: Player): number {
  const t = p.灵根?.type || ''
  switch (t) {
    case '天灵根':
      return 1.35
    case '真灵根':
      return 1.2
    case '伪灵根':
      return 1.05
    case '圣体':
      return 1.5
    default:
      return 1
  }
}

function calcGongfaMultiplier(p: Player): number {
  if (!Array.isArray(p.学习的功法)) return 1
  // 每本功法给 3% 加成（示例），品级含“仙”“圣”再额外加
  let base = 1
  for (const name of p.学习的功法) {
    if (typeof name !== 'string') continue
    base *= 1.03
    const info = data.gongfa_list.find(g => g.name === name)
    if (info?.品级?.includes('仙')) base *= 1.04
    if (info?.品级?.includes('圣')) base *= 1.06
  }
  return base
}

function calcPetMultiplier(p: Player): number {
  if (!p.仙宠) return 1
  if (p.仙宠.type === '修炼') return 1 + (p.仙宠.加成 || 0)
  return 1
}

function calcLuckyMultiplier(p: Player): number {
  const lucky = Number(p.幸运 || 0)
  if (!lucky) return 1
  // 上限 30%（线性 100 幸运 = 10%）
  const add = Math.min(0.3, lucky / 1000)
  return 1 + add
}

function assembleFactors(p: Player): EfficiencyFactors {
  // level 与 physique 直接按境界 id 微增（示例：每级 0.5%）
  const levelMul = 1 + (p.level_id || 0) * 0.005
  const physiqueMul = 1 + (p.Physique_id || 0) * 0.004
  const talentMul = calcTalentMultiplier(p)
  const gongfaMul = calcGongfaMultiplier(p)
  const petMul = calcPetMultiplier(p)
  const luckyMul = calcLuckyMultiplier(p)
  const customMul = 1 + (p.修炼效率提升 || 0)
  return {
    levelMul,
    physiqueMul,
    talentMul,
    gongfaMul,
    petMul,
    luckyMul,
    customMul
  }
}

function combineMul(f: EfficiencyFactors) {
  return (
    f.levelMul *
    f.physiqueMul *
    f.talentMul *
    f.gongfaMul *
    f.petMul *
    f.luckyMul *
    f.customMul
  )
}

export async function playerEfficiency(
  userId: string
): Promise<PlayerEfficiencyResult> {
  const player = await readPlayer(userId)
  if (!player)
    return {
      灵石每小时: 0,
      修为每小时: 0,
      阴德每小时: 0,
      公式: { 灵石: '0', 修为: '0', 阴德: '0' }
    }
  const factors = assembleFactors(player)
  const mul = combineMul(factors)
  // 基础值：按境界等级查表，若找不到给默认常数
  const levelInfo = data.Level_list.find(
    l => l.level_id === player.level_id
  ) || { exp: 100, level_id: player.level_id }
  const base修为 = Number(levelInfo.exp) / 10 // 基础修为/小时
  const base灵石 = 50 + player.level_id * 5 // 示例：基础灵石/小时
  const base阴德 = 5 + player.level_id * 0.2 // 示例：基础阴德/小时
  const 修为每小时 = Math.trunc(base修为 * mul)
  const 灵石每小时 = Math.trunc(base灵石 * mul)
  const 阴德每小时 = Math.trunc(base阴德 * mul ** 0.5) // 阴德增长稍缓
  const 公式 = {
    灵石: `${base灵石.toFixed(1)} * ${mul.toFixed(3)}`,
    修为: `${base修为.toFixed(1)} * ${mul.toFixed(3)}`,
    阴德: `${base阴德.toFixed(1)} * ${(mul ** 0.5).toFixed(3)}`
  }
  return { 灵石每小时, 修为每小时, 阴德每小时, 公式 }
}

export default { playerEfficiency }
