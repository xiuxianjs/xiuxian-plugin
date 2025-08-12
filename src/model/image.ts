import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import data from './XiuxianData.js'
import config from './Config.js'
import { useSend, Text, EventsMessageCreateEnum, Image } from 'alemonjs'
import { screenshot } from '@src/image/index.js'
import type { Player, Equipment, Najie, StrandResult } from '../types/player.js'
import { getRandomTalent } from './cultivation.js'
import type {
  ScreenshotResult,
  NamedItem,
  PlayerStatus,
  SendFn,
  AssociationInfo,
  ExchangeView,
  ForumView
} from '../types/model.js'
import {
  getEquipmentDataSafe,
  getPlayerDataSafe,
  readPlayer,
  readNajie
} from './xiuxian_impl.js'
import { getPlayerAction, notUndAndNull } from './common.js'
import { playerEfficiency } from './efficiency.js'
import { readEquipment } from './equipment.js'
import { readExchange, writeExchange, readForum, writeForum } from './trade.js'
import { GetPower, bigNumberTransform } from './utils/number.js'
import { readQinmidu, writeQinmidu } from './qinmidu.js'

// ==== 类型辅助声明（已迁移至 src/types/model.ts） ====
// 原地定义已移除：ScreenshotResult, NamedItem, ExchangeEntry, ForumEntry, PlayerStatus, SendFn, AssociationInfo

function isAssociationInfo(v: unknown): v is AssociationInfo {
  return (
    !!v &&
    typeof v === 'object' &&
    '宗主' in v &&
    '副宗主' in v &&
    '长老' in v &&
    '内门弟子' in v &&
    '外门弟子' in v &&
    '维护时间' in v &&
    '宗门驻地' in v &&
    '宗门等级' in v &&
    'power' in v
  )
}

export async function getSupermarketImage(
  e: EventsMessageCreateEnum,
  thing_class?: string
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let Exchange_list: ExchangeView[] = []
  try {
    const raw = await readExchange()
    Exchange_list = raw.map((rec, idx) => ({
      ...rec,
      num: idx + 1,
      now_time: rec.last_offer_price,
      name: rec.thing
    }))
  } catch {
    await writeExchange([])
  }
  if (thing_class) {
    Exchange_list = Exchange_list.filter(item => item.name.class == thing_class)
  }
  Exchange_list.sort((a, b) => b.now_time - a.now_time)
  const supermarket_data = {
    user_id: usr_qq,
    Exchange_list
  }
  const img = await screenshot('supermarket', e.UserId, supermarket_data)
  return img
}

export async function getForumImage(
  e: EventsMessageCreateEnum,
  thing_class?: string
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let Forum: ForumView[] = []
  try {
    const raw = await readForum()
    Forum = raw.map((rec, idx) => ({
      ...rec,
      num: idx + 1,
      now_time: rec.last_offer_price
    }))
  } catch {
    await writeForum([])
  }
  if (thing_class) {
    Forum = Forum.filter(item => item.thing.class == thing_class)
  }
  Forum.sort((a, b) => b.now_time - a.now_time)
  const forum_data = {
    user_id: usr_qq,
    Forum
  }
  const img = await screenshot('forum', e.UserId, forum_data)
  return img
}

export async function getdanfangImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }

  const danfang_list = data.danfang_list

  const danfang_data = {
    user_id: usr_qq,
    danfang_list: danfang_list
  }
  const img = await screenshot('danfang', e.UserId, danfang_data)
  return img
}

export async function getTuzhiImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }

  const tuzhi_list = data.tuzhi_list

  const tuzhi_data = {
    user_id: usr_qq,
    tuzhi_list: tuzhi_list
  }
  const img = await screenshot('tuzhi', e.UserId, tuzhi_data)
  return img
}

/**
 * 返回柠檬堂
 * @return image
 */
export async function getNingmenghomeImage(
  e: EventsMessageCreateEnum,
  thing_type?: string
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  let commodities_list = data.commodities_list
  if (thing_type != '') {
    if (
      thing_type == '装备' ||
      thing_type == '丹药' ||
      thing_type == '功法' ||
      thing_type == '道具' ||
      thing_type == '草药'
    ) {
      commodities_list = commodities_list.filter(
        item => item.class == thing_type
      )
    } else if (
      thing_type == '武器' ||
      thing_type == '护具' ||
      thing_type == '法宝' ||
      thing_type == '修为' ||
      thing_type == '血量' ||
      thing_type == '血气' ||
      thing_type == '天赋'
    ) {
      commodities_list = commodities_list.filter(
        item => item.type == thing_type
      )
    }
  }
  const ningmenghome_data = {
    user_id: usr_qq,
    commodities_list: commodities_list
  }
  const img = await screenshot('ningmenghome', e.UserId, ningmenghome_data)
  return img
}
/**
 * 返回万宝楼
 * @return image
 */
