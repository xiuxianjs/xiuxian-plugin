import { Image, Text, useSend } from 'alemonjs'

import { redis, data, puppeteer } from '@src/model/api'
import { readIt, writeIt, alluser, readNajie, readEquipment } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?神兵榜/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let wupin = []
  try {
    wupin = await readIt()
  } catch {
    await writeIt([])
  }
  let newwupin = []
  const type = ['武器', '护具', '法宝']
  const nowTime = Date.now()
  // if 根本还没记录时间或者过了时间，就遍历生成，额外往wupin里添加owner_name（号）属性，并重写回去custom.json
  if (
    !(await redis.exists('xiuxian:bestfileCD')) ||
    +(await redis.get('xiuxian:bestfileCD')) - nowTime > 30 * 60 * 1000
  ) {
    await redis.set('xiuxian:bestfileCD', nowTime)

    const all = await alluser()
    for (const [wpId, j] of wupin.entries()) {
      for (const i of all) {
        const najie = await readNajie(i)
        const equ = await readEquipment(i)
        let exist = najie.装备.find(item => item.name == j.name)
        for (const m of type) {
          if (equ[m].name == j.name) {
            exist = 1
            break
          }
        }
        let D = '无门无派'
        let author = '神秘匠师'
        if (exist) {
          if (j.author_name) {
            const player = await await data.getData('player', j.author_name)
            author = player.名号
          }
          const usr_player = await await data.getData('player', i)
          wupin[wpId].owner_name = i
          if (usr_player.宗门) D = usr_player.宗门.宗门名称
          newwupin.push({
            name: j.name,
            type: j.type,
            评分: Math.trunc((j.atk * 1.2 + j.def * 1.5 + j.HP * 1.5) * 10000),
            制作者: author,
            使用者: usr_player.名号 + '(' + D + ')'
          })
          break
        }
      }
    }
    await writeIt(wupin) // 重写custom.json
  }
  // 否则，直接按照custom.json记录的数据生成newwupin
  else {
    for (const wp of wupin) {
      let D = '无门无派'
      let author = '神秘匠师'
      if (wp.author_name) {
        const player = await await data.getData('player', wp.author_name)
        author = player.名号
      }
      const usr_player = await await data.getData('player', wp.owner_name)
      if (usr_player.宗门) D = usr_player.宗门.宗门名称

      newwupin.push({
        name: wp.name,
        type: wp.type,
        评分: Math.trunc((wp.atk * 1.2 + wp.def * 1.5 + wp.HP * 1.5) * 10000),
        制作者: author,
        使用者: usr_player.名号 + '(' + D + ')'
      })
    }
  }

  // 让newwupin工作
  newwupin.sort(function (a, b) {
    return b.评分 - a.评分
  })
  if (newwupin[20] && newwupin[0].评分 == newwupin[20].评分) {
    const num = Math.floor((newwupin.length - 20) * Math.random())
    newwupin = newwupin.slice(num, num + 20)
  } else {
    newwupin = newwupin.slice(0, 20)
  }
  const bd_date = { newwupin }

  const tu = await puppeteer.screenshot('shenbing', e.UserId, bd_date)
  if (tu) {
    Send(Image(tu))
  } else {
    Send(Text('图片生成失败'))
  }
})
