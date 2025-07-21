import { Text, useSend, createSelects } from 'alemonjs'

import { createEventName } from '@src/response/util'
import { data, redis } from '@src/api/api'
import { isNotNull } from '@src/model'
export const name = createEventName(import.meta.url)
export const selects = createSelects([
  'message.create',
  'private.message.create'
])
export const regular = /^(#|\/)药园*$/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  let usr_qq = e.UserId
  let ifexistplay = data.existData('player', usr_qq)

  if (!ifexistplay) return false

  let player = data.getData('player', usr_qq)

  if (!isNotNull(player.宗门)) return false

  let ass = data.getAssociation(player.宗门.宗门名称)
  if (!isNotNull(player.宗门)) {
    return false
  } else if (ass.药园.药园等级 == 1 || ass.药园.药园等级 !== ass.宗门等级) {
    //加入宗门，没有药园或药园等级不等于宗门等级，则新建药园。
    await new_Garden(player.宗门.宗门名称, usr_qq) //新建药园
    Send(Text('新建药园，种下了一棵草'))
    ass = data.getAssociation(player.宗门.宗门名称)
  }
  let zuowu
  let shuliang = ass.宗门等级
  if (shuliang > 6) {
    shuliang = 6
  }
  let msg = [
    `宗门名称: ${ass.宗门名称}` +
      '\n' +
      `药园可栽种: ${shuliang} 棵药草` +
      '\n' +
      `药园药草如下:`
  ]
  let nowTime = new Date().getTime() //获取当前时间

  for (let i = 0; i < ass.药园.作物.length; i++) {
    zuowu = ass.药园.作物
    if (
      zuowu[i].name == '天灵花' ||
      zuowu[i].name == '皇草' ||
      zuowu[i].name == '创世花'
    )
      continue
    let vegetable_Oldtime: any = await redis.get(
      'xiuxian:' + ass.宗门名称 + zuowu[i].name
    ) //获得上次的成熟时间戳,
    let chengshu_t = Math.trunc((vegetable_Oldtime - nowTime) / 86400000) //成熟天数
    let chengshu_m = Math.trunc(
      ((vegetable_Oldtime - nowTime) % 86400000) / 60 / 60 / 1000
    ) //成熟小时
    let chengshu_s = Math.trunc(
      ((vegetable_Oldtime - nowTime) % 3600000) / 60 / 1000
    ) //成熟分钟
    if (chengshu_t <= 0 && chengshu_m <= 0 && chengshu_s <= 0) {
      chengshu_t = 0
      chengshu_m = 0
      chengshu_s = 0
    }
    let msg1 = [
      `作物: ${zuowu[i].name} ` +
        '\n' +
        `描述: ${zuowu[i].desc}` +
        '\n' +
        `成长时间:${chengshu_t}天${chengshu_m}小时${chengshu_s}分钟`
    ]
    msg = msg.concat(msg1)
  }
  // await ForwardMsg(e, msg)
  Send(Text(msg.join('\n')))
})
/**
 * 创立新的药园
 * @param name 宗门名称
 * @param user_qq qq号
 */
async function new_Garden(association_name, user_qq) {
  let now = new Date()
  let nowTime = now.getTime() //获取当前时间戳
  // let date = timestampToTime(nowTime)
  let ass = data.getAssociation(association_name)
  let AssociationGarden
  //怎么直接写这里而不是调用文件
  if (ass.宗门等级 == 9) {
    AssociationGarden = {
      药园等级: 9,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量'
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑'
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草'
        },
        {
          name: '龙火',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '龙火，不详'
        }
      ]
    }
  } else if (ass.宗门等级 == 8) {
    AssociationGarden = {
      药园等级: 8,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量'
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑'
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草'
        },
        {
          name: '龙火',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '龙火，不详'
        }
      ]
    }
  } else if (ass.宗门等级 == 7) {
    AssociationGarden = {
      药园等级: 7,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量'
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑'
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草'
        },
        {
          name: '龙火',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '龙火，不详'
        }
      ]
    }
  } else if (ass.宗门等级 == 6) {
    AssociationGarden = {
      药园等级: 6,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量'
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑'
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草'
        },
        {
          name: '龙火',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '龙火，不详'
        }
      ]
    }
  } else if (ass.宗门等级 == 5) {
    AssociationGarden = {
      药园等级: 5,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量'
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑'
        },
        {
          name: '仙草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '仙草'
        }
      ]
    }
  } else if (ass.宗门等级 == 4) {
    AssociationGarden = {
      药园等级: 4,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量'
        },
        {
          name: '大吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 7,
          desc: '大吉祥草的护佑'
        }
      ]
    }
  } else if (ass.宗门等级 == 3) {
    AssociationGarden = {
      药园等级: 3,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
        },
        {
          name: '小吉祥草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 3,
          desc: '小吉祥草的护佑，拥有抵御雷劫的力量'
        }
      ]
    }
  } else if (ass.宗门等级 == 2) {
    AssociationGarden = {
      药园等级: 2,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        },
        {
          name: '掣电树',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 2,
          desc: '汲取了地脉灵气的巨大藤蔓形成的草树。\n从树冠中源源不断释放出电力，隐隐有着雷光闪烁。\n5米内禁止玩火，雷火反应发生爆炸'
        }
      ]
    }
  } else if (ass.宗门等级 == 1) {
    AssociationGarden = {
      药园等级: 1,
      作物: [
        {
          name: '凝血草',
          start_time: nowTime,
          who_plant: user_qq,
          ts: 1,
          desc: '汲取了地脉灵气形成的草'
        }
      ]
    }
  }

  ass.药园 = AssociationGarden
  data.setAssociation(association_name, ass)
  //let ass = data.getAssociation(holder_qq);
  return false
}