export async function getValuablesImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const valuables_data = {
    user_id: usr_qq
  }
  const img = await screenshot('valuables', e.UserId, valuables_data)
  return img
}
/**
 * @description: 进度条渲染
 * @param {Number} res 百分比小数
 * @return {*} css样式
 */
function Strand(
  now: number,
  max: number
): {
  style: { width: string }
  num: string
} {
  // 确保输入值是有效的数字
  const validNow = Number(now) || 0
  const validMax = Number(max) || 1

  const num = ((validNow / validMax) * 100).toFixed(0)
  const mini = Number(num) > 100 ? 100 : num

  const strand = {
    style: { width: `${mini}%` },
    num: num
  }

  return strand
}

/**
 * 返回该玩家的仙宠图片
 * @return image
 */
export async function getXianChongImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  let i: number
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const playerData = await data.getData('player', usr_qq)
  if (!playerData || Array.isArray(playerData)) {
    return
  }
  const player = playerData as Player
  const najie: Najie | null = await readNajie(usr_qq)
  if (!najie) return
  const XianChong_have: NamedItem[] = []
  const XianChong_need: NamedItem[] = []
  const Kouliang: NamedItem[] = []
  const XianChong_list = data.xianchon
  const Kouliang_list = data.xianchonkouliang
  for (i = 0; i < XianChong_list.length; i++) {
    if (najie.仙宠.find(item => item.name == XianChong_list[i].name)) {
      XianChong_have.push(XianChong_list[i])
    } else if (player.仙宠.name == XianChong_list[i].name) {
      XianChong_have.push(XianChong_list[i])
    } else {
      XianChong_need.push(XianChong_list[i])
    }
  }
  for (i = 0; i < Kouliang_list.length; i++) {
    Kouliang.push(Kouliang_list[i])
  }
  const player_data = {
    nickname: player.名号,
    XianChong_have,
    XianChong_need,
    Kouliang
  }
  return await screenshot('xianchong', e.UserId, player_data)
}

/**
 * 返回该玩家的道具图片
 * @return image
 */
export async function getDaojuImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const playerData = await data.getData('player', usr_qq)
  if (!playerData || Array.isArray(playerData)) {
    return
  }
  const player = playerData as Player
  const najie: Najie | null = await readNajie(usr_qq)
  if (!najie) return
  const daoju_have: NamedItem[] = []
  const daoju_need: NamedItem[] = []
  for (const i of data.daoju_list) {
    if (najie.道具.find(item => item.name == i.name)) {
      daoju_have.push(i)
    } else {
      daoju_need.push(i)
    }
  }
  const player_data = {
    user_id: usr_qq,
    nickname: player.名号,
    daoju_have,
    daoju_need
  }

  return await screenshot('daoju', e.UserId, player_data)
}

/**
 * 返回该玩家的武器图片
 * @return image
 */
export async function getWuqiImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const player = await getPlayerDataSafe(usr_qq)
  if (!player) return
  const najie: Najie | null = await readNajie(usr_qq)
  if (!najie) return
  const equipment = await readEquipment(usr_qq)
  if (!equipment) return
  const wuqi_have: NamedItem[] = []
  const wuqi_need: NamedItem[] = []
  const wuqi_list = [
    'equipment_list',
    'timeequipmen_list',
    'duanzhaowuqi',
    'duanzhaohuju',
    'duanzhaobaowu'
  ]
  for (const i of wuqi_list) {
    const arr = (data as Record<string, unknown>)[i]
    if (!Array.isArray(arr)) continue
    for (const j of arr as NamedItem[]) {
      if (
        najie['装备'].find(item => item.name == j.name) &&
        !wuqi_have.find(item => item.name == j.name)
      ) {
        wuqi_have.push(j)
      } else if (
        (equipment['武器'].name == j.name ||
          equipment['法宝'].name == j.name ||
          equipment['护具'].name == j.name) &&
        !wuqi_have.find(item => item.name == j.name)
      ) {
        wuqi_have.push(j)
      } else if (!wuqi_need.find(item => item.name == j.name)) {
        wuqi_need.push(j)
      }
    }
  }

  const player_data = {
    user_id: usr_qq,
    nickname: player.名号,
    wuqi_have,
    wuqi_need
  }

  return await screenshot('wuqi', e.UserId, player_data)
}

