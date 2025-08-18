import { Text, useSend } from 'alemonjs'
import { data } from '@src/model/api'
import { existplayer, readPlayer } from '@src/model/index'
import { readTiandibang, Write_tiandibang } from '../tian'
import { selects } from '@src/response/index'
import type { TalentInfo } from '@src/types'
export const regular = /^(#|＃|\/)?更新属性$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId

  //查看存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  // 榜单数据类型定义（局部）
  interface RankRow {
    qq: string
    名号: string
    境界: number
    攻击: number
    防御: number
    当前血量: number
    暴击率: number
    学习的功法
    灵根: TalentInfo | { 法球倍率?: number | string } | Record<string, unknown>
    法球倍率?: number | string
    积分: number
    // 补全 TiandibangRow 所需字段
    魔道值: number
    神石: number
    次数: number
  }
  let tiandibang: RankRow[] = []
  try {
    tiandibang = await readTiandibang()
  } catch {
    //没有表要先建立一个！
    await Write_tiandibang([])
  }
  const index = tiandibang.findIndex(item => item.qq === usr_qq)
  if (index === -1) {
    Send(Text('请先报名!'))
    return false
  }
  const player = await readPlayer(usr_qq)
  // 若缺失补全默认字段
  if (typeof tiandibang[index].魔道值 !== 'number')
    tiandibang[index].魔道值 = player.魔道值 || 0
  if (typeof tiandibang[index].神石 !== 'number')
    tiandibang[index].神石 = player.神石 || 0
  if (typeof tiandibang[index].次数 !== 'number') tiandibang[index].次数 = 0
  const level_id = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level_id
  const row = tiandibang[index]
  row.名号 = player.名号
  row.境界 = level_id
  row.攻击 = player.攻击
  row.防御 = player.防御
  row.当前血量 = player.血量上限
  row.暴击率 = player.暴击率
  row.学习的功法 = player.学习的功法
  row.灵根 = player.灵根
  row.法球倍率 = player.灵根.法球倍率
  await Write_tiandibang(tiandibang)
  tiandibang = await readTiandibang() // 重新读取最新榜单
  const refreshed = tiandibang[index]
  refreshed.暴击率 = Math.trunc(refreshed.暴击率 * 100)
  const msg = [
    '名次：' +
      (index + 1) +
      '\n名号：' +
      refreshed.名号 +
      '\n攻击：' +
      refreshed.攻击 +
      '\n防御：' +
      refreshed.防御 +
      '\n血量：' +
      refreshed.当前血量 +
      '\n暴击：' +
      refreshed.暴击率 +
      '%\n积分：' +
      refreshed.积分
  ]
  Send(Text(msg.join('')))
})
