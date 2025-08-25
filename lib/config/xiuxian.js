const CD = {
    association: 10080,
    joinassociation: 450,
    associationbattle: 1440,
    rob: 120,
    gambling: 10,
    couple: 360,
    garden: 3,
    level_up: 3,
    secretplace: 7,
    timeplace: 7,
    forbiddenarea: 7,
    reborn: 360,
    transfer: 240,
    honbao: 1,
    boss: 1,
    biwu: 1
};
const percentage = {
    cost: 0.05,
    Moneynumber: 1,
    punishment: 0.5
};
const size = {
    Money: 200
};
const switchConfig = {
    play: true,
    Moneynumber: true,
    couple: true,
    Xiuianplay_key: false
};
const biguan = {
    size: 10,
    time: 30,
    cycle: 24
};
const work = {
    size: 15,
    time: 15,
    cycle: 32
};
const Sign = {
    ticket: 1
};
const Auction = {
    interval: 3,
    openHour: 19,
    closeHour: 20
};
const SecretPlace = {
    one: 0.99,
    two: 0.6,
    three: 0.28
};
const najie_num = [50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 10000000];
const najie_price = [0, 50000, 100000, 500000, 500000, 1000000, 3000000, 6000000];
const whitecrowd = [
    767253997
];
const blackid = [
    123456
];
const sw = {
    play: true,
    Moneynumber: true,
    couple: true,
    Xiuianplay_key: false
};
const task = {
    ShopTask: '0 0 21 ? * 1,5',
    ExchangeTask: '0 59 20 * * ?',
    BossTask: '0 0 21 * * ?',
    BossTask2: '0 0 20 * * ?',
    AuctionofficialTask: '0 0/1 * * * ?',
    ForumTask: '0 0/1 * * * ?',
    MojiTask: '0 0/5 * * * ?',
    PlayerControlTask: '0 0/1 * * * ?',
    SecretPlaceplusTask: '0 0/5 * * * ?',
    OccupationTask: '0 0/1 * * * ?',
    MsgTask: '20 0/5 * * * ?',
    ShenjieTask: '0 0/5 * * * ?',
    ShopGradetask: '0 59 20 * * ?',
    Taopaotask: '0 0/5 * * * ?',
    SecretPlaceTask: '0 0/1 * * * ?',
    TiandibangTask: '0 0 0 ? * 1',
    Xijietask: '0 0/1 * * * ?'
};
var xiuxian = {
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

export { xiuxian as default };