/**
 * 返回该玩家的丹药图片
 * @return image
 */
export async function getDanyaoImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const player: Player | null = await readPlayer(usr_qq)
  if (!player) return
  const najie = await readNajie(usr_qq)
  if (!najie) return
  const danyao_have: NamedItem[] = []
  const danyao_need: NamedItem[] = []
  const danyao = ['danyao_list', 'timedanyao_list', 'newdanyao_list']
  for (const i of danyao) {
    const arr = (data as Record<string, unknown>)[i]
    if (!Array.isArray(arr)) continue
    for (const j of arr as NamedItem[]) {
      if (
        najie['丹药'].find(item => item.name == j.name) &&
        !danyao_have.find(item => item.name == j.name)
      ) {
        danyao_have.push(j)
      } else if (!danyao_need.find(item => item.name == j.name)) {
        danyao_need.push(j)
      }
    }
  }
  const player_data = {
    user_id: usr_qq,
    nickname: player.名号,
    danyao_have,
    danyao_need
  }
  return await screenshot('danyao', e.UserId, player_data)
}

/**
 * 返回该玩家的功法图片
 * @return image
 */
export async function getGongfaImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const player = await await getPlayerDataSafe(usr_qq)
  if (!player) {
    return
  }
  // 学习的功法 可能被旧版本存档写成非数组（例如对象或 undefined），这里做兼容
  const rawXuexi = (player as unknown as { 学习的功法?: unknown }).学习的功法
  const xuexi_gongfa: string[] = Array.isArray(rawXuexi)
    ? rawXuexi.filter((v: unknown) => typeof v === 'string')
    : []
  const gongfa_have: NamedItem[] = []
  const gongfa_need: NamedItem[] = []
  const gongfa = ['gongfa_list', 'timegongfa_list']
  for (const i of gongfa) {
    const arr = (data as Record<string, unknown>)[i]
    if (!Array.isArray(arr)) continue
    for (const j of arr as NamedItem[]) {
      if (
        xuexi_gongfa.includes(j.name) &&
        !gongfa_have.find(item => item.name == j.name)
      ) {
        gongfa_have.push(j)
      } else if (!gongfa_need.find(item => item.name == j.name)) {
        gongfa_need.push(j)
      }
    }
  }
  const player_data = {
    user_id: usr_qq,
    nickname: player.名号,
    gongfa_have,
    gongfa_need
  }

  return await screenshot('gongfa', e.UserId, player_data)
}

/**
 * 返回该玩家的法体
 * @return image
 */
export async function getPowerImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const Send: SendFn = useSend(e) as SendFn
  const player = await await getPlayerDataSafe(usr_qq)
  if (!player) {
    Send(Text('玩家数据获取失败'))
    return
  }
  let lingshi = Math.trunc(player.灵石)
  if (player.灵石 > 999999999999) {
    lingshi = 999999999999
  }
  await playerEfficiency(usr_qq)
  if (!notUndAndNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return
  }
  let this_association
  if (!notUndAndNull(player.宗门)) {
    this_association = {
      宗门名称: '无',
      职位: '无'
    }
  } else {
    this_association = player.宗门
  }
  //境界名字需要查找境界名
  const levelMax = data.LevelMax_list.find(
    item => item.level_id == player.Physique_id
  ).level
  const need_xueqi = data.LevelMax_list.find(
    item => item.level_id == player.Physique_id
  ).exp
  const playercopy = {
    user_id: usr_qq,
    nickname: player.名号,
    need_xueqi: need_xueqi,
    xueqi: player.血气,
    levelMax: levelMax,
    lingshi: lingshi,
    镇妖塔层数: player.镇妖塔层数,
    神魄段数: player.神魄段数,
    hgd: player.favorability,
    player_maxHP: player.血量上限,
    player_nowHP: player.当前血量,
    learned_gongfa: player.学习的功法,
    association: this_association
  }
  return await screenshot('playercopy', e.UserId, playercopy)
}

/**
 * 返回该玩家的存档图片
 * @return image
 */
