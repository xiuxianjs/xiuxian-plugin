import { redis, data, pushInfo } from '@src/api/api'
import {
  isNotNull,
  zd_battle,
  addNajieThing,
  readShop,
  writeShop,
  existshop,
  __PATH
} from '@src/model'
import { scheduleJob } from 'node-schedule'
import { getDataByUserId, setDataByUserId } from '@src/model/Redis'

scheduleJob('0 0/1 * * * ?', async () => {
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const playerList = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  for (let player_id of playerList) {
    let log_mag = '' //查询当前人物动作日志信息
    log_mag = log_mag + '查询' + player_id + '是否有动作,'
    //得到动作

    let action: any = await getDataByUserId(player_id, 'action')
    action = await JSON.parse(action)
    //不为空，存在动作
    if (action != null) {
      let push_address //消息推送地址
      let is_group = false //是否推送到群

      if (await action.hasOwnProperty('group_id')) {
        if (isNotNull(action.group_id)) {
          is_group = true
          push_address = action.group_id
        }
      }

      //最后发送的消息
      let msg = []
      //动作结束时间
      let end_time = action.end_time
      //现在的时间
      let now_time = new Date().getTime()

      //有洗劫状态:这个直接结算即可
      if (action.xijie == '0') {
        //10分钟后开始结算阶段一
        end_time = end_time - action.time + 60000 * 10
        //时间过了
        if (now_time >= end_time) {
          let weizhi = action.Place_address
          let i //获取对应npc列表的位置
          for (i = 0; i < data.npc_list.length; i++) {
            if (data.npc_list[i].name == weizhi.name) {
              break
            }
          }
          let A_player = action.A_player
          let monster_length
          let monster_index
          let monster
          if (weizhi.Grade == 1) {
            monster_length = data.npc_list[i].one.length
            monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].one[monster_index]
          } else if (weizhi.Grade == 2) {
            monster_length = data.npc_list[i].two.length
            monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].two[monster_index]
          } else {
            monster_length = data.npc_list[i].three.length
            monster_index = Math.trunc(Math.random() * monster_length)
            monster = data.npc_list[i].three[monster_index]
          }
          //设定npc数值
          let B_player = {
            名号: monster.name,
            攻击: Math.floor(monster.atk * A_player.攻击),
            防御: Math.floor(
              (monster.def * A_player.防御) / (1 + weizhi.Grade * 0.05)
            ),
            当前血量: Math.floor(
              (monster.blood * A_player.当前血量) / (1 + weizhi.Grade * 0.05)
            ),
            暴击率: monster.baoji,
            灵根: monster.灵根,
            法球倍率: monster.灵根.法球倍率
          }
          let Data_battle
          let last_msg = ''
          if (A_player.魔值 == 0) {
            //根据魔道值决定先后手顺序
            Data_battle = await zd_battle(A_player, B_player)
            last_msg += A_player.名号 + '悄悄靠近' + B_player.名号
            A_player.当前血量 += Data_battle.A_xue
          } else {
            Data_battle = await zd_battle(B_player, A_player)
            last_msg += A_player.名号 + '杀气过重,被' + B_player.名号 + '发现了'
            A_player.当前血量 += Data_battle.B_xue
          }
          let msgg = Data_battle.msg
          logger.info(msgg)
          let A_win = `${A_player.名号}击败了${B_player.名号}`
          let B_win = `${B_player.名号}击败了${A_player.名号}`
          let arr = action
          let time
          let action_time
          if (msgg.find(item => item == A_win)) {
            time = 10 //时间（分钟）
            action_time = 60000 * time //持续时间，单位毫秒
            arr.A_player = A_player
            arr.action = '搜刮'
            arr.end_time = new Date().getTime() + action_time
            arr.time = action_time
            arr.xijie = -1 //进入二阶段
            last_msg +=
              ',经过一番战斗,击败对手,剩余' +
              A_player.当前血量 +
              '血量,开始搜刮物品'
          } else if (msgg.find(item => item == B_win)) {
            let num = weizhi.Grade
            last_msg +=
              ',经过一番战斗,败下阵来,被抓进了地牢\n在地牢中你找到了秘境之匙x' +
              num
            await addNajieThing(player_id, '秘境之匙', '道具', num)
            //结算完去除
            delete arr.group_id
            let shop = await readShop()
            for (i = 0; i < shop.length; i++) {
              if (shop[i].name == weizhi.name) {
                shop[i].state = 0
                break
              }
            }
            await writeShop(shop)
            time = 60 //时间（分钟）
            action_time = 60000 * time //持续时间，单位毫秒
            arr.action = '禁闭'
            arr.xijie = 1 //关闭洗劫
            arr.end_time = new Date().getTime() + action_time
            const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList'
            const groupList = await redis.smembers(redisGlKey)
            const xx =
              '【全服公告】' +
              A_player.名号 +
              '被' +
              B_player.名号 +
              '抓进了地牢,希望大家遵纪守法,引以为戒'
            for (const group_id of groupList) {
              pushInfo('', group_id, true, xx)
            }
          }
          //写入redis
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))
          msg.push('\n' + last_msg)
          if (is_group) {
            await pushInfo('', push_address, is_group, msg.join('\n'))
          } else {
            await pushInfo('', player_id, is_group, msg.join('\n'))
          }
        }
      } else if (action.xijie == '-1') {
        //5分钟后开始结算阶段二
        end_time = end_time - action.time + 60000 * 5
        //时间过了
        if (now_time >= end_time) {
          let weizhi = action.Place_address
          let thing = await existshop(weizhi.name)
          let arr = action
          let time
          let action_time
          let last_msg = ''
          let thing_name = []
          let shop = await readShop()
          let i
          for (i = 0; i < shop.length; i++) {
            if (shop[i].name == weizhi.name) {
              break
            }
          }
          if (!thing) {
            //没有物品,进入下一阶段
            last_msg += '已经被搬空了'
          } else {
            let x = shop[i].Grade * 2
            while (x > 0 && thing != false) {
              let t //临时存储物品名
              let thing_index = Math.trunc(Math.random() * thing.length)
              t = thing[thing_index]
              thing_name.push(t)
              shop = await readShop()
              for (let j = 0; j < shop[i].one.length; j++) {
                if (shop[i].one[j].name == t.name && shop[i].one[j].数量 > 0) {
                  shop[i].one[j].数量 = 0
                  await writeShop(shop)
                  break
                }
              }
              thing = await existshop(weizhi.name)
              x--
            }
            last_msg += '经过一番搜寻' + arr.A_player.名号 + '找到了'
            for (let j = 0; j < thing_name.length; j++) {
              last_msg += '\n' + thing_name[j].name + ' x ' + thing_name[j].数量
            }
            last_msg +=
              '\n刚出门就被万仙盟的人盯上了,他们仗着人多，你一人无法匹敌，于是撒腿就跑'
          }
          arr.action = '逃跑'
          time = 30 //时间（分钟）
          action_time = 60000 * time //持续时间，单位毫秒
          arr.end_time = new Date().getTime() + action_time
          arr.time = action_time
          arr.xijie = -2 //进入三阶段
          arr.thing = thing_name
          arr.cishu = shop[i].Grade + 1
          //写入redis
          await setDataByUserId(player_id, 'action', JSON.stringify(arr))

          msg.push('\n' + last_msg)
          if (is_group) {
            await pushInfo('', push_address, is_group, msg.join('\n'))
          } else {
            await pushInfo('', player_id, is_group, msg.join('\n'))
          }
        }
      }
    }
  }
})
