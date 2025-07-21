import { redis } from '@src/api/api'
import { shijianc } from '@src/model'

/**
 * 判断宗门是否需要维护
 * @param ass 宗门对象
 * @returns true or false
 */
export function isNotMaintenance(ass) {
  let now = new Date()
  let nowTime = now.getTime() //获取当前日期的时间戳
  if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
    return false
  }
  return true
}

/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns obj==null/undefined,return false,other return true
 */
export function isNotNull(obj) {
  if (obj == undefined || obj == null) return false
  return true
}

//对象数组排序
export function sortBy(field) {
  //从大到小,b和a反一下就是从小到大
  return function (b, a) {
    return a[field] - b[field]
  }
}

//获取上次签到时间
export async function getLastsign_Asso(usr_qq) {
  //查询redis中的人物动作
  let time: any = await redis.get(
    'xiuxian@1.3.0:' + usr_qq + ':lastsign_Asso_time'
  )
  if (time != null) {
    let data = await shijianc(parseInt(time))
    return data
  }
  return false
}
