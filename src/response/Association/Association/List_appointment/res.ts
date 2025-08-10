import { Image, Text, useSend } from 'alemonjs'
import { data, puppeteer, redis } from '@src/model/api'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?宗门列表$/
import { __PATH } from '@src/model/index'
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27]
export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return
  const keys = await redis.keys(`${__PATH.association}:*`)
  const assList = keys.map(key => key.replace(`${__PATH.association}:`, ''))
  const temp = []
  if (assList.length == 0) {
    Send(Text('暂时没有宗门数据'))
    return
  }
  for (let i = 0; i < assList.length; i++) {
    const this_name = assList[i]
    const this_ass = await await data.getAssociation(this_name)
    //处理一下宗门效率问题
    let this_ass_xiuxian = 0
    if (this_ass.宗门驻地 == 0) {
      this_ass_xiuxian = this_ass.宗门等级 * 0.05 * 100
    } else {
      const dongTan = await data.bless_list.find(
        item => item.name == this_ass.宗门驻地
      )
      try {
        this_ass_xiuxian =
          this_ass.宗门等级 * 0.05 * 100 + dongTan.efficiency * 100
      } catch {
        this_ass_xiuxian = this_ass.宗门等级 * 0.05 * 100 + 5
      }
    }
    this_ass_xiuxian = Math.trunc(this_ass_xiuxian)
    let shenshou = this_ass.宗门神兽
    let zhudi = this_ass.宗门驻地
    let power
    if (this_ass.宗门神兽 == 0) {
      shenshou = '暂无'
    }
    if (zhudi == 0) {
      zhudi = '暂无'
    }
    if (this_ass.power == 0) {
      power = '凡界'
    } else {
      power = '仙界'
    }
    const level = data.Level_list.find(
      item => item.level_id == this_ass.最低加入境界
    ).level
    const arr = {
      宗名: this_ass.宗门名称,
      人数: this_ass.所有成员.length,
      宗门人数上限: 宗门人数上限[this_ass.宗门等级 - 1],
      位置: power,
      等级: this_ass.宗门等级,
      天赋加成: this_ass_xiuxian,
      宗门建设等级: this_ass.宗门建设等级,
      镇宗神兽: shenshou,
      宗门驻地: zhudi,
      最低加入境界: level,
      宗主: this_ass.宗主
    }
    temp.push(arr)
  }
  const zongmeng_data = { temp }

  const img = await puppeteer.screenshot('zongmeng', e.UserId, zongmeng_data)
  if (img) Send(Image(img))
})