export async function getPlayerImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const Send: SendFn = useSend(e) as SendFn
  let 法宝评级
  let 护具评级
  let 武器评级
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const player = await getPlayerDataSafe(usr_qq)
  if (!player) {
    Send(Text('玩家数据获取失败'))
    return
  }

  // 学习的功法 可能被旧版本存档写成非数组（例如对象或 undefined），这里做兼容
  const rawXuexi = (player as unknown as { 学习的功法?: unknown }).学习的功法
  const learned_gongfa: string[] = Array.isArray(rawXuexi)
    ? rawXuexi.filter((v: unknown) => typeof v === 'string')
    : []

  const equipment = await getEquipmentDataSafe(usr_qq)
  if (!equipment) {
    Send(Text('装备数据获取失败'))
    return
  }
  const player_status_raw = await getPlayerAction(usr_qq)
  const player_status: PlayerStatus = {
    action: String(player_status_raw.action),
    time:
      typeof player_status_raw.time === 'number'
        ? String(player_status_raw.time)
        : (player_status_raw.time ?? null)
  }
  let status = '空闲'
  if (player_status.time != null) {
    status = player_status.action + '(剩余时间:' + player_status.time + ')'
  }
  let lingshi: number = Math.trunc(player.灵石)
  if (player.灵石 > 999999999999) {
    lingshi = 999999999999
  }
  if (player.宣言 == null || player.宣言 == undefined) {
    player.宣言 = '这个人很懒什么都没写'
  }
  if (player.灵根 == null || player.灵根 == undefined) {
    player.灵根 = await getRandomTalent()
  }
  await playerEfficiency(usr_qq) // 注意这里刷新了修炼效率提升
  if ((await player.linggenshow) != 0) {
    player.灵根.type = '无'
    player.灵根.name = '未知'
    player.灵根.法球倍率 = '0'
    player.修炼效率提升 = 0
  }
  if (!notUndAndNull(player.level_id)) {
    Send(Text('存档错误'))
    return
  }
  if (!notUndAndNull(player.sex)) {
    Send(Text('存档错误'))
    return
  }
  let nd = '无'
  if (player.隐藏灵根) nd = player.隐藏灵根.name
  const zd = ['攻击', '防御', '生命加成', '防御加成', '攻击加成']
  const num: number[] = []
  const p: (number | '')[] = []
  const kxjs: (string | number)[] = []
  let count = 0
  for (const j of zd) {
    if (player[j] == 0) {
      p[count] = ''
      kxjs[count] = 0
      count++
      continue
    }
    const base = Number(player[j] || 0)
    p[count] = Math.floor(Math.log(base) / Math.LN10)
    num[count] = base * 10 ** -(p[count] as number)
    kxjs[count] = `${num[count].toFixed(2)} x 10`
    count++
  }
  //境界名字需要查找境界名
  const level = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level
  const power = (
    (player.攻击 * 0.9 +
      player.防御 * 1.1 +
      player.血量上限 * 0.6 +
      player.暴击率 * player.攻击 * 0.5 +
      Number(player.灵根?.法球倍率 || 0) * player.攻击) /
    10000
  ).toFixed(2)
  const power2 = (
    (player.攻击 + player.防御 * 1.1 + player.血量上限 * 0.5) /
    10000
  ).toFixed(2)
  const level2 = data.LevelMax_list.find(
    item => item.level_id == player.Physique_id
  ).level
  const need_exp = data.Level_list.find(
    item => item.level_id == player.level_id
  ).exp
  const need_exp2 = data.LevelMax_list.find(
    item => item.level_id == player.Physique_id
  ).exp
  let occupation = player.occupation
  let occupation_level
  let occupation_level_name
  let occupation_exp
  let occupation_need_exp
  if (!notUndAndNull(player.occupation)) {
    occupation = '无'
    occupation_level_name = '-'
    occupation_exp = 0
    occupation_need_exp = 1
  } else {
    occupation_level = player.occupation_level
    occupation_level_name = data.occupation_exp_list.find(
      item => item.id == occupation_level
    ).name
    occupation_exp = player.occupation_exp
    occupation_need_exp = data.occupation_exp_list.find(
      item => item.id == occupation_level
    ).experience
  }
  let this_association
  if (!notUndAndNull(player.宗门)) {
    this_association = {
      宗门名称: '无',
      职位: '无'
    }
  } else {
    this_association = player.宗门
  }
  const pinji = ['劣', '普', '优', '精', '极', '绝', '顶']
  if (!equipment.武器) {
    equipment.武器 = { atk: 0, def: 0, HP: 0, bao: 0 }
  }
  if (!notUndAndNull(equipment.武器.pinji)) {
    武器评级 = '无'
  } else {
    武器评级 = pinji[equipment.武器.pinji]
  }
  if (!equipment.护具) {
    equipment.护具 = { atk: 0, def: 0, HP: 0, bao: 0 }
  }
  if (!notUndAndNull(equipment.护具.pinji)) {
    护具评级 = '无'
  } else {
    护具评级 = pinji[equipment.护具.pinji]
  }
  if (!equipment.法宝) {
    equipment.法宝 = { atk: 0, def: 0, HP: 0, bao: 0 }
  }
  if (!notUndAndNull(equipment.法宝.pinji)) {
    法宝评级 = '无'
  } else {
    法宝评级 = pinji[equipment.法宝.pinji]
  }
  const rank_lianqi = data.Level_list.find(
    item => item.level_id == player.level_id
  ).level
  const expmax_lianqi = data.Level_list.find(
    item => item.level_id == player.level_id
  ).exp
  const rank_llianti = data.LevelMax_list.find(
    item => item.level_id == player.Physique_id
  ).level
  const expmax_llianti = need_exp2
  const rank_liandan = occupation_level_name
  const expmax_liandan = occupation_need_exp
  const strand_hp = Strand(player.当前血量, player.血量上限)
  const strand_lianqi = Strand(player.修为, expmax_lianqi)
  const strand_llianti = Strand(player.血气, expmax_llianti)
  const strand_liandan = Strand(occupation_exp, expmax_liandan)
  const Power = GetPower(
    player.攻击,
    player.防御,
    player.血量上限,
    player.暴击率
  )
  const PowerMini = bigNumberTransform(Power)
  const bao: string = Math.floor(player.暴击率 * 100) + '%'
  // 创建装备数据的副本以进行修改
  const equipmentCopy = {
    武器: {
      ...equipment.武器,
      bao: Math.floor((equipment.武器.bao || 0) * 100) + '%'
    },
    护具: {
      ...equipment.护具,
      bao: Math.floor((equipment.护具.bao || 0) * 100) + '%'
    },
    法宝: {
      ...equipment.法宝,
      bao: Math.floor((equipment.法宝.bao || 0) * 100) + '%'
    }
  }
  const lingshiDisplay = bigNumberTransform(lingshi)
  let hunyin = '未知'
  const A = usr_qq
  let qinmidu: Array<{ QQ_A: string; QQ_B: string; 婚姻: number }> = []
  try {
    qinmidu = await readQinmidu()
  } catch {
    //没有建立一个
    await writeQinmidu([])
  }
  for (let i = 0; i < qinmidu.length; i++) {
    if (qinmidu[i].QQ_A == A || qinmidu[i].QQ_B == A) {
      if (qinmidu[i].婚姻 > 0) {
        if (qinmidu[i].QQ_A == A) {
          const B = (await readPlayer(qinmidu[i].QQ_B)) as Player | null
          hunyin = B?.名号 || hunyin
        } else {
          const APlayer = (await readPlayer(qinmidu[i].QQ_A)) as Player | null
          hunyin = APlayer?.名号 || hunyin
        }
        break
      }
    }
  }
  const action: number | string | undefined = player.练气皮肤 as
    | number
    | string
    | undefined
  const player_data = {
    neidan: nd,
    pifu: action,
    user_id: usr_qq,
    player, // 玩家数据
    rank_lianqi, // 练气境界
    expmax_lianqi, // 练气需求经验
    rank_llianti, // 炼体境界
    expmax_llianti, // 炼体需求经验
    rank_liandan, // 炼丹境界
    expmax_liandan, // 炼丹需求经验
    equipment, // 装备数据
    talent: Math.floor(Number(player.修炼效率提升 || 0) * 100), //
    player_action: status, // 当前状态
    this_association, // 宗门信息
    strand_hp,
    strand_lianqi,
    strand_llianti,
    strand_liandan,
    PowerMini, // 玩家战力
    bao,
    nickname: player.名号,
    linggen: player.灵根, //
    declaration: player.宣言,
    need_exp: need_exp,
    need_exp2: need_exp2,
    exp: player.修为,
    exp2: player.血气,
    zdl: power,
    镇妖塔层数: player.镇妖塔层数,
    sh: player.神魄段数,
    mdz: player.魔道值,
    hgd: player.favorability,
    jczdl: power2,
    level: level,
    level2: level2,
    lingshi: lingshiDisplay,
    player_maxHP: player.血量上限,
    player_nowHP: player.当前血量,
    player_atk: kxjs[0],
    player_atk2: p[0],
    player_def: kxjs[1],
    player_def2: p[1],
    生命加成: kxjs[2],
    生命加成_t: p[2],
    防御加成: kxjs[3],
    防御加成_t: p[3],
    攻击加成: kxjs[4],
    攻击加成_t: p[4],
    player_bao: player.暴击率,
    player_bao2: player.暴击伤害,
    occupation: occupation,
    occupation_level: occupation_level_name,
    occupation_exp: occupation_exp,
    occupation_need_exp: occupation_need_exp,
    arms: equipmentCopy.武器,
    armor: equipmentCopy.护具,
    treasure: equipmentCopy.法宝,
    association: this_association,
    learned_gongfa: learned_gongfa,
    婚姻状况: hunyin,
    武器评级: 武器评级,
    护具评级: 护具评级,
    法宝评级: 法宝评级,
    avatar: player.avatar || `https://q1.qlogo.cn/g?b=qq&s=0&nk=${usr_qq}`
  }
  return await screenshot('player', e.UserId, player_data)
}

