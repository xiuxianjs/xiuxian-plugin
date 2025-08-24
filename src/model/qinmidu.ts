// 亲密度与婚姻逻辑抽离
import { getIoRedis } from '@alemonjs/db'
import { __PATH } from './keys.js'
import { safeParse } from './utils/safe.js'
import type { QinmiduRecord } from '../types/model'
import { keys } from './keys.js'

export async function readQinmidu(): Promise<QinmiduRecord[]> {
  const redis = getIoRedis()
  const qinmidu = await redis.get(keys.qinmidu('qinmidu'))
  if (!qinmidu) return []
  return safeParse(qinmidu, [])
}

export async function writeQinmidu(qinmidu: QinmiduRecord[]) {
  const redis = getIoRedis()
  await redis.set(keys.qinmidu('qinmidu'), JSON.stringify(qinmidu))
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
  const QQ: string[] = []
  for (i = 0; i < list.length; i++) {
    if (list[i].QQ_A == A || list[i].QQ_A == B) {
      if (list[i].婚姻 != 0) {
        // 原逻辑是错误地把 push 当作属性赋值，这里直接 push
        QQ.push(list[i].QQ_B)
        break
      }
    } else if (list[i].QQ_B == A || list[i].QQ_B == B) {
      if (list[i].婚姻 != 0) {
        QQ.push(list[i].QQ_A)
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

// 查询道侣亲密度
export async function findDaolvQinmidu(A: string) {
  let list: QinmiduRecord[] = []
  try {
    list = await readQinmidu()
  } catch {
    await writeQinmidu([])
  }
  for (let i = 0; i < list.length; i++) {
    if ((list[i].QQ_A == A || list[i].QQ_B == A) && list[i].婚姻 != 0) {
      return list[i].亲密度
    }
  }
  return 0
}

/**
 * 查询A是否有婚姻
 * @param A
 * @returns 有婚返回对方QQ，无婚返回空字符串
 */
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
