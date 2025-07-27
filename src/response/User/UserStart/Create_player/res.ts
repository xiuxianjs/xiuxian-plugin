import { Image, useSend } from 'alemonjs'
import { data, redis } from '@src/api/api'
import {
  existplayer,
  __PATH,
  getRandomTalent,
  writePlayer,
  writeEquipment,
  Write_najie,
  addHP,
  writeDanyao
} from '@src/model'

import { selects } from '@src/response/index'
import { getPlayerImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?踏入仙途$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (ifexistplay) {
    let img = await getPlayerImage(e)
    if (img) Send(Image(img))
    return
  }
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  let n = keys.length + 1
  let talent = await getRandomTalent()
  let new_player = {
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
  let new_equipment = {
    武器: data.equipment_list.find(item => item.name == '烂铁匕首'),
    护具: data.equipment_list.find(item => item.name == '破铜护具'),
    法宝: data.equipment_list.find(item => item.name == '廉价炮仗')
  }
  await writeEquipment(usr_qq, new_equipment)
  //初始化纳戒
  let new_najie = {
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
  let img = await getPlayerImage(e)
  if (img) Send(Image(img))
  return false
})
