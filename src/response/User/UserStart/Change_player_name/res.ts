import { Text, useSend } from 'alemonjs'
import { redis } from '@src/model/api'
import {
  existplayer,
  shijianc,
  readPlayer,
  writePlayer
} from '@src/model/index'
import { Show_player } from '../user'
import { selects } from '@src/response/index'

export const regular = /^(#|＃|\/)?(改名|设置道宣).*$/

// 切割正则
const regularCut = /^(#|＃|\/)?(改名|设置道宣)/

export default onResponse(selects, async e => {
  const Send = useSend(e)
  const usr_qq = e.UserId
  //有无存档
  const ifexistplay = await existplayer(usr_qq)
  if (!ifexistplay) return
  if (/改名/.test(e.MessageText)) {
    let new_name = e.MessageText.replace(regularCut, '')
    new_name = new_name.replace(' ', '')
    new_name = new_name.replace('+', '')
    if (new_name.length == 0) {
      Send(Text('改名格式为:【#改名张三】请输入正确名字'))
      return
    } else if (new_name.length > 8) {
      Send(Text('玩家名字最多八字'))
      return
    }
    let player = {}
    const now = new Date()
    const nowTime = now.getTime() //获取当前日期的时间戳
    //let Yesterday = await shijianc(nowTime - 24 * 60 * 60 * 1000);//获得昨天日期
    const Today = await shijianc(nowTime)
    let lastsetname_time = await redis.get(
      'xiuxian@1.3.0:' + usr_qq + ':last_setname_time'
    ) //获得上次改名日期,
    lastsetname_time = parseInt(lastsetname_time)
    lastsetname_time = await shijianc(lastsetname_time)
    if (
      Today.Y == lastsetname_time.Y &&
      Today.M == lastsetname_time.M &&
      Today.D == lastsetname_time.D
    ) {
      Send(Text('每日只能改名一次'))
      return
    }
    player = await readPlayer(usr_qq)
    if (player.灵石 < 1000) {
      Send(Text('改名需要1000灵石'))
      return
    }
    player.名号 = new_name
    redis.set('xiuxian@1.3.0:' + usr_qq + ':last_setname_time', nowTime) //redis设置本次改名时间戳
    player.灵石 -= 1000
    await writePlayer(usr_qq, player)
    //addCoin(usr_qq, -100);
    Show_player(e)
    return
  }
  //设置道宣
  else {
    let new_msg = e.MessageText.replace(regularCut, '')
    new_msg = new_msg.replace(' ', '')
    new_msg = new_msg.replace('+', '')
    if (new_msg.length == 0) {
      return
    } else if (new_msg.length > 50) {
      Send(Text('道宣最多50字符'))
      return
    }
    let player = {}
    const now = new Date()
    const nowTime = now.getTime() //获取当前日期的时间戳
    //let Yesterday = await shijianc(nowTime - 24 * 60 * 60 * 1000);//获得昨天日期
    //
    const Today = await shijianc(nowTime)
    let lastsetxuanyan_time = await redis.get(
      'xiuxian@1.3.0:' + usr_qq + ':last_setxuanyan_time'
    )
    //获得上次改道宣日期,
    lastsetxuanyan_time = parseInt(lastsetxuanyan_time)
    lastsetxuanyan_time = await shijianc(lastsetxuanyan_time)
    if (
      Today.Y == lastsetxuanyan_time.Y &&
      Today.M == lastsetxuanyan_time.M &&
      Today.D == lastsetxuanyan_time.D
    ) {
      Send(Text('每日仅可更改一次'))
      return
    }
    //这里有问题，写不进去
    player = await readPlayer(usr_qq)
    player.宣言 = new_msg //
    redis.set('xiuxian@1.3.0:' + usr_qq + ':last_setxuanyan_time', nowTime) //redis设置本次设道置宣时间戳
    await writePlayer(usr_qq, player)
    Show_player(e)
    return
  }
})
