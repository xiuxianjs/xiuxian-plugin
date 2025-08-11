import { Text, useMessage, useSend, useSubscribe } from 'alemonjs'

import { redis, data, config } from '@src/model/api'
import {
  __PATH,
  addHP,
  existplayer,
  getRandomFromARR,
  getRandomTalent,
  Go,
  notUndAndNull,
  writeDanyao,
  writeEquipment,
  Write_najie,
  writePlayer
} from '@src/model/index'
import fs from 'fs'
import { selects } from '@src/response/index'
import { Show_player } from '../user'
export const regular = /^(#|＃|\/)?再入仙途$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) {
    Send(Text('没存档你转世个锤子!'))
    return false
  } else {
    //没有存档，初始化次数
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', 1)
  }
  const acount = await redis.get('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount')
  if (acount == undefined || acount == null || isNaN(acount) || acount <= 0) {
    await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', 1)
  }
  const player = await await data.getData('player', usr_qq)
  //重生之前先看状态
  if (player.灵石 <= 0) {
    Send(Text(`负债无法再入仙途`))
    return false
  }
  const flag = await Go(e)
  if (!flag) {
    return false
  }
  const now = new Date()
  const nowTime = now.getTime() //获取当前时间戳
  let lastrestart_time = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':last_reCreate_time'
  ) //获得上次重生时间戳,
  lastrestart_time = parseInt(lastrestart_time)
  const cf = config.getConfig('xiuxian', 'xiuxian')
  const time = cf.CD.reborn
  const rebornTime = Math.floor(60000 * time)
  if (nowTime < lastrestart_time + rebornTime) {
    const waittime_m = Math.trunc(
      (lastrestart_time + rebornTime - nowTime) / 60 / 1000
    )
    const waittime_s = Math.trunc(
      ((lastrestart_time + rebornTime - nowTime) % 60000) / 1000
    )
    Send(
      Text(
        `每${rebornTime / 60 / 1000}分钟只能转世一次` +
          `剩余cd:${waittime_m}分 ${waittime_s}秒`
      )
    )
    return false
  }

  /** 回复 */
  await Send(
    Text(
      '一旦转世一切当世与你无缘,你真的要重生吗?回复:【断绝此生】或者【再继仙缘】进行选择'
    )
  )
  /** 设置上下文 */
  const [subscribe] = useSubscribe(e, selects)
  const sub = subscribe.mount(
    async (event, next) => {
      const [message] = useMessage(event)
      const usr_qq = event.UserId
      /** 内容 */
      const choice = event.MessageText
      const now = new Date()
      const nowTime = now.getTime() //获取当前时间戳
      if (choice == '再继仙缘') {
        message.send(format(Text('重拾道心,继续修行')))
        clearTimeout(timeout)
        return
      } else if (choice == '断绝此生') {
        clearTimeout(timeout)
        //得到重生次数
        let acount = await redis.get(
          'xiuxian@1.3.0:' + usr_qq + ':reCreate_acount'
        )
        //
        if (+acount >= 15) {
          // e.reply('')
          message.send(format(Text('灵魂虚弱，已不可转世！')))
          return
        }
        acount = Number(acount)
        acount++
        //重生牵扯到宗门模块
        const player = await data.getData('player', usr_qq)
        if (notUndAndNull(player.宗门)) {
          if (player.宗门.职位 != '宗主') {
            //不是宗主
            const ass = await data.getAssociation(player.宗门.宗门名称)
            ass[player.宗门.职位] = ass[player.宗门.职位].filter(
              item => item != usr_qq
            )
            ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq) //原来的成员表删掉这个B
            await data.setAssociation(ass.宗门名称, ass)
            delete player.宗门
            await data.setData('player', usr_qq, player)
          } else {
            //是宗主
            const ass = await data.getAssociation(player.宗门.宗门名称)
            if (ass.所有成员.length < 2) {
              fs.rmSync(`${data.association}/${player.宗门.宗门名称}.json`)
            } else {
              ass['所有成员'] = ass['所有成员'].filter(item => item != usr_qq) //原来的成员表删掉这个B
              //随机一个幸运儿的QQ,优先挑选等级高的
              let randmember_qq
              if (ass.长老.length > 0) {
                randmember_qq = await getRandomFromARR(ass.长老)
              } else if (ass.内门弟子.length > 0) {
                randmember_qq = await getRandomFromARR(ass.内门弟子)
              } else {
                randmember_qq = await getRandomFromARR(ass.所有成员)
              }
              const randmember = await data.getData('player', randmember_qq) //获取幸运儿的存档
              ass[randmember.宗门.职位] = ass[randmember.宗门.职位].filter(
                item => item != randmember_qq
              ) //原来的职位表删掉这个幸运儿
              ass['宗主'] = randmember_qq //新的职位表加入这个幸运儿
              randmember.宗门.职位 = '宗主' //成员存档里改职位
              data.setData('player', randmember_qq, randmember) //记录到存档
              data.setAssociation(ass.宗门名称, ass) //记录到宗门
            }
          }
        }
        await redis.del(__PATH.player_path)
        await redis.del(__PATH.equipment_path)
        await redis.del(__PATH.najie_path)
        message.send(format(Text('当前存档已清空!开始重生')))
        message.send(
          format(
            Text(
              '来世，信则有，不信则无，岁月悠悠，世间终会出现两朵相同的花，千百年的回眸，一花凋零，一花绽。是否为同一朵，任后人去评断！！'
            )
          )
        )
        await Create_player(e)
        await redis.set(
          'xiuxian@1.3.0:' + usr_qq + ':last_reCreate_time',
          nowTime
        ) //redis设置本次改名时间戳
        await redis.set('xiuxian@1.3.0:' + usr_qq + ':reCreate_acount', acount)
      } else {
        message.send(
          format(Text('请回复:【断绝此生】或者【再继仙缘】进行选择'))
        )
        next()
      }
    },
    ['UserId']
  )
  const timeout = setTimeout(
    () => {
      try {
        // 不能在回调中执行
        subscribe.cancel(sub)
        // message.send(format(Text('超时自动取消')))
        Send(Text('超时自动取消操作'))
      } catch (e) {
        logger.error('取消订阅失败', e)
      }
    },
    1000 * 60 * 1
  ) //2分钟超时
})

