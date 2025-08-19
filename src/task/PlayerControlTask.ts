import { redis, data, pushInfo } from '@src/model/api'
// 直接从具体模块导入，避免经由 barrel 产生的 re-export 循环
import { notUndAndNull } from '@src/model/common'
import { readDanyao, writeDanyao } from '@src/model/danyao'
import { existNajieThing, addNajieThing } from '@src/model/najie'
import { addExp, addExp2 } from '@src/model/economy'
import { setFileValue } from '@src/model/cultivation'
import { __PATH } from '@src/model/keys'
import { DataMention, Mention } from 'alemonjs'
import { getDataByUserId, setDataByUserId } from '@src/model/Redis'
import type { ActionState } from '@src/types'
import { getConfig } from '@src/model'

/**
 * 遍历所有玩家，检查每个玩家的当前动作（action），判断是否处于闭关或降妖状态。
对于闭关（shutup == '0'）：
判断是否到达结算时间（提前2分钟结算）。
计算修为、血气等收益，处理特殊道具和炼丹师加成，处理顿悟/走火入魔等随机事件。
更新玩家属性、道具、经验，并推送结算消息。
结算后关闭相关状态。
对于降妖（working == '0'）：
判断是否到达结算时间（提前2分钟结算）。
计算灵石、血气等收益，处理随机事件（如额外收益、损失等）。
更新玩家属性、灵石，并推送结算消息。
结算后关闭相关状态。
兼容旧版数据结构，处理炼丹师丹药、特殊道具等逻辑。
 * @returns 
 */
