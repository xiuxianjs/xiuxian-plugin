// 师徒系统逻辑抽离
import { __PATH } from './keys.js'
import type { ShituRecord } from '../types/model'
import { keys } from './keys.js'
import {
  getDataJSONParseByKey,
  setDataJSONStringifyByKey
} from './DataControl.js'

export async function writeShitu(list: ShituRecord[]) {
  await setDataJSONStringifyByKey(keys.shitu('shitu'), list)
}
export async function readShitu(): Promise<ShituRecord[]> {
  const shitu = await getDataJSONParseByKey(keys.shitu('shitu'))
  return shitu || []
}

export async function fstaddShitu(A: string) {
  let list: ShituRecord[] = []
  try {
    list = await readShitu()
  } catch {
    await writeShitu([])
  }
  const rec: ShituRecord = {
    师傅: A,
    收徒: 0,
    未出师徒弟: 0,
    任务阶段: 0,
    renwu1: 0,
    renwu2: 0,
    renwu3: 0,
    师徒BOOS剩余血量: 100000000,
    已出师徒弟: []
  }
  list.push(rec)
  await writeShitu(list)
}

export async function addShitu(A: string, num: number) {
  let list: ShituRecord[] = []
  try {
    list = await readShitu()
  } catch {
    await writeShitu([])
  }
  let i: number
  for (i = 0; i < list.length; i++)
    if ((list[i] as { A?: string }).A == A) break // 兼容历史错误字段 A
  if (i == list.length) {
    await fstaddShitu(A)
    list = await readShitu()
  }
  list[i].收徒 += num
  await writeShitu(list)
}

export async function findShitu(A: string): Promise<string | false> {
  let list: ShituRecord[] = []
  try {
    list = await readShitu()
  } catch {
    await writeShitu([])
  }
  let i: number
  for (i = 0; i < list.length; i++) if (list[i].师傅 == A) break
  if (i == list.length) return false
  return list[i].师徒 ?? false // 兼容原结构：若不存在则 false
}

export async function findTudi(A: string): Promise<string | false> {
  const list = await readShitu()
  const target = String(A)
  for (let i = 0; i < list.length; i++) {
    if (String(list[i].未出师徒弟) == target) return list[i].师徒 ?? false
  }
  return false
}

export default {
  writeShitu,
  readShitu,
  fstaddShitu,
  addShitu,
  findShitu,
  findTudi
}
