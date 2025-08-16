import { AuctionofficialTask } from './AuctionofficialTask'
import { BOSS2 } from './BOSS2'
import { ExchangeTask } from './ExchangeTask'
import { BOSS } from './BOSS'
import { ForumTask } from './ForumTask'
import { MojiTask } from './mojietask'
import { PlayerControlTask } from './PlayerControlTask'
import { SecretPlaceplusTask } from './SecretPlaceplusTask'
import { OccupationTask } from './OccupationTask'
import { MsgTask } from './msgTask'
import { ShenjieTask } from './shenjietask'
import { Shoptask } from './Shoptask'
import { ShopGradetask } from './ShopGradetask'
import { Taopaotask } from './Taopaotask'
import { SecretPlaceTask } from './SecretPlaceTask'
import { TiandibangTask } from './Tiandibang'
import { Xijietask } from './Xijietask'
import { ActionTask } from './ActionTask'
import { ActionPlusTask } from './ActionPlusTask'
import { GamesTask } from './GamesTask'
import { SaijiTask } from './SaijiTask'
import { TempTask } from './TempTask'

import { scheduleJob } from 'node-schedule'

export const startTask = () => {
  // 检测人物动作是否结束定时任务 - 每分钟执行
  scheduleJob('0 0/1 * * * ?', ActionTask)

  // 检测沉迷是否结束定时任务 - 每5分钟执行
  scheduleJob('0 0/5 * * * ?', ActionPlusTask)

  // 游戏锁定 - 每5分钟执行
  scheduleJob('0 */5 * * * ?', GamesTask)

  // 赛季结算 - 每周一0点执行
  scheduleJob('0 0 0 ? * 1', SaijiTask)

  // 商店刷新 - 每周一、五21点执行
  scheduleJob('0 0 21 ? * 1,5', Shoptask)

  // 冲水堂清理 - 每天20点59分执行
  scheduleJob('0 59 20 * * ?', ExchangeTask)

  // 检测人物动作是否结束定时任务 - 每5分钟执行20秒
  scheduleJob('20 0/5 * * * ?', TempTask)

  // BOSS开启 - 每天21点执行
  scheduleJob('0 0 21 * * ?', BOSS)

  // BOSS开启2 - 每天20点执行
  scheduleJob('0 0 20 * * ?', BOSS2)

  // 定时：每分钟执行
  scheduleJob('0 0/1 * * * ?', AuctionofficialTask)

  // 定时：每分钟执行
  scheduleJob('0 0/1 * * * ?', ForumTask)

  // 定时：每5分钟执行
  scheduleJob('0 0/5 * * * ?', MojiTask)

  // 定时：每分钟执行
  scheduleJob('0 0/1 * * * ?', PlayerControlTask)

  // 定时：每5分钟执行
  scheduleJob('0 0/5 * * * ?', SecretPlaceplusTask)

  // 定时：每分钟执行
  scheduleJob('0 0/1 * * * ?', OccupationTask)

  // 定时：每5分钟执行20秒
  scheduleJob('20 0/5 * * * ?', MsgTask)

  // 定时：每5分钟执行
  scheduleJob('0 0/5 * * * ?', ShenjieTask)

  // 定时：每59分钟执行
  scheduleJob('0 59 20 * * ?', ShopGradetask)

  // 定时：每5分钟执行
  scheduleJob('0 0/5 * * * ?', Taopaotask)

  // 定时：每分钟执行
  scheduleJob('0 0/1 * * * ?', SecretPlaceTask)

  // 定时：每天0点执行
  scheduleJob('0 0 0 ? * 1', TiandibangTask)

  // 定时：每分钟执行
  scheduleJob('0 0/1 * * * ?', Xijietask)
}

logger.info('定时任务启动')
