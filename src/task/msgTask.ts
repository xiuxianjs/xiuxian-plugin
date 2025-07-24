import { puppeteer, pushInfo } from '@src/api/api'
import { Read_temp, Write_temp } from '@src/model'
import { scheduleJob } from 'node-schedule'

scheduleJob('20 0/5 * * * ?', async () => {
  let temp
  try {
    temp = await Read_temp()
  } catch {
    await Write_temp([])
    temp = await Read_temp()
  }
  if (temp.length > 0) {
    let group = []
    group.push(temp[0].qq_group)
    f1: for (let i of temp) {
      for (let j of group) {
        if (i.qq_group == j) continue f1
      }
      group.push(i.qq_group)
    }
    for (let i of group) {
      let msg = []
      for (let j of temp) {
        if (i == j.qq_group) {
          msg.push(j.msg)
        }
      }
      let temp_data = {
        temp: msg
      }

      let img = await puppeteer.screenshot('temp', i.qq, temp_data)
      const [platform, group_id] = i.split(':')
      if (img) await pushInfo(platform, group_id, true, img)
    }
    await Write_temp([])
  }
})
