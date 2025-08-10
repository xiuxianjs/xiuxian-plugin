import { readExchange, writeExchange } from '@src/model/trade'
import { type ExchangeRecord } from '@src/model/trade'
import type { ExchangeEntry } from '@src/types/task'
import { addNajieThing } from '@src/model/najie'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 0 4 * * ?', async () => {
  let Exchange: ExchangeRecord[] = []
  try {
    Exchange = await readExchange()
  } catch {
    await writeExchange([])
  }
  const now_time = new Date().getTime()
  // 现行 ExchangeRecord 不含旧逻辑字段，保持向前兼容：若首条具备 now_time/qq 等字段则按旧规则回退
  if (Exchange.length && 'now_time' in (Exchange[0] as any)) {
    const list = Exchange as unknown as (ExchangeRecord & ExchangeEntry)[]
    for (let i = 0; i < list.length; i++) {
      const rec = list[i] as ExchangeRecord & ExchangeEntry
      if (!('now_time' in rec)) break
      const time = (now_time - (rec as any).now_time) / 24 / 60 / 60 / 1000
      if (time < 3) break
      const usr_qq = (rec as any).qq as string
      const nm = (rec as any).name as ExchangeEntry['name']
      const quanity = (rec as any).aconut as number
      await addNajieThing(usr_qq, nm.name, nm.class as any, quanity, nm.pinji)
      list.splice(i, 1)
      i--
    }
    await writeExchange(list)
  }
  return false
})
