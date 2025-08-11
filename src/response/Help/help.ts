import { screenshot } from '@src/image'
import { mkdirSync, writeFileSync } from 'fs'
import md5 from 'md5'

const helpData = {
  img: null,
  md5: ''
}
export async function cache(data, user_id) {
  const tmp = md5(JSON.stringify(data))
  if (helpData.md5 == tmp) return helpData.img
  if (process.env.NODE_ENV === 'development') {
    const dir = './views'
    mkdirSync(dir, { recursive: true })
    writeFileSync(`${dir}/help.json`, JSON.stringify(data, null, 2))
  }
  helpData.img = await screenshot('help', user_id, data)
  helpData.md5 = tmp
  return helpData.img
}
