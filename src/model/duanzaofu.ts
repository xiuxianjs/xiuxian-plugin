import { __PATH } from './paths.js'
import data from './XiuxianData.js'
import { writePlayer } from './pub.js'
import type { Player, Tripod, TalentInfo } from '../types/player.js'
import DataList from './DataList.js'
import { getIoRedis } from '@alemonjs/db'

export async function settripod(qq: string): Promise<string> {
  let tripod1: Tripod[] = []
  try {
    tripod1 = await readTripod()
  } catch {
    await writeDuanlu([])
  }
  const A = await looktripod(qq)
  if (A != 1) {
    const newtripod: Tripod = {
      qq: qq,
      煅炉: 0,
      容纳量: 10,
      材料: [],
      数量: [],
      TIME: 0,
      时长: 30000,
      状态: 0,
      预计时长: 0
    }
    tripod1.push(newtripod)
    await writeDuanlu(tripod1)
  }
  //增加锻造天赋
  const playerData = await data.getData('player', qq)
  if (!playerData || Array.isArray(playerData)) {
    return '玩家数据获取失败'
  }
  const player = playerData as Player
  const tianfu = Math.floor(40 * Math.random() + 80)
  player.锻造天赋 = tianfu
  //增加隐藏灵根
  const a = await readAll('隐藏灵根')
  const newa = Math.floor(Math.random() * a.length)
  player.隐藏灵根 = a[newa] as TalentInfo
  await writePlayer(qq, player)
  const B = `获得煅炉，天赋[${player.锻造天赋}],隐藏灵根为[${player.隐藏灵根?.name || '未知'}]`
  return B
}

export async function looktripod(qq: string): Promise<number> {
  let tripod: Tripod[] = []
  try {
    tripod = await readTripod()
  } catch {
    await writeDuanlu([])
  }
  for (const item of tripod) {
    if (qq == item.qq) {
      return 1
    }
  }
  return 0
}

export async function readMytripod(qq: string): Promise<Tripod | undefined> {
  let tripod: Tripod[] = []
  try {
    tripod = await readTripod()
  } catch {
    await writeDuanlu([])
  }

  for (const item of tripod) {
    if (qq == item.qq) {
      return item
    }
  }
}
export async function readTripod(): Promise<Tripod[]> {
  const redis = getIoRedis()
  const data = await redis.get(`${__PATH.duanlu}:duanlu`)
  if (!data) {
    return []
  }
  return JSON.parse(data) as Tripod[]
}

export async function writeDuanlu(duanlu: Tripod[]): Promise<void> {
  const redis = getIoRedis()
  redis.set(`${__PATH.duanlu}:duanlu`, JSON.stringify(duanlu, null, '\t'))
  return
}
//数量矫正, 违规数量改成1
export async function jiaozheng(value: any): Promise<number> {
  let size = value
  if (isNaN(parseFloat(size)) && !isFinite(size)) {
    return Number(1)
  }
  size = Number(Math.trunc(size))
  if (size == null || size == undefined || size < 1 || isNaN(size)) {
    return Number(1)
  }
  return Number(size)
}

//读取item 中某个json文件中的属性
export async function readThat(
  thing_name: string,
  weizhi: string
): Promise<any> {
  const lib_map = {
    npc列表: 'npc_list',
    shop列表: 'shop_list',
    丹药列表: 'danyao_list',
    仙境列表: 'Fairyrealm_list',
    仙宠列表: 'xianchon',
    仙宠口粮列表: 'xianchonkouliang',
    兑换列表: 'duihuan',
    八品: 'bapin',
    功法列表: 'gongfa_list',
    商品列表: 'commodities_list',
    地点列表: 'didian_list',
    天地堂: 'tianditang',
    宗门秘境: 'guildSecrets_list',
    常驻仙宠: 'changzhuxianchon',
    强化列表: 'qianghua',
    怪物列表: 'monster_list',
    技能列表: 'jineng',
    技能列表1: 'jineng1',
    技能列表2: 'jineng2',
    星阁拍卖行列表: 'xingge',
    洞天福地: 'bless_list',
    灵根列表: 'talent_list',
    炼丹师丹药: 'newdanyao_list',
    神界列表: 'shenjie',
    禁地列表: 'forbiddenarea_list',
    积分商城: 'shitujifen',
    草药列表: 'caoyao_list',
    装备列表: 'equipment_list',
    道具列表: 'daoju_list',
    锻造宝物: 'duanzhaobaowu',
    锻造护具: 'duanzhaohuju',
    锻造杂类: 'zalei',
    锻造材料: 'duanzhaocailiao',
    锻造武器: 'duanzhaowuqi',
    隐藏灵根: 'yincang',
    魔界列表: 'mojie'
  }
  const weizh = DataList[lib_map[weizhi]] || []
  for (const item of weizh) {
    if (item.name == thing_name) {
      return item
    }
  }
  return
}

