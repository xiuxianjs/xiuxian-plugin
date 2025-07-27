import { readForum, writeForum, addCoin } from '@src/model'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 0 4 * * ?', async () => {
  let Forum
  try {
    Forum = await readForum()
  } catch {
    //没有表要先建立一个！
    await writeForum([])
    Forum = await readForum()
  }
  const now_time = new Date().getTime()
  for (let i = 0; i < Forum.length; i++) {
    const time = (now_time - Forum[i].now_time) / 24 / 60 / 60 / 1000
    if (time < 3) break
    const usr_qq = Forum[i].qq
    const lingshi = Forum[i].whole
    await addCoin(usr_qq, lingshi)
    Forum.splice(i, 1)
    i--
  }
  await writeForum(Forum)
  return false
})