/**
 * 我的宗门
 * @return image
 */
export async function getAssociationImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  let item
  const usr_qq = e.UserId
  const Send: SendFn = useSend(e) as SendFn
  //无存档
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  //门派
  const player = await getPlayerDataSafe(usr_qq)
  if (!player || !notUndAndNull(player.宗门)) {
    return
  }
  //境界
  //let now_level_id;
  if (!notUndAndNull(player.level_id)) {
    Send(Text('请先#同步信息'))
    return
  }
  //有加入宗门
  const zongmenName =
    typeof player.宗门 === 'string' ? player.宗门 : player.宗门?.宗门名称
  const assRaw = await data.getAssociation(zongmenName)
  if (assRaw === 'error' || Array.isArray(assRaw)) {
    Send(Text('宗门数据获取失败'))
    return
  }
  if (!isAssociationInfo(assRaw)) {
    Send(Text('宗门数据结构异常'))
    return
  }
  const ass = assRaw
  //寻找
  const mainqqData = await data.getData('player', String(ass.宗主))
  if (mainqqData === 'error' || Array.isArray(mainqqData)) {
    Send(Text('宗主数据获取失败'))
    return
  }
  const mainqq = mainqqData as Player
  //仙宗
  const xian = ass.power
  let weizhi
  if (xian == 0) {
    weizhi = '凡界'
  } else {
    weizhi = '仙界'
  }
  //门槛
  const level = data.Level_list.find(
    item => item.level_id === ass.最低加入境界
  ).level
  // 副宗主
  const fuzong = []
  for (item in ass.副宗主 || {}) {
    const qq = ass.副宗主[item]
    const pData = await data.getData('player', qq)
    const name =
      (pData && !Array.isArray(pData) && (pData as Player).名号) || '未知'
    fuzong[item] = `道号：${name}QQ：${qq}`
  }
  //长老
  const zhanglao = []
  for (item in ass.长老 || {}) {
    const qq = ass.长老[item]
    const pData = await data.getData('player', qq)
    const name =
      (pData && !Array.isArray(pData) && (pData as Player).名号) || '未知'
    zhanglao[item] = `道号：${name}QQ：${qq}`
  }
  //内门弟子
  const neimen = []
  for (item in ass.内门弟子 || {}) {
    const qq = ass.内门弟子[item]
    const pData = await data.getData('player', qq)
    const name =
      (pData && !Array.isArray(pData) && (pData as Player).名号) || '未知'
    neimen[item] = `道号：${name}QQ：${qq}`
  }
  //外门弟子
  const waimen = []
  for (item in ass.外门弟子 || {}) {
    const qq = ass.外门弟子[item]
    const pData = await data.getData('player', qq)
    const name =
      (pData && !Array.isArray(pData) && (pData as Player).名号) || '未知'
    waimen[item] = `道号：${name}QQ：${qq}`
  }
  let state = '需要维护'
  const now = new Date()
  const nowTime = now.getTime() //获取当前日期的时间戳
  if (Number(ass.维护时间) > nowTime - 1000 * 60 * 60 * 24 * 7) {
    state = '不需要维护'
  }
  //计算修炼效率
  let xiulian
  const dongTan = await data.bless_list.find(item => item.name == ass.宗门驻地)
  if (ass.宗门驻地 == 0) {
    xiulian = Number(ass.宗门等级) * 0.05 * 100
  } else {
    try {
      xiulian =
        Number(ass.宗门等级) * 0.05 * 100 +
        Number(dongTan?.efficiency || 0) * 100
    } catch {
      xiulian = Number(ass.宗门等级) * 0.05 * 100 + 0.5
    }
  }
  xiulian = Math.trunc(xiulian)
  if (ass.宗门神兽 == 0) {
    ass.宗门神兽 = '无'
  }
  const association_data = {
    user_id: usr_qq,
    ass: ass,
    mainname: mainqq.名号,
    mainqq: ass.宗主,
    xiulian: xiulian,
    weizhi: weizhi,
    level: level,
    mdz: player.魔道值,
    zhanglao: zhanglao,
    fuzong: fuzong,
    neimen: neimen,
    waimen: waimen,
    state: state
  }

  return await screenshot('association', e.UserId, association_data)
}

