import { Text, useSend } from 'alemonjs'

import {
  existplayer,
  foundthing,
  readNajie,
  addNajieThing
} from '@src/model/index'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?打磨\S+\*\S+$/

const PINJI_MAP: Record<string, number> = {
  劣: 0,
  普: 1,
  优: 2,
  精: 3,
  极: 4,
  绝: 5,
  顶: 6
}
function parsePinji(raw: string | undefined): number | undefined {
  if (!raw) return undefined
  if (raw in PINJI_MAP) return PINJI_MAP[raw]
  const n = Number(raw)
  return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false

  const raw = e.MessageText.replace(/^(#|＃|\/)?打磨/, '').trim()
  const parts = raw
    .split('*')
    .map(s => s.trim())
    .filter(Boolean)
  if (parts.length < 2) {
    Send(Text('格式：打磨 装备名*品级 例：打磨 斩仙剑*优'))
    return false
  }
  const thingName = parts[0]
  const pinjiInput = parsePinji(parts[1])
  if (pinjiInput === undefined) {
    Send(Text(`未知品级：${parts[1]}`))
    return false
  }
  // 最高品级顶(6)不可再打磨
  if (pinjiInput >= 6) {
    Send(Text(`${thingName}(${parts[1]})已是最高品级，无法继续打磨`))
    return false
  }

  const thingDef = await foundthing(thingName)
  if (!thingDef) {
    Send(Text(`你在瞎说啥呢? 哪来的【${thingName}】?`))
    return false
  }
  // 仅允许有基础数值的装备打磨（任一 >=10 即可）
  const atk = Number(thingDef.atk || 0)
  const def = Number(thingDef.def || 0)
  const hp = Number(thingDef.HP || 0)
  if (atk < 10 && def < 10 && hp < 10) {
    Send(Text(`${thingName}(${parts[1]})不支持打磨`))
    return false
  }

  const najie = await readNajie(usr_qq)
  if (!najie) return false
  const equips = (najie.装备 || []).filter(
    i => i.name === thingName && (i.pinji ?? -1) === pinjiInput
  )
  const count = equips.length
  if (count < 3) {
    Send(
      Text(`需要同品级装备 3 件，你只有 ${thingName}(${parts[1]}) x${count}`)
    )
    return false
  }

  // 扣除 3 件，增加下一品级 1 件
  await addNajieThing(usr_qq, thingName, '装备', -3, pinjiInput)
  await addNajieThing(usr_qq, thingName, '装备', 1, pinjiInput + 1)
  Send(Text(`打磨成功！${thingName} 品级 ${parts[1]} -> ${pinjiInput + 1}`))
  return false
})
