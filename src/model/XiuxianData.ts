import fs from 'fs'
import Config from './Config.js'
import path from 'path'
import 灵根列表 from '../resources/data/item/灵根列表.json'
import 怪物列表 from '../resources/data/item/怪物列表.json'
import 商品列表 from '../resources/data/item/商品列表.json'
import 练气境界 from '../resources/data/Level/练气境界.json'
import 积分商城 from '../resources/data/item/积分商城.json'
import 炼体境界 from '../resources/data/Level/炼体境界.json'
import 装备列表 from '../resources/data/item/装备列表.json'
import 丹药列表 from '../resources/data/item/丹药列表.json'
import 炼丹师丹药 from '../resources/data/item/炼丹师丹药.json'
import 道具列表 from '../resources/data/item/道具列表.json'
import 功法列表 from '../resources/data/item/功法列表.json'
import 草药列表 from '../resources/data/item/草药列表.json'
import 地点列表 from '../resources/data/item/地点列表.json'
import 洞天福地 from '../resources/data/item/洞天福地.json'
import 宗门秘境 from '../resources/data/item/宗门秘境.json'
import 禁地列表 from '../resources/data/item/禁地列表.json'
import 仙境列表 from '../resources/data/item/仙境列表.json'
import 限定仙府 from '../resources/data/Timelimit/限定仙府.json'
import 限定功法 from '../resources/data/Timelimit/限定功法.json'
import 限定装备 from '../resources/data/Timelimit/限定装备.json'
import 限定丹药 from '../resources/data/Timelimit/限定丹药.json'
import 职业列表 from '../resources/data/occupation/职业列表.json'
import experience from '../resources/data/occupation/experience.json'
import 炼丹配方 from '../resources/data/occupation/炼丹配方.json'
import 装备图纸 from '../resources/data/occupation/装备图纸.json'
import 八品 from '../resources/data/item/八品.json'
import 星阁拍卖行列表 from '../resources/data/item/星阁拍卖行列表.json'
import 天地堂 from '../resources/data/item/天地堂.json'
import 常驻仙宠 from '../resources/data/item/常驻仙宠.json'
import 仙宠列表 from '../resources/data/item/仙宠列表.json'
import 仙宠口粮列表 from '../resources/data/item/仙宠口粮列表.json'
import npc列表 from '../resources/data/item/npc列表.json'
import shop列表 from '../resources/data/item/shop列表.json'
import 青龙 from '../resources/data/Timelimit/青龙.json'
import 麒麟 from '../resources/data/Timelimit/麒麟.json'
import 玄武朱雀白虎 from '../resources/data/Timelimit/玄武朱雀白虎.json'
import 魔界列表 from '../resources/data/item/魔界列表.json'
import 兑换列表 from '../resources/data/item/兑换列表.json'
import 神界列表 from '../resources/data/item/神界列表.json'
import 技能列表1 from '../resources/data/item/技能列表1.json'
import 技能列表2 from '../resources/data/item/技能列表2.json'
import 强化列表 from '../resources/data/item/强化列表.json'
import 锻造材料 from '../resources/data/item/锻造材料.json'
import 锻造武器 from '../resources/data/item/锻造武器.json'
import 锻造护具 from '../resources/data/item/锻造护具.json'
import 锻造宝物 from '../resources/data/item/锻造宝物.json'
import 隐藏灵根 from '../resources/data/item/隐藏灵根.json'
import 锻造杂类 from '../resources/data/item/锻造杂类.json'
import 技能列表 from '../resources/data/item/技能列表.json'
import updateRecord from '../config/updateRecord.json'
import { __PATH } from './paths'
// 类型定义
type JSONData = Record<string, any> | Array<any>

type FilePathType =
  | 'player'
  | 'equipment'
  | 'najie'
  | 'lib'
  | 'Timelimit'
  | 'Level'
  | 'association'
  | 'occupation'

interface FilePathMap {
  player: string
  equipment: string
  najie: string
  lib: string
  Timelimit: string
  Level: string
  association: string
  occupation: string
}

