import { redis, data, pushInfo } from '@src/model/api'
import { notUndAndNull } from '@src/model/common'
import { addExp4 } from '@src/model/xiuxian'
import { addNajieThing } from '@src/model/najie'
import { __PATH } from '@src/model/paths'
import { DataMention, Mention } from 'alemonjs'
import { getDataByUserId, setDataByUserId } from '@src/model/Redis'
import { safeParse } from '@src/model/utils/safe'
import type { Player, ActionState } from '@src/types'

export const OccupationTask = async () => {
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (const player_id of playerList) {
    // let log_mag = '' // 查询当前人物动作日志信息
    // log_mag += '查询' + player_id + '是否有动作,'
    // 得到动作
    const actionRaw = await getDataByUserId(player_id, 'action')
    const action = safeParse<ActionState | null>(actionRaw, null)
    // 不为空，存在动作
    if (!action) continue

    let push_address: string | undefined // 消息推送地址
    let is_group = false // 是否推送到群
    if ('group_id' in action && notUndAndNull(action.group_id)) {
      is_group = true
      push_address = action.group_id as string
    }

    // 最后发送的消息
    const msg: Array<DataMention | string> = [Mention(player_id)]
    // 动作结束时间（预处理提前量）
    const now_time = Date.now()

    // 闭关状态结算
    if (action.plant === '0') {
      const end_time = action.end_time - 60000 * 2 // 提前 2 分钟
      if (now_time > end_time) {
        // log_mag += '当前人物未结算，结算状态' // 移除未使用日志累积
        const playerRaw = await data.getData('player', player_id)
        if (!playerRaw || Array.isArray(playerRaw)) {
          // 数据异常，跳过
          continue
        }
        const player = playerRaw as Player
        const rawTime =
          typeof action.time === 'string'
            ? parseInt(action.time)
            : Number(action.time)
        const timeMin = (isNaN(rawTime) ? 0 : rawTime) / 1000 / 60
        const exp = timeMin * 10
        await addExp4(player_id, exp)
        // 采集草药数量基准
        const k = player.level_id < 22 ? 0.5 : 1
        let sum = (timeMin / 480) * (player.occupation_level * 2 + 12) * k
        if (player.level_id >= 36) {
          sum = (timeMin / 480) * (player.occupation_level * 3 + 11)
        }
        const names: readonly string[] = [
          '万年凝血草',
          '万年何首乌',
          '万年血精草',
          '万年甜甜花',
          '万年清心草',
          '古神藤',
          '万年太玄果',
          '炼骨花',
          '魔蕴花',
          '万年清灵草',
          '万年天魂菊',
          '仙蕴花',
          '仙缘草',
          '太玄仙草'
        ] as const
        const sum2 = [0.2, 0.3, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        const sum3 = [
          0.17, 0.22, 0.17, 0.17, 0.17, 0.024, 0.024, 0.024, 0.024, 0.024,
          0.024, 0.024, 0.012, 0.011
        ]
        msg.push(`\n恭喜你获得了经验${exp},草药:`)
        let newsum = sum3.map(item => item * sum)
        if (player.level_id < 36) {
          newsum = sum2.map(item => item * sum)
        }
        for (let i = 0; i < newsum.length; i++) {
          if (newsum[i] < 1) continue
          const count = Math.floor(newsum[i])
          msg.push(`\n${names[i]}${count}个`)
          await addNajieThing(player_id, names[i], '草药', count)
        }
        await addExp4(player_id, exp)
        // 状态复位
        const arr = { ...action }
        // 设为已结算
        arr.is_jiesuan = 1
        arr.plant = 1
        arr.shutup = 1
        arr.working = 1
        arr.power_up = 1
        arr.Place_action = 1
        arr.Place_actionplus = 1
        delete (arr as Partial<ActionState>).group_id
        await setDataByUserId(player_id, 'action', JSON.stringify(arr))
        if (is_group && push_address) {
          await pushInfo(push_address, is_group, msg)
        } else {
          await pushInfo(player_id, is_group, msg)
        }
      }
    }

    // 采矿状态结算
    if (action.mine === '0') {
      const end_time = action.end_time - 60000 * 2
      if (now_time > end_time) {
        // log_mag += '当前人物未结算，结算状态' // 移除未使用日志累积
        const playerRaw = await data.getData('player', player_id)
        if (!playerRaw || Array.isArray(playerRaw)) continue
        const player = playerRaw as Player
        if (!notUndAndNull(player.level_id)) continue
        const rawTime2 =
          typeof action.time === 'string'
            ? parseInt(action.time)
            : Number(action.time)
        const timeMin = (isNaN(rawTime2) ? 0 : rawTime2) / 1000 / 60
        const mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * timeMin)
        const occRow = data.occupation_exp_list.find(
          (o: { id: number; name: string; experience: number }) =>
            o.id == player.occupation_level
        )
        // 原代码使用 occRow.rate，不存在该字段，改为基于 experience 推导一个倍率（示例：experience / 1000）
        const rateBase = occRow ? occRow.experience / 1000 : 0
        const rate = rateBase * 10
        const exp = timeMin * 10
        const ext = `你是采矿师，获得采矿经验${exp}，额外获得矿石${Math.floor(rate * 100)}%，`
        let end_amount = Math.floor(4 * (rate + 1) * mine_amount1)
        const num = Math.floor(((rate / 12) * timeMin) / 30)
        const A = [
          '金色石胚',
          '棕色石胚',
          '绿色石胚',
          '红色石胚',
          '蓝色石胚',
          '金色石料',
          '棕色石料',
          '绿色石料',
          '红色石料',
          '蓝色石料'
        ] as const
        const B = [
          '金色妖石',
          '棕色妖石',
          '绿色妖石',
          '红色妖石',
          '蓝色妖石',
          '金色妖丹',
          '棕色妖丹',
          '绿色妖丹',
          '红色妖丹',
          '蓝色妖丹'
        ] as const
        const xuanze = Math.trunc(Math.random() * A.length)
        end_amount = Math.floor(end_amount * (player.level_id / 40))
        await addNajieThing(player_id, '庚金', '材料', end_amount)
        await addNajieThing(player_id, '玄土', '材料', end_amount)
        await addNajieThing(player_id, A[xuanze], '材料', num)
        await addNajieThing(player_id, B[xuanze], '材料', Math.trunc(num / 48))
        await addExp4(player_id, exp)
        msg.push(
          `\n采矿归来，${ext}\n收获庚金×${end_amount}\n玄土×${end_amount}`
        )
        msg.push(`\n${A[xuanze]}x${num}\n${B[xuanze]}x${Math.trunc(num / 48)}`)
        // 状态复位
        const arr = { ...action }
        arr.mine = 1
        arr.shutup = 1
        arr.working = 1
        arr.power_up = 1
        arr.Place_action = 1
        arr.Place_actionplus = 1
        delete (arr as Partial<ActionState>).group_id
        await setDataByUserId(player_id, 'action', JSON.stringify(arr))
        if (is_group && push_address) {
          await pushInfo(push_address, is_group, msg)
        } else {
          await pushInfo(player_id, is_group, msg)
        }
      }
    }
  }
}
