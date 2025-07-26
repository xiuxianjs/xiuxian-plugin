import { Image, Text, useSend } from 'alemonjs'
import { redis, puppeteer } from '@src/api/api'
import { existplayer, readPlayer, __PATH } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?悬赏目标$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  let player = await readPlayer(usr_qq)
  if (player.occupation != '侠客') {
    Send(Text('只有专业的侠客才能获取悬赏'))
    return false
  }
  let msg = []
  let action: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':shangjing')
  action = await JSON.parse(action)
  let type = 0
  if (action != null) {
    if (action.end_time > new Date().getTime()) {
      msg = action.arm
      let msg_data = { msg, type }
      let img = await puppeteer.screenshot('msg', e.UserId, msg_data)
      Send(Image(img))
      return false
    }
  }
  let mubiao = []
  let i = 0
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (let this_qq of playerList) {
    let players = await readPlayer(this_qq)
    if (players.魔道值 > 999 && this_qq != usr_qq) {
      mubiao[i] = {
        名号: players.名号,
        赏金: Math.trunc(
          (1000000 *
            (1.2 + 0.05 * player.occupation_level) *
            player.level_id *
            player.Physique_id) /
            42 /
            42 /
            4
        ),
        QQ: this_qq
      }
      i++
    }
  }

  while (i < 4) {
    mubiao[i] = {
      名号: 'DD大妖王',
      赏金: Math.trunc(
        (1000000 *
          (1.2 + 0.05 * player.occupation_level) *
          player.level_id *
          player.Physique_id) /
          42 /
          42 /
          4
      ),
      QQ: 1
    }
    i++
  }
  for (let k = 0; k < 3; k++) {
    msg.push(mubiao[Math.trunc(Math.random() * i)])
  }
  let arr = {
    arm: msg,
    end_time: new Date().getTime() + 60000 * 60 * 20 //结束时间
  }
  await redis.set('xiuxian@1.3.0:' + usr_qq + ':shangjing', JSON.stringify(arr))
  let msg_data = { msg, type }
  let img = await puppeteer.screenshot('msg', e.UserId, msg_data)
  if (img) Send(Image(img))
})
