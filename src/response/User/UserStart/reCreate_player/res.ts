import { Text, useMessage, useSend, useSubscribe } from 'alemonjs'

import { redis, data } from '@src/model/api'
import {
  __PATH,
  addHP,
  existplayer,
  getRandomFromARR,
  getRandomTalent,
  Go,
  notUndAndNull,
  writeDanyao,
  writeEquipment,
  Write_najie,
  writePlayer,
  getConfig
} from '@src/model/index'
import fs from 'fs'
import { selects } from '@src/response/index'
import { Show_player } from '../user'
import type { Player, AssociationDetailData } from '@src/types'
import { getRedisKey } from '@src/model/key'

export const regular = /^(#|＃|\/)?再入仙途$/

interface PlayerGuildRef {
  宗门名称: string
  职位: string
}
function isPlayerGuildRef(v): v is PlayerGuildRef {
  return !!v && typeof v === 'object' && '宗门名称' in v && '职位' in v
}
interface ExtAss extends AssociationDetailData {
  宗门名称: string
  所有成员?: string[]
  长老?: string[]
  内门弟子?: string[]
  宗主?: string
  [k: string]: any
}
function isExtAss(v): v is ExtAss {
  return !!v && typeof v === 'object' && 'power' in v && '宗门名称' in v
}

function parseNum(v, def = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : def
}
function removeFromRole(ass: ExtAss, role: string, qq: string) {
  const list = ass[role]
  if (Array.isArray(list)) ass[role] = list.filter(v => v !== qq)
}

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  if (!(await existplayer(usr_qq))) {
    return false
  }
  const rebornKey = getRedisKey(usr_qq, 'reCreate_acount')

  let acountRaw = await redis.get(rebornKey)
  if (!acountRaw) {
    await redis.set(rebornKey, '1')
    acountRaw = '1'
  }
  let acount = parseNum(acountRaw, 1)
  if (acount <= 0) {
    acount = 1
    await redis.set(rebornKey, '1')
  }

  const player = (await data.getData('player', usr_qq)) as Player | null
  if (!player) {
    Send(Text('玩家数据异常'))
    return false
  }
  if (parseNum(player.灵石) <= 0) {
    Send(Text('负债无法再入仙途'))
    return false
  }
  if (!(await Go(e))) return false

  const nowTime = Date.now()
  const lastKey = getRedisKey(usr_qq, 'last_reCreate_time')
  const lastRestartRaw = await redis.get(lastKey)
  const lastRestart = parseNum(lastRestartRaw)
  const cf = (await getConfig('xiuxian', 'xiuxian')) as Partial<{
    CD?: { reborn?: number }
  }>
  const rebornMin = cf?.CD?.reborn ?? 60
  const rebornTime = rebornMin * 60000
  if (nowTime < lastRestart + rebornTime) {
    const remain = lastRestart + rebornTime - nowTime
    const m = Math.trunc(remain / 60000)
    const s = Math.trunc((remain % 60000) / 1000)
    Send(Text(`每${rebornTime / 60000}分钟只能转世一次 剩余cd:${m}分 ${s}秒`))
    return false
  }

  await Send(
    Text(
      '一旦转世一切当世与你无缘,你真的要重生吗?回复:【断绝此生】或者【再继仙缘】进行选择'
    )
  )
  const [subscribe] = useSubscribe(e, selects)
  const sub = subscribe.mount(
    async (event, next) => {
      const [message] = useMessage(event)
      const choice = event.MessageText.trim()
      if (choice === '再继仙缘') {
        message.send([Text('重拾道心,继续修行')])
        clearTimeout(timeout)
        return
      }
      if (choice !== '断绝此生') {
        message.send([Text('请回复:【断绝此生】或者【再继仙缘】进行选择')])
        next()
        return
      }
      clearTimeout(timeout)
      const acountValRaw = await redis.get(rebornKey)
      let acountVal = parseNum(acountValRaw, 1)
      if (acountVal >= 15) {
        message.send([Text('灵魂虚弱，已不可转世！')])
        return
      }
      acountVal += 1

      const playerNow = (await data.getData('player', usr_qq)) as Player | null
      if (
        playerNow &&
        notUndAndNull(playerNow.宗门) &&
        isPlayerGuildRef(playerNow.宗门)
      ) {
        const assRaw = await data.getAssociation(playerNow.宗门.宗门名称)
        if (assRaw !== 'error' && isExtAss(assRaw)) {
          const ass = assRaw
          if (playerNow.宗门.职位 !== '宗主') {
            removeFromRole(ass, playerNow.宗门.职位, usr_qq)
            ass.所有成员 = (ass.所有成员 || []).filter(q => q !== usr_qq)
            if ('宗门' in playerNow)
              delete (playerNow as { 宗门?: PlayerGuildRef }).宗门
            await data.setAssociation(ass.宗门名称, ass)
            await writePlayer(usr_qq, playerNow)
          } else {
            if ((ass.所有成员 || []).length < 2) {
              try {
                fs.rmSync(`${data.association}/${ass.宗门名称}.json`)
              } catch {
                /* ignore */
              }
            } else {
              ass.所有成员 = (ass.所有成员 || []).filter(q => q !== usr_qq)
              let randmember_qq: string | undefined
              if ((ass.长老 || []).length > 0)
                randmember_qq = await getRandomFromARR(ass.长老)
              else if ((ass.内门弟子 || []).length > 0)
                randmember_qq = await getRandomFromARR(ass.内门弟子)
              else randmember_qq = await getRandomFromARR(ass.所有成员 || [])
              if (randmember_qq) {
                const randmember = (await data.getData(
                  'player',
                  randmember_qq
                )) as Player | null
                if (
                  randmember &&
                  randmember.宗门 &&
                  isPlayerGuildRef(randmember.宗门)
                ) {
                  removeFromRole(ass, randmember.宗门.职位, randmember_qq)
                  ass.宗主 = randmember_qq
                  randmember.宗门.职位 = '宗主'
                  await writePlayer(randmember_qq, randmember)
                  await data.setAssociation(ass.宗门名称, ass)
                }
              }
            }
          }
        }
      }

      await redis.del(getRedisKey(usr_qq, 'last_dajie_time'))
      await redis.set(lastKey, String(Date.now()))
      await redis.set(rebornKey, String(acountVal))

      message.send([Text('当前存档已清空!开始重生')])
      message.send([Text('来世，信则有，不信则无，岁月悠悠……')])
      await Create_player(e)
    },
    ['UserId']
  )

  const timeout = setTimeout(() => {
    try {
      subscribe.cancel(sub)
      Send(Text('超时自动取消操作'))
    } catch {
      /* ignore */
    }
  }, 60 * 1000)

  return false
})

