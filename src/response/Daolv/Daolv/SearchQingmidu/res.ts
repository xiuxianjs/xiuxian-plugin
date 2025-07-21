import { Text, useSend, createSelects } from 'alemonjs'
import fs from 'fs'
import { createEventName } from '@src/response/util'
import { __PATH, find_qinmidu, sleep } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)查询亲密度$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let A = e.UserId
  /*
            @xxx
            -----qq----- -亲密度-
            1726566892   200
            12345674     50  
            3309758991   20
         */
  let flag = 0 //关系人数
  let msg = [] //回复的消息
  msg.push(`\n-----qq----- -亲密度-`)
  //遍历所有人的qq
  let File = fs.readdirSync(__PATH.player_path)
  File = File.filter(file => file.endsWith('.json'))
  for (let i = 0; i < File.length; i++) {
    let B = File[i].replace('.json', '')
    //如果是本人不执行查询
    if (A == B) {
      continue
    }
    //A与B的亲密度
    let pd = await find_qinmidu(A, B)
    if (pd == false) {
      continue
    }
    flag++
    msg.push(`\n${B}\t ${pd}`)
  }
  if (flag == 0) {
    Send(Text(`其实一个人也不错的`))
  } else {
    for (let i = 0; i < msg.length; i += 8) {
      Send(Text(msg.slice(i, i + 8).join('')))
      await sleep(500)
    }
  }
})
