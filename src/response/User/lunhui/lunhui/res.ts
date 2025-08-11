import { Text, useSend } from 'alemonjs'
import { data, redis } from '@src/model/api'
import {
  existplayer,
  notUndAndNull,
  writePlayer,
  readEquipment,
  playerEfficiency,
  getRandomFromARR,
  addNajieThing,
  writeEquipment,
  addHP
} from '@src/model/index'
import type { TalentInfo, Player } from '@src/types/player'
import type { AssociationData } from '@src/types/domain'

import { selects } from '@src/response/index'
export const regular = /^(#|＃|\/)?轮回$/

// === 配置：各转轮回灵根与提示 ===
interface RebirthConfigMeta {
  eff: number
  ratio: number
  name: string
  gongfa: string
  msg: string
}
const REBIRTH_MAP: Record<number, RebirthConfigMeta> = {
  1: {
    name: '一转轮回体',
    eff: 0.3,
    ratio: 0.2,
    gongfa: '一转轮回',
    msg: '一转轮回！'
  },
  2: {
    name: '二转轮回体',
    eff: 0.35,
    ratio: 0.23,
    gongfa: '二转轮回',
    msg: '二转轮回！'
  },
  3: {
    name: '三转轮回体',
    eff: 0.4,
    ratio: 0.26,
    gongfa: '三转轮回',
    msg: '三转轮回！'
  },
  4: {
    name: '四转轮回体',
    eff: 0.45,
    ratio: 0.3,
    gongfa: '四转轮回',
    msg: '四转轮回！'
  },
  5: {
    name: '五转轮回体',
    eff: 0.5,
    ratio: 0.33,
    gongfa: '五转轮回',
    msg: '五转轮回！'
  },
  6: {
    name: '六转轮回体',
    eff: 0.55,
    ratio: 0.36,
    gongfa: '六转轮回',
    msg: '六转轮回！'
  },
  7: {
    name: '七转轮回体',
    eff: 0.6,
    ratio: 0.39,
    gongfa: '七转轮回',
    msg: '七转轮回！'
  },
  8: {
    name: '八转轮回体',
    eff: 0.65,
    ratio: 0.42,
    gongfa: '八转轮回',
    msg: '八转轮回！'
  },
  9: {
    name: '九转轮回体',
    eff: 1,
    ratio: 1,
    gongfa: '九转轮回',
    msg: '九转轮回！已能成帝！'
  }
}

const KEY_LH = (id: string) => `xiuxian@1.3.0:${id}:lunhui`

function buildTalent(cfg: RebirthConfigMeta): TalentInfo {
  return { name: cfg.name, type: '转生', eff: cfg.eff, 法球倍率: cfg.ratio }
}

async function applyRebirthCommon(usr_qq: string, player: PlayerEx) {
  // 通用结算（补血、等级场所）
  player.level_id = 9
  player.power_place = 1
  await writePlayer(usr_qq, player as Player)
  const eq = await readEquipment(usr_qq)
  if (eq) await writeEquipment(usr_qq, eq)
  await addHP(usr_qq, 99_999_999)
  // 根据是否有轮回阵旗效果减少惩罚
  const lunhuiBH = numVal(player.lunhuiBH, 0)
  if (lunhuiBH === 0) {
    player.Physique_id = Math.ceil(player.Physique_id / 2)
    player.修为 = 0
    player.血气 = 0
  } else if (lunhuiBH === 1) {
    player.修为 = Math.max(0, numVal(player.修为) - 10_000_000)
    player.血气 = Math.max(0, numVal(player.血气) - 10_000_000)
    setNum(player, 'lunhuiBH', 0)
  }
  await writePlayer(usr_qq, player as Player)
}

function isAssociation(
  obj: unknown
): obj is AssociationData & { 所有成员?: string[] } {
  return !!obj && typeof obj === 'object' && '宗门名称' in obj
}

async function exitAssociationIfNeed(
  usr_qq: string,
  player: PlayerEx,
  Send: (t: unknown) => unknown
) {
  if (!notUndAndNull(player.宗门)) return
  const guild = player.宗门 as AssociationData
  if (!guild || typeof guild !== 'object' || !('宗门名称' in guild)) return
  const assRaw = await data.getAssociation(guild.宗门名称)
  if (!isAssociation(assRaw) || !assRaw.power) return
  // assRaw 已通过类型守卫，可安全使用
  Send(Text('轮回后降临凡界，仙宗命牌失效！'))
  // 非宗主：直接移除
  if (guild.职位 !== '宗主') {
    const ass2Raw = await data.getAssociation(guild.宗门名称)
    if (isAssociation(ass2Raw)) {
      const ass2 = ass2Raw as Record<string, unknown>
      if (Array.isArray(ass2[guild.职位]))
        (ass2[guild.职位] as string[]) = (ass2[guild.职位] as string[]).filter(
          q => q !== usr_qq
        )
      if (Array.isArray(ass2['所有成员']))
        (ass2['所有成员'] as string[]) = (ass2['所有成员'] as string[]).filter(
          q => q !== usr_qq
        )
      data.setAssociation(
        (ass2Raw as AssociationData).宗门名称,
        ass2Raw as AssociationData
      )
    }
    delete player.宗门
    await writePlayer(usr_qq, player as Player)
    await playerEfficiency(usr_qq)
    Send(Text('退出宗门成功'))
    return
  }
  // 宗主：处理解散或继任
  const ass3Raw = await data.getAssociation(guild.宗门名称)
  if (!isAssociation(ass3Raw)) return
  const ass3 = ass3Raw as AssociationData & { [k: string]: unknown }
  if (!Array.isArray(ass3.所有成员)) ass3.所有成员 = []
  if ((ass3.所有成员 as string[]).length < 2) {
    await redis.del(`${data.association}:${guild.宗门名称}`)
    delete player.宗门
    await writePlayer(usr_qq, player as Player)
    await playerEfficiency(usr_qq)
    Send(Text('一声巨响,原本的宗门轰然倒塌,随着流沙沉没,仙界中再无半分痕迹'))
    return
  }
  const seq = ['副宗主', '长老', '内门弟子', '所有成员'] as const
  let succList: string[] = []
  for (const k of seq) {
    const arr = ass3[k] as unknown
    if (Array.isArray(arr) && arr.length) {
      succList = arr as string[]
      break
    }
  }
  const randmember_qq = await getRandomFromARR(succList)
  if (randmember_qq) {
    const randmember = (await data.getData('player', randmember_qq)) as PlayerEx
    if (
      randmember &&
      randmember.宗门 &&
      (randmember.宗门 as AssociationData).职位
    ) {
      const pos = (randmember.宗门 as AssociationData).职位 as string
      const arr = ass3[pos] as unknown
      if (Array.isArray(arr))
        ass3[pos] = (arr as string[]).filter(q => q !== randmember_qq)
      ;(ass3 as Record<string, unknown>)['宗主'] = randmember_qq
      ;(randmember.宗门 as AssociationData).职位 = '宗主'
      await writePlayer(randmember_qq, randmember as Player)
    }
  }
  ass3['所有成员'] = (ass3['所有成员'] as string[]).filter(q => q !== usr_qq)
  delete player.宗门
  await writePlayer(usr_qq, player as Player)
  data.setAssociation(ass3.宗门名称, ass3 as AssociationData)
  await playerEfficiency(usr_qq)
  Send(
    Text(`轮回前,遵循你的嘱托,${randmember_qq}将继承你的衣钵,成为新一任的宗主`)
  )
}

const FAIL_PROB = 1 / 9

// 辅助扩展类型与工具函数（放置在文件顶部下方，集中管理）
type PlayerEx = Player & { [k: string]: unknown }
const numVal = (v: unknown, d = 0) =>
  typeof v === 'number' && !isNaN(v)
    ? v
    : typeof v === 'string' && !isNaN(+v)
      ? +v
      : d
const setNum = (p: PlayerEx, k: string, v: number) => {
  ;(p as Record<string, unknown>)[k] = v
}

// 主逻辑
export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) return false
  const player = (await data.getData('player', usr_qq)) as PlayerEx
  if (!notUndAndNull(player.lunhui)) {
    setNum(player, 'lunhui', 0)
    await writePlayer(usr_qq, player as Player)
  }
  if (!notUndAndNull(player.轮回点)) setNum(player, '轮回点', 0)

  const key = KEY_LH(usr_qq)
  const lhxqRaw = await redis.get(key)
  const lhFlag = Number(lhxqRaw) || 0
  if (lhFlag !== 1) {
    Send(
      Text(
        '轮回之术乃逆天造化之术，须清空仙人所有的修为气血才可施展。\n' +
          '传说只有得到"轮回阵旗"进行辅助轮回，才会抵御轮回之苦的十之八九。\n' +
          '再次输入 #轮回 继续，或忽略退出。'
      )
    )
    await redis.set(key, 1)
    return
  } else {
    await redis.set(key, 0) // 重置确认状态
  }

  // 基本前置校验
  if (numVal(player.lunhui) >= 9) {
    Send(Text('你已经轮回完结！'))
    return false
  }
  if (player.level_id < 42) {
    Send(Text('法境未到仙无法轮回！'))
    return false
  }
  const equipment = await readEquipment(usr_qq)
  if (equipment && equipment.武器 && equipment.武器.HP < 0) {
    Send(
      Text(
        `身上携带邪祟之物，无法进行轮回,请将[${equipment.武器.name}]放下后再进行轮回`
      )
    )
    return false
  }
  const points = numVal(player.轮回点)
  if (points <= 0) {
    Send(
      Text(
        '此生轮回点已消耗殆尽，未能躲过天机！\n被天庭发现，但因为没有轮回点未被关入天牢，\n仅被警告一次，轮回失败！'
      )
    )
    player.当前血量 = 10
    await writePlayer(usr_qq, player as Player)
    return false
  }
  setNum(player, '轮回点', points - 1)

  // 随机失败判定 (1/9)
  if (Math.random() <= FAIL_PROB) {
    Send(
      Text(
        '本次轮回的最后关头，终究还是未能躲过天机！\n被天庭搜捕归案，关入天牢受尽折磨，轮回失败！'
      )
    )
    player.当前血量 = 1
    player.修为 = Math.max(0, numVal(player.修为) - 10_000_000)
    player.血气 = numVal(player.血气) + 5_141_919 // 原逻辑：血气 += 5141919
    player.灵石 = Math.max(0, numVal(player.灵石) - 10_000_000)
    await writePlayer(usr_qq, player as Player)
    return false
  }

  // 轮回成功：阶段提升
  setNum(player, 'lunhui', numVal(player.lunhui) + 1)
  await exitAssociationIfNeed(usr_qq, player, Send)

  const stage = numVal(player.lunhui)
  const cfg = REBIRTH_MAP[stage]
  if (cfg) {
    player.灵根 = buildTalent(cfg)
    await addNajieThing(usr_qq, cfg.gongfa, '功法', 1)
    await applyRebirthCommon(usr_qq, player)
    await writePlayer(usr_qq, player as Player)
    Send(Text(`你已打破规则，轮回成功，现在你为${cfg.msg}`))
    return false
  }
  Send(Text('轮回阶段配置缺失，等待更新'))
  return false
})
