import { readExchange, writeExchange } from '@src/model/trade'

interface ExchangeEntry {
  now_time: number
  qq: string
  aconut: number
  name: { name: string; class: string; pinji?: string; [k: string]: unknown }
}
import { addNajieThing } from '@src/model/najie'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 0 4 * * ?', async () => {
  let Exchange: ExchangeEntry[] = []
  try {
    Exchange = await readExchange()
  } catch {
    await writeExchange([])
  }
  const now_time = new Date().getTime()
  for (let i = 0; i < Exchange.length; i++) {
    const time = (now_time - Exchange[i].now_time) / 24 / 60 / 60 / 1000
    if (time < 3) break
    const usr_qq = Exchange[i].qq
    let thing: string | ExchangeEntry['name'] = Exchange[i].name.name
    const quanity = Exchange[i].aconut
    if (Exchange[i].name.class == '装备' || Exchange[i].name.class == '仙宠') {
      thing = Exchange[i].name
    }
    await addNajieThing(
      usr_qq,
      typeof thing === 'string' ? thing : thing.name,
      Exchange[i].name.class,
      quanity,
      Exchange[i].name.pinji
    )
    Exchange.splice(i, 1)
    i--
  }
  await writeExchange(Exchange)
  return false
})
