// 师徒系统逻辑抽离
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'

const redis = getIoRedis()

export interface ShituRecord {
  师傅: string
  收徒: number
  未出师徒弟: number
  任务阶段: number
  renwu1: number
  renwu2: number
  renwu3: number
  师徒BOOS剩余血量: number
  已出师徒弟: string[]
}

export async function writeShitu(list: ShituRecord[]) {
  await redis.set(`${__PATH.shitu}:shitu`, JSON.stringify(list))
}
export async function readShitu(): Promise<ShituRecord[]> {
  const shitu = await redis.get(`${__PATH.shitu}:shitu`)
  if (!shitu) return []
  return safeParse(shitu, [])
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
  for (i = 0; i < list.length; i++) if ((list as any)[i].A == A) break // 兼容原始错误字段
  if (i == list.length) {
    await fstaddShitu(A)
    list = await readShitu()
  }
  list[i].收徒 += num
  await writeShitu(list)
}

export async function findShitu(A: string) {
  let list: ShituRecord[] = []
  try {
    list = await readShitu()
  } catch {
    await writeShitu([])
  }
  let i: number
  for (i = 0; i < list.length; i++) if (list[i].师傅 == A) break
  if (i == list.length) return false
  return (list as any)[i].师徒 // 兼容原结构
}

export async function findTudi(A: string) {
  const list = await readShitu()
  const target = String(A)
  for (let i = 0; i < list.length; i++) {
    if (String((list as any)[i].未出师徒弟) == target)
      return (list as any)[i].师徒
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
