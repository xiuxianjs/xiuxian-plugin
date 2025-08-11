import type { DanyaoStatus } from '@src/types'

/**
 * 将 readDanyao 返回的 DanyaoItem[]（或历史混合结构）映射为旧版药效聚合状态对象。
 * 旧逻辑依赖对象属性：biguan/biguanxl/xingyun/lianti/ped/modao/beiyong1~5
 * 若未来需要新增字段，可在 base 中补充，并保持遍历更新逻辑。
 */
export function mapDanyaoArrayToStatus(list: unknown): DanyaoStatus {
  const base: DanyaoStatus = {
    biguan: 0,
    biguanxl: 0,
    xingyun: 0,
    lianti: 0,
    ped: 0,
    modao: 0,
    beiyong1: 0,
    beiyong2: 0,
    beiyong3: 0,
    beiyong4: 0,
    beiyong5: 0
  }
  if (Array.isArray(list)) {
    for (const item of list) {
      if (item && typeof item === 'object') {
        for (const k of Object.keys(base) as Array<keyof DanyaoStatus>) {
          const v = (item as Record<string, unknown>)[k]
          if (typeof v === 'number') base[k] = v
        }
      }
    }
  }
  return base
}
