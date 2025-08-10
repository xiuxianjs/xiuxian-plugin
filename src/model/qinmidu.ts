/* eslint-disable @typescript-eslint/no-explicit-any */
// 亲密度与婚姻逻辑抽离
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './paths.js'
import { safeParse } from './utils/safe.js'

const redis = getIoRedis()

export interface QinmiduRecord {
  QQ_A: string
  QQ_B: string
  亲密度: number
  婚姻: number // 0 未婚 1 已婚 (原逻辑保持)
}

export async function readQinmidu(): Promise<QinmiduRecord[]> {
  const qinmidu = await redis.get(`${__PATH.qinmidu}:qinmidu`)
  if (!qinmidu) return []
  return safeParse(qinmidu, [])
}

export async function writeQinmidu(qinmidu: QinmiduRecord[]) {
  await redis.set(`${__PATH.qinmidu}:qinmidu`, JSON.stringify(qinmidu))
}

export async function fstaddQinmidu(A: string, B: string) {
  let list: QinmiduRecord[] = []
  try {
    list = await readQinmidu()
  } catch {
    await writeQinmidu([])
  }
  const rec: QinmiduRecord = { QQ_A: A, QQ_B: B, 亲密度: 0, 婚姻: 0 }
  list.push(rec)
  await writeQinmidu(list)
}

export async function addQinmidu(A: string, B: string, qinmi: number) {
  let list: QinmiduRecord[] = []
  try {
    list = await readQinmidu()
  } catch {
    await writeQinmidu([])
  }
  let i: number
  for (i = 0; i < list.length; i++) {
    if (
      (list[i].QQ_A == A && list[i].QQ_B == B) ||
      (list[i].QQ_A == B && list[i].QQ_B == A)
    ) {
      break
    }
  }
  if (i == list.length) {
    await fstaddQinmidu(A, B)
    list = await readQinmidu()
  }
  list[i].亲密度 += qinmi
  await writeQinmidu(list)
}

export async function findQinmidu(A: string, B: string) {
  let list: QinmiduRecord[] = []
  try {
    list = await readQinmidu()
  } catch {
    await writeQinmidu([])
  }
  let i: number
  const QQ: any[] = []
  for (i = 0; i < list.length; i++) {
    if (list[i].QQ_A == A || list[i].QQ_A == B) {
      if (list[i].婚姻 != 0) {
        ;(QQ as any).push = list[i].QQ_B // 保持原始逻辑 bug 兼容
        break
      }
    } else if (list[i].QQ_B == A || list[i].QQ_B == B) {
      if (list[i].婚姻 != 0) {
        ;(QQ as any).push = list[i].QQ_A
        break
      }
    }
  }
  for (i = 0; i < list.length; i++) {
    if (
      (list[i].QQ_A == A && list[i].QQ_B == B) ||
      (list[i].QQ_A == B && list[i].QQ_B == A)
    ) {
      break
    }
  }
  if (i == list.length) return false
  else if (QQ.length != 0) return 0
  else return list[i].亲密度
}

// 查询 A 的婚姻；有则返回对方 QQ，无则空字符串
export async function existHunyin(A: string) {
  let list: QinmiduRecord[] = []
  try {
    list = await readQinmidu()
  } catch {
    await writeQinmidu([])
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].QQ_A == A) {
      if (list[i].婚姻 != 0) return list[i].QQ_B
    } else if (list[i].QQ_B == A) {
      if (list[i].婚姻 != 0) return list[i].QQ_A
    }
  }
  return ''
}

export default {
  readQinmidu,
  writeQinmidu,
  fstaddQinmidu,
  addQinmidu,
  findQinmidu,
  existHunyin
}
