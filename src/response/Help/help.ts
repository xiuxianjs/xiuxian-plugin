import { puppeteer } from '@src/api/api'
import md5 from 'md5'

const helpData = {
  img: null,
  md5: ''
}
export async function cache(data, user_id) {
  let tmp = md5(JSON.stringify(data))
  if (helpData.md5 == tmp) return helpData.img
  helpData.img = await puppeteer.screenshot('help', user_id, data)
  helpData.md5 = tmp
  return helpData.img
}
