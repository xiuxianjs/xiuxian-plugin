import { Text, useSend } from 'alemonjs'
import fs from 'node:fs'
import { data } from '@src/api/api'
import { isNotNull, Read_player } from '@src/model'

import { selects } from '@src/response/index'
export const regular = /^(#|\/)入驻洞天.*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  //用户不存在
  let ifexistplay = data.existData('player', usr_qq)
  if (!ifexistplay) return false
  let player = data.getData('player', usr_qq)
  //无宗门
  if (!isNotNull(player.宗门)) {
    Send(Text('你尚未加入宗门'))
    return false
  }
  //职位不符
  if (player.宗门.职位 == '宗主') {
    logger.info('通过')
  } else {
    Send(Text('只有宗主可以操作'))
    return false
  }

  let ass = data.getAssociation(player.宗门.宗门名称)

  //输入的洞天是否存在
  let blessed_name = e.MessageText.replace('#入驻洞天', '')
  blessed_name = blessed_name.trim()
  //洞天不存在
  let dongTan = await data.bless_list.find(item => item.name == blessed_name)
  if (!dongTan) return false

  if (ass.宗门驻地 == blessed_name) {
    Send(Text(`咋的，要给自己宗门拆了重建啊`))
    return false
  }

  //洞天是否已绑定宗门

  let dir = data.filePathMap.association
  let File = fs.readdirSync(dir)
  File = File.filter(file => file.endsWith('.json')) //这个数组内容是所有的宗门名称

  //遍历所有的宗门
  for (let i = 0; i < File.length; i++) {
    let this_name = File[i].replace('.json', '')
    let this_ass = await data.getAssociation(this_name)

    if (this_ass.宗门驻地 == dongTan.name) {
      //找到了驻地为当前洞天的宗门，说明该洞天被人占据
      //开始战力计算，抢夺洞天

      let attackPower = 0
      let defendPower = 0

      for (let i in ass.所有成员) {
        //遍历所有成员
        let member_qq = ass.所有成员[i]
        //(攻击+防御+生命*0.5)*暴击率=理论战力
        let member_data = await Read_player(member_qq)
        let power = member_data.攻击 + member_data.血量上限 * 0.5

        power = Math.trunc(power)
        attackPower += power
      }

      for (let i in this_ass.所有成员) {
        //遍历所有成员
        let member_qq = this_ass.所有成员[i]
        //(攻击+防御+生命*0.5)*暴击率=理论战力
        let member_data = await Read_player(member_qq)
        let power = member_data.防御 + member_data.血量上限 * 0.5

        power = Math.trunc(power)
        defendPower += power
      }

      let randomA = Math.random()
      let randomB = Math.random()
      if (randomA > 0.75) {
        //进攻方状态大好，战力上升10%
        attackPower = Math.trunc(attackPower * 1.1)
      }
      if (randomA < 0.25) {
        attackPower = Math.trunc(attackPower * 0.9)
      }

      if (randomB > 0.75) {
        defendPower = Math.trunc(defendPower * 1.1)
      }
      if (randomB < 0.25) {
        defendPower = Math.trunc(defendPower * 0.9)
      }
      //防守方大阵血量加入计算
      attackPower += ass.宗门建设等级 * 100 + ass.大阵血量 / 2
      defendPower += this_ass.宗门建设等级 * 100 + this_ass.大阵血量

      if (attackPower > defendPower) {
        //抢夺成功了，更改双方驻地信息
        this_ass.宗门驻地 = ass.宗门驻地
        ass.宗门驻地 = dongTan.name
        ass.宗门建设等级 = this_ass.宗门建设等级
        if (this_ass.宗门建设等级 - 10 < 0) {
          this_ass.宗门建设等级 = 0
        } else {
          this_ass.宗门建设等级 = this_ass.宗门建设等级 - 10
        }
        this_ass.大阵血量 = 0
        data.setAssociation(ass.宗门名称, ass)
        data.setAssociation(this_ass.宗门名称, this_ass)
        Send(
          Text(
            `当前洞天已有宗门占据，${ass.宗门名称}造成了${attackPower}伤害！,一举攻破了${this_ass.宗门名称} ${defendPower}的防御，将对方赶了出去,占据了${dongTan.name}`
          )
        )
      } else if (attackPower < defendPower) {
        data.setAssociation(this_ass.宗门名称, this_ass)
        Send(
          Text(
            `${ass.宗门名称}进攻了${this_ass.宗门名称}，对${this_ass.宗门名称}的防御造成了${attackPower}，可一瞬间${this_ass.宗门名称}的防御就回复到了${defendPower}`
          )
        )
      } else {
        data.setAssociation(this_ass.宗门名称, this_ass)
        Send(
          Text(
            `${ass.宗门名称}进攻了${this_ass.宗门名称}，对${this_ass.宗门名称}的防御造成了${attackPower}，可一瞬间${this_ass.宗门名称}的防御就回复到了${defendPower}`
          )
        )
      }

      return false
    }
  }

  //到这还没返回，说明是无主洞天，直接入驻
  //宗门中写洞天信息

  ass.宗门驻地 = dongTan.name
  ass.宗门建设等级 = 0
  await data.setAssociation(ass.宗门名称, ass)
  Send(Text(`入驻成功,${ass.宗门名称}当前驻地为：${dongTan.name}`))
})