/**
 * 返回该玩家的装备图片
 * @return image
 */
export async function getQquipmentImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const playerData = await data.getData('player', usr_qq)
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay || !playerData || Array.isArray(playerData)) {
    return
  }
  const player = playerData as Player
  const bao = Math.trunc(Math.floor(player.暴击率 * 100))
  const equipmentData = await data.getData('equipment', usr_qq)
  if (equipmentData === 'error' || Array.isArray(equipmentData)) {
    return
  }
  const equipment = equipmentData as Equipment
  const player_data = {
    user_id: usr_qq,
    mdz: player.魔道值,
    nickname: player.名号,
    arms: equipment.武器,
    armor: equipment.护具,
    treasure: equipment.法宝,
    player_atk: player.攻击,
    player_def: player.防御,
    player_bao: bao,
    player_maxHP: player.血量上限,
    player_nowHP: player.当前血量,
    pifu: Number(player.装备皮肤 || 0)
  }
  return await screenshot('equipment', e.UserId, player_data)
}
/**
 * 返回该玩家的纳戒图片
 * @return image
 */
export async function getNajieImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const playerData = await data.getData('player', usr_qq)
  if (!playerData || Array.isArray(playerData)) {
    return
  }
  const player = playerData as Player
  const najie: Najie | null = await readNajie(usr_qq)
  if (!najie) return
  const lingshi = Math.trunc(najie.灵石)
  const lingshi2 = Math.trunc(najie.灵石上限 || 0)
  const strand_hp: StrandResult = Strand(player.当前血量, player.血量上限)
  const strand_lingshi: StrandResult = Strand(najie.灵石, najie.灵石上限 || 0)
  const player_data = {
    user_id: usr_qq,
    player: player,
    najie: najie,
    mdz: player.魔道值,
    nickname: player.名号,
    najie_lv: najie.等级 || 1,
    player_maxHP: player.血量上限,
    player_nowHP: player.当前血量,
    najie_maxlingshi: lingshi2,
    najie_lingshi: lingshi,
    najie_equipment: najie.装备,
    najie_danyao: najie.丹药,
    najie_daoju: najie.道具,
    najie_gongfa: najie.功法,
    najie_caoyao: najie.草药,
    najie_cailiao: najie.材料,
    strand_hp: strand_hp,
    strand_lingshi: strand_lingshi,
    pifu: player.练气皮肤 || 0
  }
  return await screenshot('najie', e.UserId, player_data)
}

