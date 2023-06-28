import { GameApi, BotApi, plugin } from '#xiuxian-api'
export class Boxunion extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)联盟报到$/, fnc: 'userCheckin' },
        { reg: /^(#|\/)联盟签到$/, fnc: 'userSignIn' },
        { reg: /^(#|\/)联盟商会$/, fnc: 'unionShop' },
        { reg: /^(#|\/)兑换[\u4e00-\u9fa5]+\*\d+$/, fnc: 'unionBuy' }
      ]
    })
  }

  async unionShop(e) {
    if (!super.verify(e)) return false
    if (!UnionMessage(e)) return false
    const msg = ['___[联盟商会]___']
    msg.push('[(#|/)兑换+物品名*数量]')
    const commoditiesList = GameApi.Data.controlAction({
      NAME: 'alliancemall',
      CHOICE: 'generate_all'
    })
    for (let item of commoditiesList) {
      const id = item.id.split('-')
      switch (id[0]) {
        case '1': {
          msg.push(`物品:${item.name}\n攻击:${item.attack}%\n声望:${item.price}`)
          break
        }
        case '2': {
          msg.push(`物品:${item.name}\n防御:${item.defense}%\n声望:${item.price}`)
          break
        }
        case '3': {
          msg.push(`物品:${item.name}\n暴伤:${item.burstmax}%\n声望:${item.price}`)
          break
        }
        case '4': {
          if (id[1] == 1) {
            msg.push(`物品:${item.name}\n气血:${item.blood}%\n声望:${item.price}`)
          } else {
            msg.push(`物品:${item.name}\n修为:${item.experience}\n声望:${item.price}`)
          }
          break
        }
        case '5': {
          msg.push(`物品:${item.name}\n天赋:${item.size}%\n声望:${item.price}`)
          break
        }
        case '6': {
          msg.push(`物品:${item.name}\n声望:${item.price}`)
          break
        }
        default: {
          break
        }
      }
    }
    const isreply = await e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async unionBuy(e) {
    if (!super.verify(e)) return false
    if (!UnionMessage(e)) return false
    e.reply('[尚未开张~]')
    return false
  }

  async userSignIn(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    if (!UnionMessage(e)) return false
    const SignData = GameApi.Data.readInitial('sign', 'playerLife', {})
    const NowTime = new Date().getTime()
    const NowMath = new Date().getMonth()
    const NowDay = new Date().getDay()
    if (NowTime - SignData[UID].signTine > 24 * 60000 * 60 || SignData[UID].sginMath != NowMath) {
      SignData[UID].signSize = 0
    }
    if (NowDay == SignData[UID].signDay) {
      e.reply('今日已签到~')
      return false
    }
    SignData[UID].signSize += 1
    SignData[UID].signTine = NowTime
    SignData[UID].signDay = NowDay
    if (SignData[UID].signSize > 28) {
      e.reply('本月签到已满28天')
      return false
    }
    SignData[UID].sginMath = NowMath
    // 保存
    GameApi.Data.controlAction({
      CHOICE: 'playerLife',
      NAME: 'sign',
      DATA: SignData
    })
    if (SignData[UID].signSize % 7 == 0) {
      const randomthing = GameApi.GP.getRandomThing()
      GameApi.Bag.addBagThing({
        UID,
        name: randomthing.name,
        ACCOUNT: 1
      })
      e.reply(`本月累计签到${SignData[UID].signSize}天~\n获得${randomthing.name}`)
    } else {
      const ACCOUNT = 20 * (SignData[UID].signSize % 7)
      GameApi.Bag.addBagThing({
        UID,
        name: '中品灵石',
        ACCOUNT
      })
      e.reply(`本月累计签到${SignData[UID].signSize}天~获得[中品灵石]*${ACCOUNT}`)
    }
    return false
  }

  async userCheckin(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    if (!UnionMessage(e)) return false
    const LevelData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    if (LevelData.gaspractice.realm != 0) {
      e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
      return false
    }
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    if (action.newnoe != 1) {
      e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
      return false
    }
    action.newnoe = 0
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction',
      DATA: action
    })
    const randomthing = GameApi.GP.getRandomThing()
    GameApi.Bag.addBagThing({
      UID,
      name: randomthing.name,
      ACCOUNT: 1
    })
    e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧`)
    return false
  }
}

function UnionMessage(e) {
  if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
    e.reply('已仙鹤')
    return false
  }
  const { state, msg } = GameApi.Action.Go(e.user_id)
  if (state == 4001) {
    e.reply(msg)
    return false
  }
  const addressName = '联盟'
  if (!GameApi.Map.mapAction({ UID: e.user_id, addressName })) {
    e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    return false
  }
  return true
}