//读取item某个文件的全部物品
export async function readAll(weizhi: string): Promise<any[]> {
  const lib_map = {
    npc列表: 'npc_list',
    shop列表: 'shop_list',
    丹药列表: 'danyao_list',
    仙境列表: 'Fairyrealm_list',
    仙宠列表: 'xianchon',
    仙宠口粮列表: 'xianchonkouliang',
    兑换列表: 'duihuan',
    八品: 'bapin',
    功法列表: 'gongfa_list',
    商品列表: 'commodities_list',
    地点列表: 'didian_list',
    天地堂: 'tianditang',
    宗门秘境: 'guildSecrets_list',
    常驻仙宠: 'changzhuxianchon',
    强化列表: 'qianghua',
    怪物列表: 'monster_list',
    技能列表: 'jineng',
    技能列表1: 'jineng1',
    技能列表2: 'jineng2',
    星阁拍卖行列表: 'xingge',
    洞天福地: 'bless_list',
    灵根列表: 'talent_list',
    炼丹师丹药: 'newdanyao_list',
    神界列表: 'shenjie',
    禁地列表: 'forbiddenarea_list',
    积分商城: 'shitujifen',
    草药列表: 'caoyao_list',
    装备列表: 'equipment_list',
    道具列表: 'daoju_list',
    锻造宝物: 'duanzhaobaowu',
    锻造护具: 'duanzhaohuju',
    锻造杂类: 'zalei',
    锻造材料: 'duanzhaocailiao',
    锻造武器: 'duanzhaowuqi',
    隐藏灵根: 'yincang',
    魔界列表: 'mojie'
  }
  const weizhi1 = await DataList[lib_map[weizhi]]
  if (!weizhi1) {
    return []
  }
  return weizhi1
}

//对值相同的五行进行挑选
export async function getxuanze(
  shuju: string[],
  linggentype: number
): Promise<[string, number] | false> {
  let i
  const shuzu = [1, 2, 3, 4, 5]
  const wuxing = ['金', '木', '土', '水', '火', '金', '木', '土', '水', '火']
  const b = ['金', '木', '土', '水', '火']
  let a: string
  const c: string[] = []
  for (const item in shuzu) {
    if (shuzu[item] == linggentype) {
      for (i = Number(item); i < Number(item) + 5; i++) {
        for (const item1 of shuju) {
          if (item1 == wuxing[i]) {
            a = item1
            c.push(a)
          }
        }
      }
    }
  }
  for (const item2 in b) {
    if (b[item2] == a!) {
      return [c[0], shuzu[item2]]
    }
  }
  return false
}

export async function mainyuansu(shuju: number[]): Promise<string | undefined> {
  const B = ['金', '木', '土', '水', '火']
  for (const item in shuju) {
    if (shuju[item] != 0) {
      return B[item]
    }
  }
}
//判断相生相克只有两个值不为0
export async function restraint(
  shuju: number[],
  main: string
): Promise<[string, number]> {
  const newshuzu: string[] = []
  const shuju2: number[] = []
  const shuzu = ['金', '木', '土', '水', '火', '金', '木', '土', '水', '火']
  for (const item in shuju) {
    if (shuju[item] != 0) {
      newshuzu.push(shuzu[item])
      shuju2.push(shuju[item])
    }
  }
  let houzui = ''
  let jiaceng: number
  //[ '木', '水']
  for (const item in shuzu) {
    if (
      (shuzu[item] == newshuzu[0] && shuzu[Number(item) + 1] == newshuzu[1]) ||
      (shuzu[item] == newshuzu[1] && shuzu[Number(item) + 1] == newshuzu[0])
    ) {
      houzui = `毁${main}灭灵`
      jiaceng = 0.5
      return [houzui, jiaceng]
    }

    if (
      (shuzu[item] == newshuzu[0] && shuzu[Number(item) + 2] == newshuzu[1]) ||
      (shuzu[item] == newshuzu[1] && shuzu[Number(item) + 2] == newshuzu[0])
    ) {
      if (main == newshuzu[0]) {
        houzui = `神${main}相生`
        jiaceng = 0.3
        return [houzui, jiaceng]
      } else if (main == newshuzu[1]) {
        houzui = `供${main}相生`
        jiaceng = 0.2
        return [houzui, jiaceng]
      }
    }
  }
  houzui = `地${main}双生`
  jiaceng = 0.08
  return [houzui, jiaceng]
}

export async function readIt(): Promise<any> {
  const redis = getIoRedis()
  const custom = await redis.get(`${__PATH.custom}:custom`)
  if (!custom) {
    //如果没有自定义数据，返回空对象
    return []
  }
  const customData = JSON.parse(custom)
  return customData
}

export async function alluser(): Promise<string[]> {
  const redis = getIoRedis()
  const keys = await redis.keys(`${__PATH.player_path}:*`)
  const B = keys.map(key => key.replace(`${__PATH.player_path}:`, ''))
  if (B.length == 0) {
    return []
  }
  return B
}
