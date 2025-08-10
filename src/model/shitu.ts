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
  // 原逻辑中 findShitu / findTudi 访问的 "师徒" 字段（未在新增记录里写入），保持可选以兼容旧数据
  师徒?: string
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
  for (i = 0; i < list.length; i++)
    if ((list[i] as unknown as { A?: string }).A == A) break // 兼容历史错误字段 A
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
