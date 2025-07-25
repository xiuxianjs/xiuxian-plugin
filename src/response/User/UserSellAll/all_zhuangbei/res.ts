import { Image, useSend } from 'alemonjs'

import { data } from '@src/api/api'
import {
  existplayer,
  readPlayer,
  foundthing,
  instead_equipment
} from '@src/model'

import { selects } from '@src/response/index'
import { getQquipmentImage } from '@src/model/image'
export const regular = /^(#|＃|\/)?一键装备$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return false
  //检索方法
  let najie = await await data.getData('najie', usr_qq)
  let player = await readPlayer(usr_qq)
  let sanwei = []
  sanwei[0] =
    data.Level_list.find(item => item.level_id == player.level_id).基础攻击 +
    player.攻击加成 +
    data.LevelMax_list.find(item => item.level_id == player.Physique_id)
      .基础攻击
  sanwei[1] =
    data.Level_list.find(item => item.level_id == player.level_id).基础防御 +
    player.防御加成 +
    data.LevelMax_list.find(item => item.level_id == player.Physique_id)
      .基础防御
  sanwei[2] =
    data.Level_list.find(item => item.level_id == player.level_id).基础血量 +
    player.生命加成 +
    data.LevelMax_list.find(item => item.level_id == player.Physique_id)
      .基础血量
  let equipment = await await data.getData('equipment', usr_qq)
  //智能选择装备
  let type = ['武器', '护具', '法宝']
  for (let j of type) {
    let max
    let max_equ
    if (equipment[j].atk < 10 && equipment[j].def < 10 && equipment[j].HP < 10)
      max =
        equipment[j].atk * sanwei[0] * 0.43 +
        equipment[j].def * sanwei[1] * 0.16 +
        equipment[j].HP * sanwei[2] * 0.41
    else
      max =
        equipment[j].atk * 0.43 +
        equipment[j].def * 0.16 +
        equipment[j].HP * 0.41
    for (let i of najie['装备']) {
      //先判断装备存不存在
      let thing_exist = await foundthing(i.name)
      if (!thing_exist) {
        continue
      }
      if (i.type == j) {
        let temp
        //再判断装备数值类型
        if (i.atk < 10 && i.def < 10 && i.HP < 10)
          temp =
            i.atk * sanwei[0] * 0.43 +
            i.def * sanwei[1] * 0.16 +
            i.HP * sanwei[2] * 0.41
        else temp = i.atk * 0.43 + i.def * 0.16 + i.HP * 0.41
        //选出最佳装备
        if (max < temp) {
          max = temp
          max_equ = i
        }
      }
    }
    if (max_equ) await instead_equipment(usr_qq, max_equ)
  }
  let img = await getQquipmentImage(e)
  if (img) Send(Image(img))
})
