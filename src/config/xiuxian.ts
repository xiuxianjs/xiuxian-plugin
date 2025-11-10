const CD = {
  // 各种操作cd，单位：分，必须为整数
  association: 10080, // 宗门维护
  joinassociation: 450, // 退宗
  associationbattle: 1440, // 宗门大战
  rob: 120, // 打劫CD
  gambling: 10, // 金银坊（10秒CD）
  couple: 360, // 双修
  garden: 3, // 药园
  level_up: 3, // 突破
  secretplace: 7, // 秘境
  timeplace: 7, // 仙府
  forbiddenarea: 7, // 禁地
  reborn: 360, // 重生
  transfer: 240, // 转账
  honbao: 1, // 抢红包
  boss: 1, // BOSS
  biwu: 1 // 比武
};

const percentage = {
  cost: 0.05, // 手续费
  Moneynumber: 1, // 金银坊收益
  punishment: 0.5 // 出千收益
};

const size = {
  Money: 200 // 单位：万，出千控制
};

const switchConfig = {
  play: true, // 怡红院开关
  Moneynumber: true, // 金银坊开关
  couple: true, // 双修开关
  Xiuianplay_key: false // 怡红院卡图开关
};

const biguan = {
  size: 10, // 闭关倍率！收益：倍率*境界数*天赋*时间
  time: 30, // 闭关最低时间
  cycle: 24 // 闭关周期
};

const work = {
  size: 15, // 打工倍率！收益：倍率*境界数*时间
  time: 15, // 打工最低时间
  cycle: 32 // 打工周期
};

const Sign = {
  ticket: 1 // 每日签到给的沉迷门票
};

const Auction = {
  interval: 3, // 间歇时间
  openHour: 19, // 星阁开启时间
  closeHour: 20 // 星阁关闭时间
};

const SecretPlace = {
  one: 0.99, // 0.9保底，0.1蚂蚁
  two: 0.6,
  three: 0.28 // 0.3出金，0.7小金
};

const najieNum = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000];

const najiePrice = [0, 50000, 100000, 500000, 500000, 1000000, 3000000, 6000000];

const whitecrowd = [
  767253997 // 白名单群
];

const blackid = [
  123456 // 黑名单用户
];

const sw = {
  play: true, // 怡红院开关
  Moneynumber: true, // 金银坊开关
  couple: true, // 双修开关
  Xiuianplay_key: false // 怡红院卡图开关
};

// 系统配置
const systemConfig = {
  close_captcha: true, // 关闭验证码（人机行为检查），默认开启，设为true则关闭
  open_task: false, // 定时任务开关，默认开启，设为false则关闭
  botId: '', // 多机器人部署时的机器人账号，多个机器人同时启动时务必填写
  close_proactive_message: true, // 关闭主动消息（用于主动消息被限制的平台），默认开启，设为true则关闭
  open_give: true // 赠送功能开关（包括普通赠送和一键赠送），默认不开启，设为true则开启
};

/**
 * 类型的任务：
 *
 * 1. 计算类：读取玩家的action进行计算，更新玩家数据，mojie、职业、玩家控制、秘境plus、秘境、神届、逃跑、仙届
 * 2. 消息类：读取临时消息，处理后发送到群聊，消息
 * 3. 清理类：清理过期数据，冲水堂、论坛、
 * 4. 刷新类：一些特殊任务，拍卖行。商店刷新。
 * 5. 排名类：天地榜
 *
 */

// 任务定时表达式
const task = {
  // 天地榜任务
  TiandibangTask: '0 0 0 ? * 1',
  /**
   * **********
   */
  // 冲水堂清理
  ExchangeTask: '0 0 0/1 * * ?',
  // 聚宝堂
  ForumTask: '0 0/3 * * * ?',
  /**
   * **********
   * 存在订阅推送。
   * 25s一次
   */
  PushMessageTask: '0/25 * * * * ?',
  /**
   * **********
   */
  // 玩家行动任务（包含：魔界、玩家控制、职业、秘境、洗劫、神界、逃跑、秘境plus等任务）
  ActionsTask: '0 0/2 * * * ?',
  /**
   * **********
   */
  // 商店刷新 - 每周一、五21点执行
  ShopTask: '0 0 21 ? * 1,5',
  // 商店等级任务
  ShopGradetask: '0 59 20 * * ?',
  /**
   * **********
   * 存在订阅推送。
   */
  // 拍卖任务
  AuctionofficialTask: '0 0/1 * * * ?'
};

const bossTime = {
  1: {
    start: {
      hour: 21,
      minute: 0,
      second: 0,
      millisecond: 0
    },
    end: {
      hour: 21,
      minute: 58,
      second: 0,
      millisecond: 0
    }
  },
  2: {
    start: {
      hour: 20,
      minute: 0,
      second: 0,
      millisecond: 0
    },
    end: {
      hour: 20,
      minute: 58,
      second: 0,
      millisecond: 0
    }
  }
};

export type TaskKeys = keyof typeof task;

export default {
  CD,
  sw,
  systemConfig,
  percentage,
  size,
  switchConfig,
  biguan,
  work,
  Sign,
  Auction,
  SecretPlace,
  najie_num: najieNum,
  najie_price: najiePrice,
  whitecrowd,
  blackid,
  task,
  bossTime
};
