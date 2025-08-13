import { readExchange, writeExchange } from '@src/model/trade'
import type { ExchangeEntry } from '@src/types'
import { addNajieThing } from '@src/model/najie'
import { scheduleJob } from 'node-schedule'
import { ExchangeRecord } from '@src/types'

scheduleJob('0 0 4 * * ?', async () => {
  let Exchange: ExchangeRecord[] = []
  try {
    Exchange = await readExchange()
  } catch {
    await writeExchange([])
  }
  const now_time = Date.now()
  // 现行 ExchangeRecord 不含旧逻辑字段，保持向前兼容：若首条具备 now_time/qq 等字段则按旧规则回退
  if (Exchange.length && 'now_time' in Exchange[0]) {
    const list = Exchange as (ExchangeRecord & ExchangeEntry)[]
    for (let i = 0; i < list.length; i++) {
      const rec = list[i] as ExchangeRecord & ExchangeEntry
      if (!('now_time' in rec)) break
      const time = (now_time - rec.now_time) / 24 / 60 / 60 / 1000
      if (time < 3) break
      const usr_qq = rec.qq as string
      const nm = rec.name as ExchangeEntry['name']
      const quanity = rec.aconut as number
      await addNajieThing(usr_qq, nm.name, nm.class, quanity, Number(nm.pinji))
      list.splice(i, 1)
      i--
    }
    await writeExchange(list)
  }
  return false
})
