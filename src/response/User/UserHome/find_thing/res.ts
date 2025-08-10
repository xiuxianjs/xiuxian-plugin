import { Text, useSend } from 'alemonjs'

import { data } from '@src/model/api'
import { foundthing, existNajieThing, addNajieThing } from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?哪里有(.*)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const reg = new RegExp(/哪里有/)
  let msg = e.MessageText.replace(reg, '')
  msg = msg.replace(/^(#|＃|\/)?/, '')
  const thing_name = msg.replace('哪里有', '')
  const didian = [
    'guildSecrets_list',
    'forbiddenarea_list',
    'Fairyrealm_list',
    'timeplace_list',
    'didian_list',
    'shenjie',
    'mojie',
    'xingge',
    'shop_list'
  ]
  const found = []
  const thing_exist = await foundthing(thing_name)
  if (!thing_exist) {
    Send(Text(`你在瞎说啥呢?哪来的【${thing_name}】?`))
    return false
  }
  const number = await existNajieThing(usr_qq, '寻物纸', '道具')
  if (!number) {
    Send(Text('查找物品需要【寻物纸】'))
    return false
  }
  for (const i of didian) {
    for (const j of data[i]) {
      const n = ['one', 'two', 'three']
      for (const k of n) {
        if (j[k] && j[k].find(item => item.name == thing_name)) {
          found.push(j.name + '\n')
          break
        }
      }
    }
  }
  found.push('消耗了一张寻物纸')
  if (found.length == 1) {
    Send(Text('天地没有回应......'))
  } else {
    await Send(Text(found.join('')))
  }
  await addNajieThing(usr_qq, '寻物纸', '道具', -1)
})