/**
 * 返回境界列表图片
 * @return image
 */
export async function getStateImage(
  e: EventsMessageCreateEnum,
  all_level: boolean
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const playerData = await data.getData('player', usr_qq)
  if (!playerData || Array.isArray(playerData)) {
    return
  }
  const player = playerData as Player
  const Level_id = player.level_id
  let Level_list = data.Level_list
  //循环删除表信息
  if (!all_level) {
    for (let i = 1; i <= 60; i++) {
      if (i > Level_id - 6 && i < Level_id + 6) {
        continue
      }
      Level_list = await Level_list.filter(item => item.level_id != i)
    }
  }
  const state_data = {
    user_id: usr_qq,
    Level_list: Level_list
  }
  return await screenshot('state', e.UserId, state_data)
}

export async function getStatezhiyeImage(
  e: EventsMessageCreateEnum,
  all_level: boolean
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const playerData = await data.getData('player', usr_qq)
  if (!playerData || Array.isArray(playerData)) {
    return
  }
  const player = playerData as Player
  const Level_id = player.occupation_level || 0
  let Level_list = data.occupation_exp_list
  //循环删除表信息
  if (!all_level) {
    for (let i = 0; i <= 60; i++) {
      if (i > Level_id - 6 && i < Level_id + 6) {
        continue
      }
      Level_list = await Level_list.filter(item => item.id != i)
    }
  }
  const state_data = {
    user_id: usr_qq,
    Level_list: Level_list
  }
  return await screenshot('statezhiye', e.UserId, state_data)
}

/**
 * 返回境界列表图片
 * @return image
 */
