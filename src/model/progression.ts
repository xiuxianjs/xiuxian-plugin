// 经验/等级通用计算工具
import type { ExpRow, LevelExpState } from '../types/model'

export function applyExp(
  rows: ExpRow[],
  current: LevelExpState,
  delta: number
): LevelExpState {
  if (delta === 0) return current
  let exp = current.exp + delta
  let level = current.level
  while (true) {
    const row = rows.find(r => r.id === level)
    if (!row) break
    if (row.experience > exp) break
    exp -= row.experience
    level += 1
  }
  return { level, exp }
}
