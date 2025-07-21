import { redis } from 'api/api'
import { __PATH, getTimeStr } from 'model'
import { scheduleJob } from 'node-schedule'
import fs from 'fs'

scheduleJob('0 0 4 * * ?', async () => {
  try {
    console.log('开始备份存档')

    const needSave = [
      'association',
      'Exchange',
      'qinmidu',
      'duanlu',
      'shitu',
      'tiandibang',
      'equipment_path',
      'najie_path',
      'player_path',
      'custom',
      'shop',
      'danyao_path'
    ]

    // [[fn, fn...], ...]
    const readFnameTask = needSave.map(folderName => {
      return fs.promises.readdir(__PATH[folderName])
    })
    const dataFname = await Promise.all(readFnameTask)

    // [[data, data...], ...]
    const readDoneTask = needSave.map((folderName, index) => {
      dataFname[index] = dataFname[index].filter(fn => fn.endsWith('.json'))

      const readTask = dataFname[index].map(fn =>
        fs.promises.readFile(`${__PATH[folderName]}/${fn}`)
      )
      return Promise.all(readTask)
    })
    const dataProm = Promise.all(readDoneTask)
    // 先泡杯茶等等dataProm吧

    // redis
    const redisObj = {}
    const redisKeys = await redis.keys('xiuxian:*')
    const redisTypes = await Promise.all(redisKeys.map(key => redis.type(key)))
    const redisValues = await Promise.all(
      redisKeys.map((key, i) => {
        switch (redisTypes[i]) {
          case 'string':
            return redis.get(key)
          case 'set':
            return redis.smembers(key)
        }
      })
    )
    redisKeys.forEach(
      (key, i) => (redisObj[key] = [redisTypes[i], redisValues[i]])
    )

    // 看看前置工作有没有完成
    if (!fs.existsSync(__PATH.backup)) {
      fs.mkdirSync(__PATH.backup, { recursive: true })
    }

    const nowTimeStamp = Date.now()
    const saveFolder = `${__PATH.backup}/${nowTimeStamp}`
    if (fs.existsSync(saveFolder)) {
      // e?.reply('致命错误...')
      console.error('致命错误...')
      return
    }
    fs.mkdirSync(saveFolder)

    // 好了吗？好了就写到backup
    const saveData = await dataProm
    const finishTask = needSave.map((folderName, index) => {
      fs.mkdirSync(`${saveFolder}/${folderName}`)

      const writeTask = saveData[index].map((sd, i) =>
        fs.promises.writeFile(
          `${saveFolder}/${folderName}/${dataFname[index][i]}`,
          sd
        )
      )
      return Promise.all(writeTask)
    })

    // redis
    fs.writeFileSync(`${saveFolder}/redis.json`, JSON.stringify(redisObj))

    // 尘埃落定了就提示一下
    await Promise.all(finishTask)

    const timeStr = getTimeStr(nowTimeStamp)
    // e?.reply(`存档已备份：${timeStr}`)
    console.log(`存档已备份：${timeStr}`)
    return false
  } catch (err) {
    // await e?.reply(`备份失败，${err}`)
    console.error(`备份失败，${err}`)
    throw err
  }
})
