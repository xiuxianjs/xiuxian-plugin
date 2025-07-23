import { Text, Image, useSend } from 'alemonjs'

import { existplayer } from '@src/model'
import { Read_tiandibang, Write_tiandibang, get_tianditang_img } from '../tian'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?天地堂/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //查看存档
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let tiandibang
  try {
    tiandibang = await Read_tiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
    tiandibang = await Read_tiandibang()
  }
  let m = tiandibang.length
  for (m = 0; m < tiandibang.length; m++) {
    if (tiandibang[m].qq == usr_qq) {
      break
    }
  }
  if (m == tiandibang.length) {
    Send(Text('请先报名!'))
    return false
  }
  let img = await get_tianditang_img(e, tiandibang[m].积分)
  if (img) Send(Image(img))
})
