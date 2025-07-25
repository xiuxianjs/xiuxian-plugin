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
import updateRecord from '../resources/data/updateRecord.json'
import { __PATH } from './paths.js'

export class DataList {
  player: string = __PATH.player_path
  equipment: string = __PATH.equipment_path
  najie: string = __PATH.najie_path
  lib: string = __PATH.lib_path
  association: string = __PATH.association
  occupation: string = __PATH.occupation
  lib_path: string = __PATH.lib_path
  Timelimit: string = __PATH.Timelimit
  Level: string = __PATH.Level
  Occupation: string = __PATH.occupation
  talent_list = 灵根列表
  monster_list = 怪物列表
  commodities_list = 商品列表
  Level_list = 练气境界
  shitujifen = 积分商城
  LevelMax_list = 炼体境界
  equipment_list = 装备列表
  danyao_list = 丹药列表
  newdanyao_list = 炼丹师丹药
  daoju_list = 道具列表
  gongfa_list = 功法列表
  caoyao_list = 草药列表
  didian_list = 地点列表
  bless_list = 洞天福地
  guildSecrets_list = 宗门秘境
  forbiddenarea_list = 禁地列表
  Fairyrealm_list = 仙境列表
  timeplace_list = 限定仙府
  timegongfa_list = 限定功法
  timeequipmen_list = 限定装备
  timedanyao_list = 限定丹药
  occupation_list = 职业列表
  occupation_exp_list = experience
  danfang_list = 炼丹配方
  tuzhi_list = 装备图纸
  bapin = 八品
  xingge = 星阁拍卖行列表
  tianditang = 天地堂
  changzhuxianchon = 常驻仙宠
  xianchon = 仙宠列表
  xianchonkouliang = 仙宠口粮列表
  npc_list = npc列表
  shop_list = shop列表
  qinlong = 青龙
  qilin = 麒麟
  xuanwu = 玄武朱雀白虎
  mojie = 魔界列表
  duihuan = 兑换列表
  shenjie = 神界列表
  jineng1 = 技能列表1
  jineng2 = 技能列表2
  qianghua = 强化列表
  duanzhaocailiao = 锻造材料
  duanzhaowuqi = 锻造武器
  duanzhaohuju = 锻造护具
  duanzhaobaowu = 锻造宝物
  yincang = 隐藏灵根
  zalei = 锻造杂类
  jineng = 技能列表
  updateRecord = updateRecord
}

export default new DataList()
