import fs from 'node:fs'
import path from 'path'
import { AppName } from '../../app.config.js'
export const toIndex = async (indexName) => {
  const firstName = `plugins/${AppName}`
  const filepath = `./${firstName}/${indexName}`
  const name = []
  const sum = []
  const travel = (dir, callback) => {
    for (let file of fs.readdirSync(dir)) {
      if (file.search('.js') != -1) {
        name.push(file.replace('.js', ''))
      }
      let pathname = path.join(dir, file)
      if (fs.statSync(pathname).isDirectory()) {
        travel(pathname, callback)
      } else {
        callback(pathname)
      }
    }
  }
  travel(filepath, (path) => {
    if (path.search('.js') != -1) {
      sum.push(path)
    }
  })
  let apps = {}
  for (let item of sum) {
    let address = `../..${item.replace(/\\/g, '/').replace(`${firstName}`, '')}`
    let allExport = await import(address)
    let keys = Object.keys(allExport)
    for (let key of keys) {
      if (allExport[key].prototype) {
        if (apps.hasOwnProperty(key)) {
          logger.info(`Template detection:已经存在class ${key}同名导出\n    ${address}`)
        }
        apps[key] = allExport[key]
      } else {
        logger.info(`Template detection:存在非class属性${key}导出\n    ${address}`)
      }
    }
  }
  return apps
}