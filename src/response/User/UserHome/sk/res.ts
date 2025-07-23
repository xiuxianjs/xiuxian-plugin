import { Text, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  exist_najie_thing,
  Add_najie_thing,
  sleep,
  Add_仙宠
} from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)抽(天地卡池|灵界卡池|凡界卡池)$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let tianluoRandom
  let thing = e.MessageText.replace('#', '')
  thing = thing.replace('抽', '')
  if (thing == '天地卡池') {
    let x = await exist_najie_thing(usr_qq, '天罗地网', '道具')
    if (!x) {
      Send(Text('你没有【天罗地网】'))
      return false
    }
    await Add_najie_thing(usr_qq, '天罗地网', '道具', -1)
  } else if (thing == '灵界卡池') {
    let x = await exist_najie_thing(usr_qq, '金丝仙网', '道具')
    if (!x) {
      Send(Text('你没有【金丝仙网】'))
      return false
    }
    await Add_najie_thing(usr_qq, '金丝仙网', '道具', -1)
  } else if (thing == '凡界卡池') {
    let x = await exist_najie_thing(usr_qq, '银丝仙网', '道具')
    if (!x) {
      Send(Text('你没有【银丝仙网】'))
      return false
    }
    await Add_najie_thing(usr_qq, '银丝仙网', '道具', -1)
  }
  tianluoRandom = Math.floor(Math.random() * data.changzhuxianchon.length)
  tianluoRandom = (Math.ceil((tianluoRandom + 1) / 5) - 1) * 5
  Send(Text('一道金光从天而降'))
  await sleep(5000)
  Send(
    Text(
      '金光掉落在地上，走近一看是【' +
        data.changzhuxianchon[tianluoRandom].品级 +
        '】' +
        data.changzhuxianchon[tianluoRandom].name
    )
  )
  await Add_仙宠(usr_qq, data.changzhuxianchon[tianluoRandom].name, 1)
  Send(Text('恭喜获得' + data.changzhuxianchon[tianluoRandom].name))
})