async function Create_player(e) {
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (ifexistplay) {
    Show_player(e)
    return false
  }
  //初始化玩家信息
  const File_msg = fs.readdirSync(__PATH.player_path)
  const n = File_msg.length + 1
  const talent = await getRandomTalent()
  const new_player = {
    id: e.UserId,
    sex: 0, //性别
    名号: `路人甲${n}号`,
    宣言: '这个人很懒还没有写',
    avatar: e.UserAvatar || 'https://s1.ax1x.com/2022/08/09/v8XV3q.jpg',
    level_id: 1, //练气境界
    Physique_id: 1, //练体境界
    race: 1, //种族
    修为: 1, //练气经验
    血气: 1, //练体经验
    灵石: 10000,
    灵根: talent,
    神石: 0,
    favorability: 0,
    breakthrough: false,
    linggen: [],
    linggenshow: 1, //灵根显示，隐藏
    学习的功法: [],
    修炼效率提升: talent.eff,
    连续签到天数: 0,
    攻击加成: 0,
    防御加成: 0,
    生命加成: 0,
    power_place: 1, //仙界状态
    当前血量: 8000,
    lunhui: 0,
    lunhuiBH: 0,
    轮回点: 10,
    occupation: [], //职业
    occupation_level: 1,
    镇妖塔层数: 0,
    神魄段数: 0,
    魔道值: 0,
    仙宠: [],
    练气皮肤: 0,
    装备皮肤: 0,
    幸运: 0,
    addluckyNo: 0,
    师徒任务阶段: 0,
    师徒积分: 0
  }
  await writePlayer(usr_qq, new_player)
  //初始化装备
  const new_equipment = {
    武器: data.equipment_list.find(item => item.name == '烂铁匕首'),
    护具: data.equipment_list.find(item => item.name == '破铜护具'),
    法宝: data.equipment_list.find(item => item.name == '廉价炮仗')
  }
  await writeEquipment(usr_qq, new_equipment)
  //初始化纳戒
  const new_najie = {
    等级: 1,
    灵石上限: 5000,
    灵石: 0,
    装备: [],
    丹药: [],
    道具: [],
    功法: [],
    草药: [],
    材料: [],
    仙宠: [],
    仙宠口粮: []
  }
  await Write_najie(usr_qq, new_najie)
  await addHP(usr_qq, 999999)
  const arr = {
    biguan: 0, //闭关状态
    biguanxl: 0, //增加效率
    xingyun: 0,
    lianti: 0,
    ped: 0,
    modao: 0,
    beiyong1: 0, //ped
    beiyong2: 0,
    beiyong3: 0,
    beiyong4: 0,
    beiyong5: 0
  }
  await writeDanyao(usr_qq, arr)
  await Show_player(e)
}
