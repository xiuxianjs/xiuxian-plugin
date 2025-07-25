import { redis, data, pushInfo } from '@src/api/api'
import {
  isNotNull,
  Harm,
  readShop,
  addNajieThing,
  writeShop,
  __PATH
} from '@src/model'
import { scheduleJob } from 'node-schedule'
import { getDataByUserId, setDataByUserId } from '@src/model/Redis'

scheduleJob('0 0/5 * * * ?', async () => {
  //获取缓存中人物列表

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
      if (action.xijie == '-2') {
        //5分钟后开始结算阶段一
        end_time = end_time - action.time + 60000 * 5
        //时间过了
        if (now_time >= end_time) {
          let weizhi = action.Place_address
          let i //获取对应npc列表的位置
          for (i = 0; i < data.npc_list.length; i++) {
            if (data.npc_list[i].name == '万仙盟') {
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
          let Random = Math.random()
          let npc_damage = Math.trunc(
            Harm(B_player.攻击 * 0.85, A_player.防御) +
              Math.trunc(B_player.攻击 * B_player.法球倍率) +
              B_player.防御 * 0.1
          )
          let last_msg = ''
          if (Random < 0.1) {
            A_player.当前血量 -= npc_damage
            last_msg +=
              B_player.名号 +
              '似乎不屑追你,只是随手丢出神通,剩余血量' +
              A_player.当前血量
          } else if (Random < 0.25) {
            A_player.当前血量 -= Math.trunc(npc_damage * 0.3)
            last_msg +=
              '你引起了' +
              B_player.名号 +
              '的兴趣,' +
              B_player.名号 +
              '决定试探你,只用了三分力,剩余血量' +
              A_player.当前血量
          } else if (Random < 0.5) {
            A_player.当前血量 -= Math.trunc(npc_damage * 1.5)
            last_msg +=
              '你的逃跑让' +
              B_player.名号 +
              '愤怒,' +
              B_player.名号 +
              '使用了更加强大的一次攻击,剩余血量' +
              A_player.当前血量
          } else if (Random < 0.7) {
            A_player.当前血量 -= Math.trunc(npc_damage * 1.3)
            last_msg +=
              '你成功的吸引了所有的仇恨,' +
              B_player.名号 +
              '已经快要抓到你了,强大的攻击已经到了你的面前,剩余血量' +
              A_player.当前血量
          } else if (Random < 0.9) {
            A_player.当前血量 -= Math.trunc(npc_damage * 1.8)
            last_msg +=
              '你们近乎贴脸飞行,' +
              B_player.名号 +
              '的攻势愈加猛烈,已经快招架不住了,剩余血量' +
              A_player.当前血量
          } else {
            A_player.当前血量 -= Math.trunc(npc_damage * 0.5)
            last_msg +=
              '身体快到极限了嘛,你暗暗问道,脚下逃跑的步伐更加迅速,剩余血量' +
              A_player.当前血量
          }
          if (A_player.当前血量 < 0) {
            A_player.当前血量 = 0
          }
          let arr = action
          let shop = await readShop()
          for (i = 0; i < shop.length; i++) {
            if (shop[i].name == weizhi.name) {
              shop[i].state = 0
              break
            }
          }
          if (A_player.当前血量 > 0) {
            arr.A_player = A_player
            arr.cishu--
            arr.A_player = A_player
          } else {
            let num = weizhi.Grade + 1
            last_msg +=
              '\n在躲避追杀中,没能躲过此劫,被抓进了天牢\n在天牢中你找到了秘境之匙x' +
              num
            await addNajieThing(player_id, '秘境之匙', '道具', num)
            delete arr.group_id
            shop[i].state = 0
            await writeShop(shop)
            let time = 60 //时间（分钟）
            let action_time = 60000 * time //持续时间，单位毫秒
            arr.action = '天牢'
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
          if (arr.cishu == 0) {
            //说明成功了
            last_msg += '\n你成功躲过了万仙盟的追杀,躲进了宗门'
            arr.xijie = 1 //关闭洗劫
            arr.end_time = new Date().getTime()
            delete arr.group_id
            for (let j = 0; j < arr.thing.length; j++) {
              await addNajieThing(
                player_id,
                arr.thing[j].name,
                arr.thing[j].class,
                arr.thing[j].数量
              )
              last_msg += ''
            }
            shop[i].Grade++
            if (shop[i].Grade > 3) {
              shop[i].Grade = 3
            }
            shop[i].state = 0
            await writeShop(shop)
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
      }
    }
  }
})