class XiuxianData {
  configData: any
  filePathMap: FilePathMap
  lib_path: string
  Timelimit: string
  Level: string
  Occupation: string
  talent_list: typeof 灵根列表
  monster_list: typeof 怪物列表
  commodities_list: typeof 商品列表
  Level_list: typeof 练气境界
  shitujifen: typeof 积分商城
  LevelMax_list: typeof 炼体境界
  equipment_list: typeof 装备列表
  danyao_list: typeof 丹药列表
  newdanyao_list: typeof 炼丹师丹药
  daoju_list: typeof 道具列表
  gongfa_list: typeof 功法列表
  caoyao_list: typeof 草药列表
  didian_list: typeof 地点列表
  bless_list: typeof 洞天福地
  guildSecrets_list: typeof 宗门秘境
  forbiddenarea_list: typeof 禁地列表
  Fairyrealm_list: typeof 仙境列表
  timeplace_list: typeof 限定仙府
  timegongfa_list: typeof 限定功法
  timeequipmen_list: typeof 限定装备
  timedanyao_list: typeof 限定丹药
  occupation_list: typeof 职业列表
  occupation_exp_list: typeof experience
  danfang_list: typeof 炼丹配方
  tuzhi_list: typeof 装备图纸
  bapin: typeof 八品
  xingge: typeof 星阁拍卖行列表
  tianditang: typeof 天地堂
  changzhuxianchon: typeof 常驻仙宠
  xianchon: typeof 仙宠列表
  xianchonkouliang: typeof 仙宠口粮列表
  npc_list: typeof npc列表
  shop_list: typeof shop列表
  qinlong: typeof 青龙
  qilin: typeof 麒麟
  xuanwu: typeof 玄武朱雀白虎
  mojie: typeof 魔界列表
  duihuan: typeof 兑换列表
  shenjie: typeof 神界列表
  jineng1: typeof 技能列表1
  jineng2: typeof 技能列表2
  qianghua: typeof 强化列表
  duanzhaocailiao: typeof 锻造材料
  duanzhaowuqi: typeof 锻造武器
  duanzhaohuju: typeof 锻造护具
  duanzhaobaowu: typeof 锻造宝物
  yincang: typeof 隐藏灵根
  zalei: typeof 锻造杂类
  jineng: typeof 技能列表
  updateRecord: typeof updateRecord
  constructor() {
    //获取配置文件参数
    this.configData = Config.getConfig('version', 'version')
    //插件根目录
    this.filePathMap = {
      player: __PATH.player_path,
      equipment: __PATH.equipment_path,
      najie: __PATH.najie_path,
      lib: __PATH.lib_path,
      Timelimit: __PATH.Timelimit, //限定
      Level: __PATH.Level, //境界
      association: __PATH.association,
      occupation: __PATH.occupation
    }
    this.lib_path = __PATH.lib_path
    this.Timelimit = __PATH.Timelimit
    this.Level = __PATH.Level
    this.Occupation = __PATH.occupation

    //加载灵根列表
    this.talent_list = 灵根列表
    //加载怪物列表
    this.monster_list = 怪物列表
    //加载商品列表
    this.commodities_list = 商品列表
    //练气境界
    this.Level_list = 练气境界
    //师徒积分
    this.shitujifen = 积分商城
    //练体境界
    this.LevelMax_list = 炼体境界
    //加载装备列表
    this.equipment_list = 装备列表
    //加载丹药列表
    this.danyao_list = 丹药列表
    //加载炼丹师丹药列表
    this.newdanyao_list = 炼丹师丹药
    //加载道具列表
    this.daoju_list = 道具列表
    //加载功法列表
    this.gongfa_list = 功法列表
    //加载草药列表
    this.caoyao_list = 草药列表

    //加载地点列表
    this.didian_list = 地点列表
    //加载洞天福地列表
    this.bless_list = 洞天福地
    //加载宗门秘境
    this.guildSecrets_list = 宗门秘境
    //加载禁地列表
    this.forbiddenarea_list = 禁地列表
    //加载仙域列表
    this.Fairyrealm_list = 仙境列表
    //加载限定仙府
    this.timeplace_list = 限定仙府
    //加载限定功法
    this.timegongfa_list = 限定功法
    //加载限定装备
    this.timeequipmen_list = 限定装备
    //加载限定丹药
    this.timedanyao_list = 限定丹药
    //加载职业列表
    this.occupation_list = 职业列表
    //加载职业经验列表
    this.occupation_exp_list = experience
    //加载丹方列表
    this.danfang_list = 炼丹配方
    //加载图纸列表
    this.tuzhi_list = 装备图纸

    //加载八品功法列表
    this.bapin = 八品
    //加载星阁列表
    this.xingge = 星阁拍卖行列表
    //天地
    this.tianditang = 天地堂
    //仙宠
    this.changzhuxianchon = 常驻仙宠
    this.xianchon = 仙宠列表
    this.xianchonkouliang = 仙宠口粮列表
    //npc
    this.npc_list = npc列表
    //
    this.shop_list = shop列表

    this.qinlong = 青龙
    this.qilin = 麒麟
    this.xuanwu = 玄武朱雀白虎
    //魔界
    this.mojie = 魔界列表
    //兑换码
    this.duihuan = 兑换列表
    //神界
    this.shenjie = 神界列表
    //加载技能列表
    this.jineng1 = 技能列表1
    this.jineng2 = 技能列表2
    //加载强化列表
    this.qianghua = 强化列表
    //锻造材料列表
    this.duanzhaocailiao = 锻造材料
    //锻造武器列表
    this.duanzhaowuqi = 锻造武器
    //锻造护具列表
    this.duanzhaohuju = 锻造护具
    //锻造宝物列表
    this.duanzhaobaowu = 锻造宝物
    //隐藏灵根列表
    this.yincang = 隐藏灵根
    //锻造杂类列表
    this.zalei = 锻造杂类
    //加载技能列表
    this.jineng = 技能列表
    //加载更新日志
    this.updateRecord = updateRecord
  }