export const PlayerControlTask = async () => {
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  const cf = await getConfig('xiuxian', 'xiuxian')
  for (const player_id of playerList) {
    let log_mag = '' //查询当前人物动作日志信息（需累计变更）
    log_mag += '查询' + player_id + '是否有动作,'
    //得到动作
    const actionRaw = await getDataByUserId(player_id, 'action')
    let action: ActionState | null = null
    try {
      action = actionRaw ? (JSON.parse(actionRaw) as ActionState) : null
    } catch {
      action = null
    }
    //不为空，存在动作
    if (action != null) {
      let push_address //消息推送地址
      let is_group = false //是否推送到群
      if (Object.prototype.hasOwnProperty.call(action, 'group_id')) {
        if (notUndAndNull(action.group_id)) {
          is_group = true
          push_address = action.group_id
        }
      }
      //最后发送的消息
      const msg: Array<DataMention | string> = [Mention(player_id)]
      //动作结束时间
      let end_time = action.end_time
      //现在的时间
      const now_time = Date.now()
      //闭关状态
      if (action.shutup == '0') {
        //这里改一改,要在结束时间的前一分钟提前结算
        //时间过了
        end_time = end_time - 60000 * 2
        if (now_time > end_time) {
          log_mag += '当前人物未结算，结算状态'
          const player = await data.getData('player', player_id)
          if (!notUndAndNull(player.level_id)) {
            return false
          }
          const now_level_id = data.Level_list.find(
            item => item.level_id == player.level_id
          ).level_id
          const size = cf.biguan.size
          const xiuwei = Math.floor(
            size * now_level_id * (player.修炼效率提升 + 1)
          ) //增加的修为
          const blood = Math.floor(player.血量上限 * 0.02)
          const rawTime = action.time
          const time =
            (typeof rawTime === 'number'
              ? rawTime
              : parseInt(rawTime || '0', 10)) /
            1000 /
            60 // 分钟
          let rand = Math.random()
          let xueqi = 0
          let other_xiuwei = 0
          //炼丹师丹药修正
          let transformation = '修为'
          // 兼容旧版：readDanyao 现在返回数组，但老逻辑期望对象包含 biguan/biguanxl/lianti/beiyong4 等字段
          // 若未来需要，可引入独立的炼神状态存储结构
          const dy = await readDanyao(player_id)

          if (dy.biguan > 0) {
            dy.biguan--
            if (dy.biguan == 0) {
              dy.biguanxl = 0
            }
          }
          if (dy.lianti > 0) {
            transformation = '血气'
            dy.lianti--
          }

          if (rand < 0.2) {
            rand = Math.trunc(rand * 10) + 45
            other_xiuwei = rand * time
            xueqi = Math.trunc(rand * time * dy.beiyong4)
            if (transformation == '血气') {
              msg.push('\n本次闭关顿悟,受到炼神之力修正,额外增加血气:' + xueqi)
            } else {
              msg.push('\n本次闭关顿悟,额外增加修为:' + rand * time)
            }
          } else if (rand > 0.8) {
            rand = Math.trunc(rand * 10) + 5
            other_xiuwei = -1 * rand * time
            xueqi = Math.trunc(rand * time * dy.beiyong4)
            if (transformation == '血气') {
              msg.push(
                '\n,由于你闭关时隔壁装修,导致你差点走火入魔,受到炼神之力修正,血气下降' +
                  xueqi
              )
            } else {
              msg.push(
                '\n由于你闭关时隔壁装修,导致你差点走火入魔,修为下降' +
                  rand * time
              )
            }
          }
          let other_x = 0
          let qixue = 0
          if (
            (await existNajieThing(player_id, '魔界秘宝', '道具')) &&
            player.魔道值 > 999
          ) {
            other_x += Math.trunc(xiuwei * 0.15 * time)
            await addNajieThing(player_id, '魔界秘宝', '道具', -1)
            msg.push('\n消耗了道具[魔界秘宝],额外增加' + other_x + '修为')
            await addExp(player_id, other_x)
          }
          if (
            (await existNajieThing(player_id, '神界秘宝', '道具')) &&
            player.魔道值 < 1 &&
            (player.灵根.type == '转生' || player.level_id > 41)
          ) {
            qixue = Math.trunc(xiuwei * 0.1 * time)
            await addNajieThing(player_id, '神界秘宝', '道具', -1)
            msg.push('\n消耗了道具[神界秘宝],额外增加' + qixue + '血气')
            await addExp2(player_id, qixue)
          }

          await setFileValue(player_id, blood * time, '当前血量')

          if (action.acount == null) {
            action.acount = 0
          }
          const arr = action
          //把状态都关了
          arr.shutup = 1 //闭关状态
          arr.working = 1 //降妖状态
          arr.power_up = 1 //渡劫状态
          arr.Place_action = 1 //秘境
          arr.Place_actionplus = 1 //沉迷状态
          delete arr.group_id //结算完去除group_id
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))
          xueqi = Math.trunc(xiuwei * time * dy.beiyong4)
          if (transformation == '血气') {
            await setFileValue(
              player_id,
              (xiuwei * time + other_xiuwei) * dy.beiyong4,
              transformation
            )
            msg.push(
              '\n受到炼神之力的影响,增加气血:' + xueqi,
              '血量增加:' + blood * time
            )
          } else {
            await setFileValue(
              player_id,
              xiuwei * time + other_xiuwei,
              transformation
            )
            msg.push('\n增加修为:' + xiuwei * time, '血量增加:' + blood * time)
          }
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))
          if (is_group) {
            await pushInfo(push_address, is_group, msg)
          } else {
            await pushInfo(player_id, is_group, msg)
          }

          if (dy.lianti <= 0) {
            dy.lianti = 0
            dy.beiyong4 = 0
          }
          // 仍按旧结构写回：若接口需要数组，后续可实现 fromStatus(dy)
          await writeDanyao(player_id, dy)
        }
      } //炼丹师修正结束
      //降妖
      if (action.working == '0') {
        //这里改一改,要在结束时间的前一分钟提前结算
        end_time = end_time - 60000 * 2
        //时间过了
        if (now_time > end_time) {
          //现在大于结算时间，即为结算
          log_mag = log_mag + '当前人物未结算，结算状态'
          const player = await data.getData('player', player_id)
          if (!notUndAndNull(player.level_id)) {
            return false
          }
          const now_level_id = data.Level_list.find(
            item => item.level_id == player.level_id
          ).level_id
          const size = cf.work.size
          const lingshi = Math.floor(
            size * now_level_id * (1 + player.修炼效率提升) * 0.5
          )
          const rawTime2 = action.time
          const time =
            (typeof rawTime2 === 'number'
              ? rawTime2
              : parseInt(rawTime2 || '0', 10)) /
            1000 /
            60 // 分钟
          let other_lingshi = 0
          let other_xueqi = 0
          let rand = Math.random()
          if (rand < 0.2) {
            rand = Math.trunc(rand * 10) + 40
            other_lingshi = rand * time
            msg.push(
              '\n降妖路上途径金银坊，一时手痒入场一掷：6 6 6，额外获得灵石' +
                rand * time
            )
          } else if (rand > 0.8) {
            rand = Math.trunc(rand * 10) + 5
            other_lingshi = -1 * rand * time
            msg.push(
              '\n途径盗宝团营地，由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少' +
                rand * time
            )
          } else if (rand > 0.5 && rand < 0.6) {
            rand = Math.trunc(rand * 10) + 20
            other_lingshi = -1 * rand * time
            other_xueqi = -2 * rand * time
            msg.push(
              '\n归来途中经过怡红院，你抵挡不住诱惑，进去大肆消费了' +
                rand * time +
                '灵石，' +
                '早上醒来，气血消耗了' +
                2 * rand * time
            )
          }
          //
          player.血气 += other_xueqi
          data.setData('player', player_id, player)
          const get_lingshi = Math.trunc(lingshi * time + other_lingshi) //最后获取到的灵石
          //
          await setFileValue(player_id, get_lingshi, '灵石') //添加灵石
          //redis动作
          if (action.acount == null) {
            action.acount = 0
          }
          const arr = action
          //把状态都关了
          arr.shutup = 1 //闭关状态
          arr.working = 1 //降妖状态
          arr.power_up = 1 //渡劫状态
          arr.Place_action = 1 //秘境
          arr.Place_actionplus = 1 //沉迷状态
          delete arr.group_id //结算完去除group_id
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))
          msg.push('\n降妖得到' + get_lingshi + '灵石')
          log_mag += '收入' + get_lingshi
          if (is_group) {
            await pushInfo(push_address, is_group, msg)
          } else {
            await pushInfo(player_id, is_group, msg)
          }
        }
      }
    }
  }
}
