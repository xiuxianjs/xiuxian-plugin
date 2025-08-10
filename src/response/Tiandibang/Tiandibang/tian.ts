import { redis, data, puppeteer } from '@src/model/api'
import { __PATH, shijianc, readPlayer } from '@src/model/index'
import type { Player, TalentInfo } from '@src/types/player'

// 榜单条目类型（简化，只列出必需字段，允许附加动态属性）
export interface TiandibangRow {
  名号: string
  境界: number
  攻击: number
  防御: number
  当前血量: number
  暴击率: number
  灵根: TalentInfo | Record<string, unknown>
  法球倍率?: number | string
  学习的功法: unknown
  魔道值: number
  神石: number
  qq: number
  次数: number
  积分: number
  [k: string]: unknown
}

export async function Write_tiandibang(wupin: TiandibangRow[]) {
  await redis.set(
    `${__PATH.tiandibang}:tiandibang`,
    JSON.stringify(wupin, null, '\t')
  )
  return false
}

export async function readTiandibang() {
  const tiandibang = await redis.get(`${__PATH.tiandibang}:tiandibang`)
  if (!tiandibang) {
    //如果没有天鼎数据，返回空数组
    return []
  }
  //将字符串数据转变成数组格式
  const data = JSON.parse(tiandibang)
  return data
}

export async function getLastbisai(usr_qq: string | number) {
  const timeStr = await redis.get('xiuxian@1.3.0:' + usr_qq + ':lastbisai_time')
  if (timeStr != null) {
    const details = await shijianc(parseInt(timeStr, 10))
    return details
  }
  return false
}

export async function get_tianditang_img(e, jifen) {
  const usr_qq = e.UserId
  const player = await readPlayer(usr_qq)
  const commodities_list = data.tianditang
  const tianditang_data = {
    name: player.名号,
    jifen,
    commodities_list: commodities_list
  }

  const img = await puppeteer.screenshot(
    'tianditang',
    e.UserId,
    tianditang_data
  )
  return img
}

export async function re_bangdang() {
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  const temp: TiandibangRow[] = []
  for (let k = 0; k < playerList.length; k++) {
    const thisQqStr = playerList[k]!
    const thisQq = parseInt(thisQqStr, 10)
    const player = await readPlayer(thisQqStr)
    const level_id = data.Level_list.find(
      item => item.level_id == player.level_id
    )?.level_id
    if (level_id == null) continue
    temp.push({
      名号: player.名号,
      境界: level_id,
      攻击: player.攻击,
      防御: player.防御,
      当前血量: player.血量上限,
      暴击率: player.暴击率,
      灵根: player.灵根,
      法球倍率: player.灵根.法球倍率,
      学习的功法: player.学习的功法,
      魔道值: (player as Player & { 魔道值?: number }).魔道值 ?? 0,
      神石: (player as Player & { 神石?: number }).神石 ?? 0,
      qq: thisQq,
      次数: 3,
      积分: 0
    })
  }
  // 按积分排序（冒泡替换为内置排序）
  temp.sort((a, b) => b.积分 - a.积分)
  await Write_tiandibang(temp)
  return false
}
