import { Text, useSend } from 'alemonjs'
import fs from 'fs'
import { __PATH, Read_player, Read_najie, Read_equipment } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?检查存档.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  if (!e.IsMaster) {
    Send(Text('只有主人可以执行操作'))
    return false
  }
  let File = fs.readdirSync(__PATH.player_path)
  File = File.filter(file => file.endsWith('.json'))
  let File_length = File.length
  let cundang = ['存档']
  let najie = ['纳戒']
  let equipment = ['装备']
  for (let k = 0; k < File_length; k++) {
    let usr_qq = File[k].replace('.json', '')
    try {
      await Read_player(usr_qq)
    } catch {
      cundang.push('\n')
      cundang.push(usr_qq)
    }
    try {
      await Read_najie(usr_qq)
    } catch {
      najie.push('\n')
      najie.push(usr_qq)
    }
    try {
      await Read_equipment(usr_qq)
    } catch {
      equipment.push('\n')
      equipment.push(usr_qq)
    }
  }
  if (cundang.length > 1) {
    await Send(Text(cundang.join('')))
  } else {
    cundang.push('正常')
    await Send(Text(cundang.join('')))
  }
  if (najie.length > 1) {
    await Send(Text(najie.join('')))
  } else {
    najie.push('正常')
    await Send(Text(najie.join('')))
  }
  if (equipment.length > 1) {
    await Send(Text(equipment.join('')))
  } else {
    equipment.push('正常')
    await Send(Text(equipment.join('')))
  }
})
