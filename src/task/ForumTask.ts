import { Read_Forum, Write_Forum, Add_灵石 } from 'model'
import { scheduleJob } from 'node-schedule'

scheduleJob('0 0 4 * * ?', async () => {
  let Forum
  try {
    Forum = await Read_Forum()
  } catch {
    //没有表要先建立一个！
    await Write_Forum([])
    Forum = await Read_Forum()
  }
  const now_time = new Date().getTime()
  for (let i = 0; i < Forum.length; i++) {
    const time = (now_time - Forum[i].now_time) / 24 / 60 / 60 / 1000
    if (time < 3) break
    const usr_qq = Forum[i].qq
    const lingshi = Forum[i].whole
    await Add_灵石(usr_qq, lingshi)
    Forum.splice(i, 1)
    i--
  }
  await Write_Forum(Forum)
  return false
})
