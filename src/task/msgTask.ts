import { puppeteer, pushInfo } from '@src/model/api'
// 细粒度导入避免 barrel 循环
import { readTemp, writeTemp } from '@src/model/temp'
import { scheduleJob } from 'node-schedule'

scheduleJob('20 0/5 * * * ?', async () => {
  let temp = []
  try {
    temp = await readTemp()
  } catch {
    await writeTemp([])
  }
  if (temp.length > 0) {
    const group = []
    group.push(temp[0].qq_group)
    f1: for (const i of temp) {
      for (const j of group) {
        if (i.qq_group == j) continue f1
      }
      group.push(i.qq_group)
    }
    for (const i of group) {
      const msg = []
      for (const j of temp) {
        if (i == j.qq_group) {
          msg.push(j.msg)
        }
      }
      const temp_data = {
        temp: msg
      }

      const img = await puppeteer.screenshot('temp', i, temp_data)
      if (img) await pushInfo(i, true, img)
    }
    await writeTemp([])
  }
})
