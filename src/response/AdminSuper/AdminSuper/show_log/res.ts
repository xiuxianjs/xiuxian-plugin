import { Image, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { Read_updata_log } from '@src/model'
import { Show, puppeteer } from '@src/api/api'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)查看日志$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  {
    let j
    const reader = await Read_updata_log()
    let str = []
    let line_log = reader.trim().split('\n') //读取数据并按行分割
    line_log.forEach((item, index) => {
      // 删除空项
      if (!item) {
        line_log.splice(index, 1)
      }
    })
    for (let y = 0; y < line_log.length; y++) {
      let temp = line_log[y].trim().split(/\s+/) //读取数据并按空格分割
      let i = 0
      if (temp.length == 4) {
        str.push(temp[0])
        i = 1
      }
      let t = ''
      for (let x = i; x < temp.length; x++) {
        t += temp[x]
        //console.log(t)
        if (x == temp.length - 2 || x == temp.length - 3) {
          t += '\t'
        }
      }
      str.push(t)
      //str += "\n";
    }
    let T
    for (j = 0; j < str.length / 2; j++) {
      T = str[j]
      str[j] = str[str.length - 1 - j]
      str[str.length - 1 - j] = T
    }
    for (j = str.length - 1; j > -1; j--) {
      if (str[j] == '零' || str[j] == '打铁的') {
        let m = j
        while (str[m - 1] != '零' && str[m - 1] != '打铁的' && m > 0) {
          T = str[m]
          str[m] = str[m - 1]
          str[m - 1] = T
          m--
        }
      }
    }
    let log_data = { log: str }
    const data1 = await new Show(e).get_logData(log_data)
    let img = await puppeteer.screenshot('log', e.UserId, { ...data1 })
    if (img) Send(Image(img))
    return false
  }
})
