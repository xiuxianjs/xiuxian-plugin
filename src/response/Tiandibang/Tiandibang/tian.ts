import { redis, data, puppeteer } from '@src/api/api'
import { __PATH, shijianc, readPlayer } from '@src/model'

export async function Write_tiandibang(wupin) {
  redis.set(
    `${__PATH.tiandibang}:tiandibang`,
    JSON.stringify(wupin, null, '\t')
  )
  return false
}

export async function Read_tiandibang() {
  let tiandibang = await redis.get(`${__PATH.tiandibang}:tiandibang`)
  //将字符串数据转变成数组格式
  const data = JSON.parse(tiandibang)
  return data
}

export async function getLastbisai(usr_qq) {
  //查询redis中的人物动作
  let time: any = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastbisai_time')
  logger.info(time)
  if (time != null) {
    let data = await shijianc(parseInt(time))
    return data
  }
  return false
}

export async function get_tianditang_img(e, jifen) {
  let usr_qq = e.UserId
  let player = await readPlayer(usr_qq)
  let commodities_list = data.tianditang
  let tianditang_data = {
    name: player.名号,
    jifen,
    commodities_list: commodities_list
  }

  let img = await puppeteer.screenshot('tianditang', e.UserId, tianditang_data)
  return img
}

export async function re_bangdang() {
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  let temp = []
  let t
  for (let k = 0; k < playerList.length; k++) {
    let this_qq: any = playerList[k]
    this_qq = parseInt(this_qq)
    let player = await readPlayer(this_qq)
    let level_id = data.Level_list.find(
      item => item.level_id == player.level_id
    ).level_id
    temp[k] = {
      名号: player.名号,
      境界: level_id,
      攻击: player.攻击,
      防御: player.防御,
      当前血量: player.血量上限,
      暴击率: player.暴击率,
      灵根: player.灵根,
      法球倍率: player.灵根.法球倍率,
      学习的功法: player.学习的功法,
      魔道值: player.魔道值,
      神石: player.神石,
      qq: this_qq,
      次数: 3,
      积分: 0
    }
  }
  for (let i = 0; i < playerList.length - 1; i++) {
    let count = 0
    for (let j = 0; j < playerList.length - i - 1; j++) {
      if (temp[j].积分 < temp[j + 1].积分) {
        t = temp[j]
        temp[j] = temp[j + 1]
        temp[j + 1] = t
        count = 1
      }
    }
    if (count == 0) break
  }
  await Write_tiandibang(temp)
  return false
}