export async function getStatemaxImage(
  e: EventsMessageCreateEnum,
  all_level: boolean
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  const playerData = await data.getData('player', usr_qq)
  if (!playerData || Array.isArray(playerData)) {
    return
  }
  const player = playerData as Player
  const Level_id = player.Physique_id
  let LevelMax_list = data.LevelMax_list
  //循环删除表信息
  if (!all_level) {
    for (let i = 1; i <= 60; i++) {
      if (i > Level_id - 6 && i < Level_id + 6) {
        continue
      }
      LevelMax_list = await LevelMax_list.filter(item => item.level_id != i)
    }
  }
  const statemax_data = {
    user_id: usr_qq,
    LevelMax_list: LevelMax_list
  }
  return await screenshot('statemax', e.UserId, statemax_data)
}

export async function getTalentImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) {
    return
  }
  // let player = await await data.getData('player', usr_qq)
  // let Level_id = player.Physique_id
  const talent_list = data.talent_list
  const talent_data = {
    user_id: usr_qq,
    talent_list: talent_list
  }
  return await screenshot('talent', e.UserId, talent_data)
}

/**
 * 返回修仙设置
 * @return image
 */
export async function getAdminsetImage(
  e: EventsMessageCreateEnum
): Promise<ScreenshotResult> {
  const cf = config.getConfig('xiuxian', 'xiuxian')
  const adminset = {
    //CD：分
    CDassociation: cf.CD.association,
    CDjoinassociation: cf.CD.joinassociation,
    CDassociationbattle: cf.CD.associationbattle,
    CDrob: cf.CD.rob,
    CDgambling: cf.CD.gambling,
    CDcouple: cf.CD.couple,
    CDgarden: cf.CD.garden,
    CDlevel_up: cf.CD.level_up,
    CDsecretplace: cf.CD.secretplace,
    CDtimeplace: cf.CD.timeplace,
    CDforbiddenarea: cf.CD.forbiddenarea,
    CDreborn: cf.CD.reborn,
    CDtransfer: cf.CD.transfer,
    CDhonbao: cf.CD.honbao,
    CDboss: cf.CD.boss,
    //手续费
    percentagecost: cf.percentage.cost,
    percentageMoneynumber: cf.percentage.Moneynumber,
    percentagepunishment: cf.percentage.punishment,
    //出千控制
    sizeMoney: cf.size.Money,
    //开关
    switchplay: cf.switch.play,
    switchMoneynumber: cf.switch.play,
    switchcouple: cf.switch.couple,
    switchXiuianplay_key: cf.switch.Xiuianplay_key,
    //倍率
    biguansize: cf.biguan.size,
    biguantime: cf.biguan.time,
    biguancycle: cf.biguan.cycle,
    //
    worksize: cf.work.size,
    worktime: cf.work.time,
    workcycle: cf.work.cycle,

    //出金倍率
    SecretPlaceone: cf.SecretPlace.one,
    SecretPlacetwo: cf.SecretPlace.two,
    SecretPlacethree: cf.SecretPlace.three
  }
  return await screenshot('adminset', e.UserId, adminset)
}

export async function getRankingPowerImage(
  e: EventsMessageCreateEnum,
  Data: Array<Record<string, unknown>>,
  usr_paiming: number,
  thisplayer: Player
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const level = data.Level_list.find(
    item => item.level_id == thisplayer.level_id
  ).level
  const ranking_power_data = {
    user_id: usr_qq,
    mdz: thisplayer.魔道值,
    nickname: thisplayer.名号,
    exp: thisplayer.修为,
    level: level,
    usr_paiming: usr_paiming,
    allplayer: Data
  }
  return await screenshot('ranking_power', e.UserId, ranking_power_data)
}

export async function getRankingMoneyImage(
  e: EventsMessageCreateEnum,
  Data: Array<Record<string, unknown>>,
  usr_paiming: number,
  thisplayer: Player,
  thisnajie: Najie
): Promise<ScreenshotResult> {
  const usr_qq = e.UserId
  const najie_lingshi = Math.trunc(thisnajie.灵石)
  const lingshi = Math.trunc(thisplayer.灵石 + thisnajie.灵石)
  const ranking_money_data = {
    user_id: usr_qq,
    nickname: thisplayer.名号,
    lingshi: lingshi,
    najie_lingshi: najie_lingshi,
    usr_paiming: usr_paiming,
    allplayer: Data
  }
  return await screenshot('ranking_money', e.UserId, ranking_money_data)
}

export async function Goweizhi(
  e: EventsMessageCreateEnum,
  weizhi: NamedItem[]
): Promise<void> {
  const Send: SendFn = useSend(e) as SendFn
  const image = await screenshot('secret_place', e.UserId, {
    didian_list: weizhi
  })
  if (!image) {
    Send(Text('获取秘境图片失败，请稍后再试'))
    return
  }
  Send(Image(image))
}

// （类型辅助已移至文件顶部）
