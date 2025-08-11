import { renderComponentToBuffer } from 'jsxp'
import md5 from 'md5'
import type { ComponentType } from 'react'
import adminset from '../resources/html/adminset/adminset'
import association from '../resources/html/association/association'
import danfang from '../resources/html/danfang/danfang'
import danyao from '../resources/html/danyao/danyao'
import daoju from '../resources/html/daoju/daoju'
import equipment from '../resources/html/equipment/equipment'
import fairyrealm from '../resources/html/fairyrealm/fairyrealm'
import forbidden_area from '../resources/html/forbidden_area/forbidden_area'
import forum from '../resources/html/forum/forum'
import genius from '../resources/html/genius/genius'
import gongfa from '../resources/html/gongfa/gongfa'
import help from '../resources/html/help/help'
import immortal_genius from '../resources/html/Immortal/genius'
import log from '../resources/html/log/log'
import moneyCheck from '../resources/html/moneyCheck/moneyCheck'
import msg from '../resources/html/msg/msg'
import najie from '../resources/html/najie/najie'
import ningmenghome from '../resources/html/ningmenghome/ningmenghome'
import player from '../resources/html/player/player'
import playercopy from '../resources/html/playercopy/playercopy'
import ranking_money from '../resources/html/ranking_money/ranking_money'
import ranking_power from '../resources/html/ranking_power/ranking_power'
import searchforum from '../resources/html/searchforum/searchforum'
import secret_place from '../resources/html/secret_place/secret_place'
import shenbing from '../resources/html/shenbing/shenbing'
import shifu from '../resources/html/shifu/shifu'
import shitu from '../resources/html/shitu/shitu'
import shituhelp from '../resources/html/shituhelp/shituhelp'
import shitujifen from '../resources/html/shitujifen/shitujifen'
import shop from '../resources/html/shop/shop'
import state from '../resources/html/state/state'
import statemax from '../resources/html/statemax/statemax'
import statezhiye from '../resources/html/statezhiye/statezhiye'
import sudoku from '../resources/html/sudoku/sudoku'
import supermarket from '../resources/html/supermarket/supermarket'
import talent from '../resources/html/talent/talent'
import temp from '../resources/html/temp/temp'
import tianditang from '../resources/html/tianditang/tianditang'
import time_place from '../resources/html/time_place/time_place'
import tujian from '../resources/html/tujian/tujian'
import tuzhi from '../resources/html/tuzhi/tuzhi'
import valuables from '../resources/html/valuables/valuables'
import wuqi from '../resources/html/wuqi/wuqi'
import xianchong from '../resources/html/xianchong/xianchong'
import zongmeng from '../resources/html/zongmeng/zongmeng'
import updateRecord from '../resources/html/updateRecord/updateRecord'
import BlessPlace from '../resources/html/BlessPlace/BlessPlace'
import jindi from '../resources/html/jindi/jindi'

const map = {
  adminset,
  association,
  danfang,
  danyao,
  daoju,
  equipment,
  fairyrealm,
  forbidden_area,
  forum,
  genius,
  gongfa,
  help,
  immortal_genius,
  log,
  moneyCheck,
  msg,
  najie,
  ningmenghome,
  player,
  playercopy,
  ranking_money,
  ranking_power,
  searchforum,
  secret_place,
  shenbing,
  shifu,
  shitu,
  shituhelp,
  shitujifen,
  shop,
  state,
  statemax,
  statezhiye,
  sudoku,
  supermarket,
  talent,
  temp,
  tianditang,
  time_place,
  tujian,
  tuzhi,
  valuables,
  wuqi,
  xianchong,
  zongmeng,
  updateRecord,
  BlessPlace,
  jindi
}

// 简易内存缓存结构：每种页面+用户 只保存最近一次数据渲染结果
interface ShotCacheEntry {
  hash: string
  buffer: Buffer | string | false | undefined
  at: number
}
const shotCache = new Map<string, ShotCacheEntry>()

/**
 * 截图渲染
 * @param name 页面名称 (map key)
 * @param uid  用户/主体 id (参与缓存 key)
 * @param data 传入组件的数据
 * @param enableCache 是否启用内部缓存(默认 false 保持旧行为；传 true 时，若数据内容未变化直接复用上一张图)
 */
export async function screenshot(
  name: keyof typeof map,
  uid: number | string,
  data: unknown,
  enableCache = false
) {
  const keyBase = `data/${name}/${uid}`
  const component = map[name] as unknown as ComponentType<unknown>
  if (!enableCache) {
    // @ts-expect-error 宽松适配多种组件 props 结构
    return await renderComponentToBuffer(keyBase, component, data)
  }

  // 计算数据哈希；若序列化失败则退回不缓存
  let hash = ''
  try {
    hash = md5(JSON.stringify(data))
  } catch {
    // @ts-expect-error 宽松适配
    return await renderComponentToBuffer(keyBase, component, data)
  }

  const cacheKey = `${keyBase}`
  const existed = shotCache.get(cacheKey)
  if (existed && existed.hash === hash) {
    return existed.buffer
  }

  // @ts-expect-error 宽松适配
  const buffer = await renderComponentToBuffer(keyBase, component, data)
  shotCache.set(cacheKey, { hash, buffer, at: Date.now() })

  // 简单回收：超过 200 条时删最早的 50 条
  if (shotCache.size > 200) {
    const entries = [...shotCache.entries()].sort((a, b) => a[1].at - b[1].at)
    for (let i = 0; i < 50; i++) {
      const k = entries[i]?.[0]
      if (k) shotCache.delete(k)
    }
  }
  return buffer
}

class Pic {
  screenshot = screenshot
}
export default new Pic()