  /**
   * 检测存档存在
   * @param file_path_type ["player" , "association" ]
   * @param file_name
   */
  existData(file_path_type: FilePathType, file_name: string): boolean {
    let file_path: string
    file_path = this.filePathMap[file_path_type]
    let dir = path.join(file_path + '/' + file_name + '.json')
    if (fs.existsSync(dir)) {
      return true
    }
    return false
  }

  /**
   * 获取文件数据(user_qq为空查询item下的file_name文件)
   * @param file_name  [player,equipment,najie]
   * @param user_qq
   */
  getData(
    file_name: FilePathType | string,
    user_qq?: string
  ): JSONData | 'error' {
    let file_path: string
    let dir: string
    let data: string
    if (user_qq) {
      //带user_qq的查询数据文件
      file_path = this.filePathMap[file_name as FilePathType]
      dir = path.join(file_path + '/' + user_qq + '.json')
    } else {
      //不带参数的查询item下文件
      file_path = __PATH.lib_path
      dir = path.join(file_path + '/' + file_name + '.json')
    }
    try {
      data = fs.readFileSync(dir, 'utf8')
    } catch (error) {
      logger.error('读取文件错误：' + error)
      return 'error'
    }
    //将字符串数据转变成json格式
    const parsedData = JSON.parse(data)
    return parsedData
  }

  /**
   * 写入数据
   * @param file_name [player,equipment,najie]
   * @param user_qq
   * @param data
   */
  setData(
    file_name: FilePathType | string,
    user_qq: string | null,
    data: JSONData
  ): void {
    let file_path: string
    let dir: string
    if (user_qq) {
      file_path = this.filePathMap[file_name as FilePathType]
      dir = path.join(file_path + '/' + user_qq + '.json')
    } else {
      file_path = this.filePathMap.lib
      dir = path.join(file_path + '/' + file_name + '.json')
    }
    let new_ARR = JSON.stringify(data) //json转string
    if (fs.existsSync(dir)) {
      fs.writeFileSync(dir, new_ARR, 'utf-8')
    }
    return
  }

  /**
   * 获取宗门数据
   * @param file_name  宗门名称
   */
  getAssociation(file_name: string): JSONData | 'error' {
    let file_path: string
    let dir: string
    let data: string
    file_path = __PATH.association
    dir = path.join(file_path + '/' + file_name + '.json')
    try {
      data = fs.readFileSync(dir, 'utf8')
    } catch (error) {
      logger.error('读取文件错误：' + error)
      return 'error'
    }
    //将字符串数据转变成json格式
    const parsedData = JSON.parse(data)
    return parsedData
  }

  /**
   * 写入宗门数据
   * @param file_name  宗门名称
   * @param data
   */
  setAssociation(file_name: string, data: JSONData): void {
    let file_path: string
    let dir: string
    file_path = __PATH.association
    dir = path.join(file_path + '/' + file_name + '.json')
    let new_ARR = JSON.stringify(data) //json转string
    fs.writeFileSync(dir, new_ARR, 'utf-8')
    return
  }
}
export default new XiuxianData()
