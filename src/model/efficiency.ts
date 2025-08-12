// 玩家效率/收益相关逻辑抽取
import { readPlayer, addConFaByUser, writePlayer } from './xiuxian_impl.js'
export { addConFaByUser }
import type { GongfaItem } from '../types/model'
import DataList from './DataList.js'
import { readDanyao } from './danyao.js'
import { notUndAndNull } from './common.js'
import Association from './Association.js'

export async function playerEfficiency(userId: string): Promise<null> {
  //这里有问题
  const usr_qq = userId
  const player = await readPlayer(usr_qq)
  let ass
  let Assoc_efficiency //宗门效率加成
  let linggen_efficiency = 0 //灵根效率加成
  let gongfa_efficiency = 0 //功法效率加成
  let xianchong_efficiency = 0 // 仙宠效率加成
  if (!notUndAndNull(player.宗门)) {
    //是否存在宗门信息
    Assoc_efficiency = 0 //不存在，宗门效率为0
  } else {
    ass = await Association.getAssociation(player.宗门['宗门名称']) //修仙对应宗门信息
    if (ass.宗门驻地 == 0) {
      Assoc_efficiency = ass.宗门等级 * 0.05
    } else {
      const dongTan = DataList.bless_list.find(
        item => item.name == ass.宗门驻地
      )
      try {
        Assoc_efficiency = ass.宗门等级 * 0.05 + (dongTan.efficiency as number)
      } catch {
        Assoc_efficiency = ass.宗门等级 * 0.05 + 0.5
      }
    }
  }
  linggen_efficiency = player.灵根.eff //灵根修炼速率
  label1: for (const i in player.学习的功法) {
    //存在功法，遍历功法加成
    const gongfa = ['gongfa_list', 'timegongfa_list']
    //这里是查看了功法表
    for (const j of gongfa) {
      const ifexist = (DataList[j] as GongfaItem[]).find(
        item => item.name == player.学习的功法[i]
      )
      if (ifexist) {
        gongfa_efficiency += ifexist.修炼加成 as number
        continue label1
      }
    }
    player.学习的功法.splice(+i, 1)
  }
  if (player.仙宠.type == '修炼') {
    // 是否存在修炼仙宠
    xianchong_efficiency = player.仙宠.加成 // 存在修炼仙宠，仙宠效率为仙宠效率加成
  }
  const dy = await readDanyao(usr_qq)
  const bgdan = dy['biguanxl'] || 0

  player.修炼效率提升 =
    linggen_efficiency +
    Assoc_efficiency +
    gongfa_efficiency +
    xianchong_efficiency +
    bgdan //修炼效率综合

  await writePlayer(usr_qq, player)
  return
}

export default { playerEfficiency }
