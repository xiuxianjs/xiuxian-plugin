import { Image, Text, useSend } from 'alemonjs'
import { data, redis } from '@src/model/api'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?宗门列表$/
import { __PATH } from '@src/model/index'
import { screenshot } from '@src/image'
import type { AssociationDetailData } from '@src/types'
const 宗门人数上限 = [6, 9, 12, 15, 18, 21, 24, 27]

interface ExtendedAss extends AssociationDetailData {
  宗门等级?: number
  所有成员?: string[]
  宗门驻地?: string | number
  宗门神兽?: string | number
  宗门建设等级?: number
  镇宗神兽?: string
  宗主?: string
  最低加入境界?: number
  外门弟子?: string[]
}
function isExtendedAss(v: unknown): v is ExtendedAss {
  return !!v && typeof v === 'object' && 'power' in v
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  const ifexistplay = await data.existData('player', usr_qq)
  if (!ifexistplay) return
  const keys = await redis.keys(`${__PATH.association}:*`)
  const assList = keys.map(key => key.replace(`${__PATH.association}:`, ''))
  const temp: Array<Record<string, unknown>> = []
  if (assList.length === 0) {
    Send(Text('暂时没有宗门数据'))
    return
  }
  for (const this_name of assList) {
    const assRaw = await data.getAssociation(this_name)
    if (assRaw === 'error' || !isExtendedAss(assRaw)) continue
    const this_ass = assRaw
    const baseLevel = Number(this_ass.宗门等级 ?? 1)
    // 效率
    let this_ass_xiuxian = 0
    const baseEff = baseLevel * 0.05 * 100
    if (!this_ass.宗门驻地 || this_ass.宗门驻地 === 0) {
      this_ass_xiuxian = baseEff
    } else {
      const dongTan = data.bless_list.find(
        item => item.name === this_ass.宗门驻地
      )
      const addEff =
        dongTan && typeof dongTan.efficiency === 'number'
          ? dongTan.efficiency * 100
          : 5
      this_ass_xiuxian = baseEff + addEff
    }
    this_ass_xiuxian = Math.trunc(this_ass_xiuxian)

    const shenshou =
      this_ass.宗门神兽 && this_ass.宗门神兽 !== 0 ? this_ass.宗门神兽 : '暂无'
    const zhudi =
      this_ass.宗门驻地 && this_ass.宗门驻地 !== 0 ? this_ass.宗门驻地 : '暂无'
    const power = this_ass.power === 0 ? '凡界' : '仙界'
    const minLevelId = Number(this_ass.最低加入境界 ?? 0)
    const levelItem = data.Level_list.find(item => item.level_id === minLevelId)
    const levelText = levelItem ? levelItem.level : '未知'
    const memberList = Array.isArray(this_ass.所有成员) ? this_ass.所有成员 : []
    const capIndex = Math.max(
      0,
      Math.min(宗门人数上限.length - 1, baseLevel - 1)
    )
    const arr = {
      宗名: this_ass.宗门名称 || this_name,
      人数: memberList.length,
      宗门人数上限: 宗门人数上限[capIndex],
      位置: power,
      等级: baseLevel,
      天赋加成: this_ass_xiuxian,
      宗门建设等级: this_ass.宗门建设等级 ?? 0,
      镇宗神兽: shenshou,
      宗门驻地: zhudi,
      最低加入境界: levelText,
      宗主: this_ass.宗主 || '未知'
    }
    temp.push(arr)
  }
  if (temp.length === 0) {
    Send(Text('暂无有效宗门数据'))
    return
  }
  const zongmeng_data = { temp }
  try {
    const img = await screenshot('zongmeng', e.UserId, zongmeng_data)
    if (Buffer.isBuffer(img)) {
      Send(Image(img))
    }
  } catch (_err) {
    Send(Text('生成宗门列表图片失败'))
  }
})
