import { Image, Text, useSend } from 'alemonjs'

import { existplayer } from '@src/model/index'
import { readTiandibang, Write_tiandibang } from '../tian'

import { selects } from '@src/response/index'
import { screenshot } from '@src/image'
export const regular = /^(#|＃|\/)?天地榜$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //查看存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let tiandibang = []
  try {
    tiandibang = await readTiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
  }
  // 查找用户是否报名
  const userIndex = tiandibang.findIndex(p => p.qq == usr_qq)
  if (userIndex === -1) {
    Send(Text('请先报名!'))
    return false
  }
  // 生成图片，传递实际排行榜数据
  const image = await screenshot('immortal_genius', usr_qq, {
    allplayer: tiandibang
      .sort((a, b) => b.积分 - a.积分)
      .slice(0, 10)
      .map(item => {
        return {
          power: item.积分,
          qq: item.qq,
          name: item.name
        }
      }),
    title: '天地榜(每日免费三次)',
    label: '积分'
  })
  if (Buffer.isBuffer(image)) {
    Send(Image(image))
    return
  }
  // 图片生成失败，仅提示错误
  Send(Text('图片生产失败'))
})