interface Talent {
  eff: number
  [k: string]: any
}

async function Create_player(e) {
  const base = e as { UserId: string; UserAvatar?: string }
  const usr_qq = base.UserId
  if (await existplayer(usr_qq)) {
    Show_player(e as Parameters<typeof Show_player>[0])
    return false
  }
  const files = fs.readdirSync(__PATH.player_path)
  const n = files.length + 1
  const talentUnknown = await getRandomTalent()
  const rawTalent = talentUnknown ?? {}
  const effVal =
    typeof rawTalent.eff === 'number' ? (rawTalent.eff as number) : 0
  const talent: Talent = { ...rawTalent, eff: effVal }
  const new_player: Player = {
    id: usr_qq,
    sex: '0',
    名号: `路人甲${n}号`,
    宣言: '这个人很懒还没有写',
    avatar: base.UserAvatar || 'https://s1.ax1x.com/2022/08/09/v8XV3q.jpg',
    level_id: 1,
    Physique_id: 1,
    race: 1,
    修为: 1,
    血气: 1,
    灵石: 10000,
    灵根: talent as Player['灵根'],
    神石: 0,
    favorability: 0,
    breakthrough: false,
    linggen: [],
    linggenshow: 1,
    学习的功法: [],
    修炼效率提升: talent.eff,
    连续签到天数: 0,
    攻击加成: 0,
    防御加成: 0,
    生命加成: 0,
    power_place: 1,
    当前血量: 8000,
    lunhui: 0,
    lunhuiBH: 0,
    轮回点: 10,
    occupation: [],
    occupation_level: 1,
    镇妖塔层数: 0,
    神魄段数: 0,
    魔道值: 0,
    仙宠: [],
    练气皮肤: 0,
    装备皮肤: 0,
    幸运: 0,
    addluckyNo: 0,
    师徒任务阶段: 0,
    师徒积分: 0
  }
  await writePlayer(usr_qq, new_player)
  const new_equipment = {
    武器: data.equipment_list.find(i => i.name === '烂铁匕首'),
    护具: data.equipment_list.find(i => i.name === '破铜护具'),
    法宝: data.equipment_list.find(i => i.name === '廉价炮仗')
  }
  await writeEquipment(usr_qq, new_equipment)
  const new_najie: Parameters<typeof Write_najie>[1] = {
    等级: 1,
    灵石上限: 5000,
    灵石: 0,
    装备: [],
    丹药: [],
    道具: [],
    功法: [],
    草药: [],
    材料: [],
    仙宠: [],
    武器: null,
    护具: null,
    法宝: null
  }
  await Write_najie(usr_qq, new_najie)
  await addHP(usr_qq, 999999)
  const danyaoInit = {
    biguan: 0,
    biguanxl: 0,
    xingyun: 0,
    lianti: 0,
    ped: 0,
    modao: 0,
    beiyong1: 0,
    beiyong2: 0,
    beiyong3: 0,
    beiyong4: 0,
    beiyong5: 0
  }
  await writeDanyao(usr_qq, danyaoInit)
  await Show_player(e as Parameters<typeof Show_player>[0])
  return false
}
