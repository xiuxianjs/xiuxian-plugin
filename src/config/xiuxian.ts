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

const najie_num = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000];

const najie_price = [0, 50000, 100000, 500000, 500000, 1000000, 3000000, 6000000];

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

// 任务定时表达式
const task = {
  // 商店刷新 - 每周一、五21点执行
  ShopTask: '0 0 21 ? * 1,5',
  // 冲水堂清理 - 每天20点59分执行
  ExchangeTask: '0 59 20 * * ?',
  // BOSS开启 - 每天21点执行
  BossTask: '0 0 21 * * ?',
  // BOSS开启2 - 每天20点执行
  BossTask2: '0 0 20 * * ?',
  // 拍卖任务
  AuctionofficialTask: '0 0/1 * * * ?',
  // 论坛任务
  ForumTask: '0 0/1 * * * ?',
  // 魔界任务
  MojiTask: '0 0/5 * * * ?',
  // 玩家控制任务
  PlayerControlTask: '0 0/1 * * * ?',
  // 秘境任务（plus）
  SecretPlaceplusTask: '0 0/5 * * * ?',
  // 职业任务
  OccupationTask: '0 0/1 * * * ?',
  // 消息任务
  MsgTask: '20 0/5 * * * ?',
  // 神界任务
  ShenjieTask: '0 0/5 * * * ?',
  // 商店等级任务
  ShopGradetask: '0 59 20 * * ?',
  // 逃跑任务
  Taopaotask: '0 0/5 * * * ?',
  // 秘境任务
  SecretPlaceTask: '0 0/1 * * * ?',
  // 天地榜任务
  TiandibangTask: '0 0 0 ? * 1',
  // 仙界任务
  Xijietask: '0 0/1 * * * ?',
  // 月卡周常礼包
  MonthCardTask: '0 0 0 * * 1'
};

export default {
  CD,
  sw,
  percentage,
  size,
  switchConfig,
  biguan,
  work,
  Sign,
  Auction,
  SecretPlace,
  najie_num,
  najie_price,
  whitecrowd,
  blackid,
  task
};
