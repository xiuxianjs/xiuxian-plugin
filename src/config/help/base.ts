import { HelpGroup } from './types';

const mainHelpConfig: HelpGroup[] = [
  {
    group: '修仙大厅',
    list: [
      { icon: 'help-icon_44', title: '#宗门管理', desc: '查看宗门指令' },
      { icon: 'help-icon_14', title: '#师徒帮助', desc: '查看师徒指令' },
      { icon: 'help-icon_14', title: '#活动中心', desc: '查看活动中心' },
      { icon: 'help-icon_14', title: '#快捷帮助', desc: '查看自定义快捷指令' }
    ]
  },
  {
    group: '初来乍到',
    list: [
      { icon: 'help-icon_2', title: '#修仙攻略', desc: '玩家自建攻略' },
      {
        icon: 'help-icon_2',
        title: '#踏入仙途 #再入仙途 #轮回',
        desc: '创建存档，转世重生'
      },
      { icon: 'help-icon_2', title: '#设置性别男/女', desc: '设置性别' },
      {
        icon: 'help-icon_3',
        title: '#改名张三 #设置道宣',
        desc: '修改道号，个性签名'
      },
      {
        icon: 'help-icon_1',
        title: '#我的纳戒 #升级纳戒',
        desc: '物品查询,容量提升'
      },
      { icon: 'help-icon_7', title: '#我的装备', desc: '查看身上的装备' },
      { icon: 'help-icon_4', title: '#修仙签到', desc: '修仙每日签到' },
      {
        icon: 'help-icon_8',
        title: '#存灵石123 #取灵石全部',
        desc: '将灵石安全保存到纳戒'
      },
      { icon: 'help-icon_8', title: '#交税999', desc: '主动改过自新' },
      { icon: 'help-icon_13', title: '#练气境界', desc: '查看所有境界' },
      { icon: 'help-icon_13', title: '#炼体境界', desc: '查看所有境界' },
      { icon: 'help-icon_13', title: '#职业等级', desc: '查看所有等级' },
      { icon: 'help-icon_13', title: '#丹药配方', desc: '查看丹方列表' },
      { icon: 'help-icon_13', title: '#装备图纸', desc: '查看图纸列表' }
    ]
  },
  {
    group: '修行之路',
    list: [
      { icon: 'help-icon_13', title: '#修仙状态', desc: '查看自己的时间动作' },
      {
        icon: 'help-icon_13',
        title: '#闭关N分钟 #出关',
        desc: '进行N分钟的闭关,获取修为'
      },
      {
        icon: 'help-icon_13',
        title: '#降妖N分钟 #降妖归来',
        desc: '进行N分钟,获取灵石'
      },
      { icon: 'help-icon_13', title: '#哪里有xxx', desc: '查询物品获得渠道' },
      { icon: 'help-icon_13', title: '#锁定+物品名', desc: '锁定指定物品' },
      {
        icon: 'help-icon_10',
        title: '#一键锁定/一键锁定+物品类型',
        desc: '#一键锁定装备'
      },
      {
        icon: 'help-icon_10',
        title: '#一键解锁/一键解锁+物品类型',
        desc: '#一键解锁装备'
      },
      { icon: 'help-icon_13', title: '#解锁+物品名', desc: '解锁指定物品' },
      { icon: 'help-icon_13', title: '#打磨轮回钟*绝', desc: '提高装备品质' },
      { icon: 'help-icon_13', title: '#活动兑换+兑换码', desc: '兑换奖励' }
    ]
  },
  {
    group: '逆天改命',
    list: [
      { icon: 'help-icon_15', title: '#我的练气', desc: '练气信息' },
      { icon: 'help-icon_17', title: '#我的炼体', desc: '炼体信息' },
      {
        icon: 'help-icon_38',
        title: '#突破 #幸运突破',
        desc: '打破浩劫-幸运草增加成功率'
      },
      {
        icon: 'help-icon_38',
        title: '#自动突破',
        desc: '轮回+合体以下境界可以使用'
      },
      {
        icon: 'help-icon_38',
        title: '#破体 #幸运破体',
        desc: '提高体境-幸运草增加成功率'
      },
      { icon: 'help-icon_44', title: '#渡劫', desc: '渡劫期经历的劫难' },
      { icon: 'help-icon_44', title: '#登仙', desc: '渡劫后前往仙界' }
    ]
  },
  {
    group: '世界副本',
    list: [
      {
        icon: 'help-icon_16',
        title: '#妖王/金角大王状态',
        desc: '仙界/人界BOSS'
      },
      { icon: 'help-icon_31', title: '#讨伐妖王/金角大王', desc: '干就完了' },
      {
        icon: 'help-icon_60',
        title: '#妖王/金角大王贡献榜',
        desc: '伤害排行榜'
      }
    ]
  },
  {
    group: '天地战场',
    list: [
      { icon: 'help-icon_54', title: '#报名比赛', desc: '参加纷争' },
      { icon: 'help-icon_44', title: '#更新属性', desc: '刷新自身属性' },
      { icon: 'help-icon_55', title: '#天地榜', desc: '排行榜' },
      { icon: 'help-icon_42', title: '#比试', desc: '一日三次机会' },
      { icon: 'help-icon_53', title: '#天地堂', desc: '兑换成果' },
      {
        icon: 'help-icon_50',
        title: '#积分兑换+物品',
        desc: '#积分兑换洗根水'
      },
      { icon: 'help-icon_58', title: '#清空积分', desc: '清除自身积分' }
    ]
  },
  {
    group: '交易往来',
    list: [
      { icon: 'help-icon_5', title: '#柠檬堂', desc: '商店' },
      { icon: 'help-icon_5', title: '#万宝楼', desc: '收废品(黑店)' },
      {
        icon: 'help-icon_5',
        title: '#冲水堂装备',
        desc: '交易系统(可替换为丹药/功法/道具/草药/仙宠/材料)'
      },
      {
        icon: 'help-icon_5',
        title: '#聚宝堂装备',
        desc: '交易系统(可替换为丹药/功法/道具/草药/仙宠/材料/仙宠口粮)'
      },
      {
        icon: 'help-icon_52',
        title: '#星阁拍卖行',
        desc: '看看现在在拍卖什么'
      },
      { icon: 'help-icon_52', title: '#星阁出价+价格', desc: '#星阁出价50' },
      {
        icon: 'help-icon_52',
        title: '#开启星阁体系',
        desc: '开启星阁推送(每天一次自动刷新)'
      },
      {
        icon: 'help-icon_52',
        title: '#取消星阁体系',
        desc: '取消星阁在该群推送'
      },
      {
        icon: 'help-icon_52',
        title: '#关闭星阁体系',
        desc: '关闭所有群的星阁推送(每天一次自动刷新)'
      },
      {
        icon: 'help-icon_53',
        title: '#回收+物品名',
        desc: '双倍价格回收无用的物品'
      }
    ]
  },
  {
    group: '礼尚往来',
    list: [
      {
        icon: 'help-icon_10',
        title: '@群友#赠送+灵石/物品名/装备代号*数量(可不加)',
        desc: '@道友 #赠送烂铁匕首*品质(可不加)*22'
      },
      {
        icon: 'help-icon_10',
        title: '@群友#一键赠送/一键赠送+物品类型',
        desc: '@道友 #一键赠送装备'
      },
      {
        icon: 'help-icon_10',
        title: '#发红包10000*5',
        desc: '灵石需要万的倍数'
      },
      { icon: 'help-icon_10', title: '#抢红包@对方', desc: '艾特发红包的仔' }
    ]
  },
  {
    group: '气运之子',
    list: [
      { icon: 'help-icon_11', title: '#探索仙府', desc: '' },
      { icon: 'help-icon_11', title: '#秘境', desc: '出门探险' },
      {
        icon: 'help-icon_11',
        title: '#降临秘境+地点名',
        desc: '获得修为与稀有物品'
      },
      { icon: 'help-icon_11', title: '#禁地', desc: '仙界陨落之地' },
      {
        icon: 'help-icon_11',
        title: '#前往禁地+禁地名',
        desc: '扣除灵石和修为'
      },
      {
        icon: 'help-icon_11',
        title: '#沉迷xx地点名*n',
        desc: 'xx为秘境、禁地、仙境和宗门秘境'
      },
      { icon: 'help-icon_11', title: '#逃离', desc: '支持放弃状态' },
      {
        icon: 'help-icon_43',
        title: '#抽+天地卡池/灵界卡池/凡界卡池',
        desc: '抽取仙宠'
      },
      { icon: 'help-icon_43', title: '#供奉奇怪的石头', desc: '可能有什么用吧' }
    ]
  },
  {
    group: '仙人之资(仅限仙人)',
    list: [
      { icon: 'help-icon_11', title: '#仙境', desc: '查看仙人镇守之地' },
      {
        icon: 'help-icon_11',
        title: '#镇守仙境+地点名',
        desc: '获得修为与稀有物品'
      }
    ]
  },
  {
    group: '职业发展',
    list: [
      {
        icon: 'help-icon_59',
        title: '#转职+职业名',
        desc: '炼丹师|采药师|炼器师|采矿师|侠客'
      },
      { icon: 'help-icon_59', title: '#猎户转+职业名', desc: '无损转职' },
      { icon: 'help-icon_59', title: '#转换副职', desc: '切换到副职业' },
      { icon: 'help-icon_45', title: '#炼制+丹药名*N', desc: '炼制丹药' },
      { icon: 'help-icon_42', title: '#我的药效', desc: '查看剩余药效' },
      {
        icon: 'help-icon_40',
        title: '#炼器师能力评测',
        desc: '锻造前先进行评测'
      },
      {
        icon: 'help-icon_40',
        title: '#熔炼+材料名*数量',
        desc: '放入锻造材料'
      },
      {
        icon: 'help-icon_40',
        title: '#我的锻炉',
        desc: '查看炉子里放了哪些物品'
      },
      { icon: 'help-icon_40', title: '#开始炼制', desc: '开始炼制装备' },
      { icon: 'help-icon_40', title: '#开炉', desc: '结束装备炼制,获得装备' },
      { icon: 'help-icon_40', title: '#清空锻炉', desc: '清空材料和炼制时间' },
      {
        icon: 'help-icon_40',
        title: '#赋名+装备名*新命名',
        desc: '给强力装备换个名字'
      },
      { icon: 'help-icon_40', title: '#打造+装备名', desc: '打造装备' },
      {
        icon: 'help-icon_59',
        title: '#采药N分钟 #结束采药',
        desc: '进行N分钟的采药,获取草药'
      },
      {
        icon: 'help-icon_25',
        title: '#采矿N分钟 #结束采矿',
        desc: '进行N分钟的采矿,获取矿石'
      },
      {
        icon: 'help-icon_25',
        title: '#悬赏目标',
        desc: '仅限侠客,每20h刷新,可私聊'
      },
      {
        icon: 'help-icon_25',
        title: '#讨伐目标+数字',
        desc: '仅限侠客，赚取灵石，可私聊'
      },
      { icon: 'help-icon_25', title: '#悬赏+账号*金额', desc: '悬赏玩家' },
      { icon: 'help-icon_25', title: '#赏金榜', desc: '悬赏榜单' },
      { icon: 'help-icon_25', title: '#刺杀目标+数字', desc: '全员可参与' }
    ]
  },
  {
    group: '仙宠',
    list: [
      {
        icon: 'help-icon_43',
        title: '#出战仙宠+仙宠名字/代号',
        desc: '注意有的仙宠存档灵魂绑定,出战后无法更换'
      },
      { icon: 'help-icon_43', title: '#进阶仙宠', desc: '仙宠进化' },
      { icon: 'help-icon_43', title: '#喂给仙宠+食物名称', desc: '升级仙宠' }
    ]
  },
  {
    group: '魔/神界',
    list: [
      { icon: 'help-icon_43', title: '#供奉魔石', desc: '获取和强化魔根' },
      { icon: 'help-icon_43', title: '#堕入魔界', desc: '消耗修为和魔道值' },
      { icon: 'help-icon_43', title: '#献祭魔石', desc: '获取随机物品' },
      { icon: 'help-icon_43', title: '#供奉神石', desc: '提高战斗属性' },
      { icon: 'help-icon_43', title: '#踏入神界', desc: '消耗灵石' },
      { icon: 'help-icon_43', title: '#参悟神石', desc: '获取随机丹药' },
      { icon: 'help-icon_43', title: '#敲开闪闪发光的石头', desc: '' }
    ]
  },
  {
    group: '镇妖试炼',
    list: [
      {
        icon: 'help-icon_19',
        title: '#挑战镇妖塔',
        desc: '试炼自己提高攻击力，获取灵石'
      },
      {
        icon: 'help-icon_17',
        title: '#炼神魄',
        desc: '试炼自己提高防御与血量，获取血气'
      },
      {
        icon: 'help-icon_19',
        title: '#一键挑战镇妖塔',
        desc: '试炼自己提高攻击力，获取灵石'
      },
      {
        icon: 'help-icon_17',
        title: '#一键炼神魄',
        desc: '试炼自己提高防御与血量，获取血气'
      }
    ]
  },
  {
    group: '礼尚往来(?)',
    list: [
      {
        icon: 'help-icon_18',
        title: '@群友 #以武会友',
        desc: '相互切磋武艺,没有限制,没有奖励'
      },
      {
        icon: 'help-icon_18',
        title: '@群友 #比武',
        desc: '比武,满血才可以进行，获得气血和一点点奖励'
      },
      {
        icon: 'help-icon_18',
        title: '@群友 #打劫',
        desc: '与其搏斗,胜方获得败方部分灵石'
      }
    ]
  },
  {
    group: '一键功能',
    list: [
      { icon: 'help-icon_37', title: '#一键学习', desc: '一键学习全部功法' },
      { icon: 'help-icon_22', title: '#一键服用修为丹', desc: '疯狂吃药' },
      { icon: 'help-icon_6', title: '#一键服用血气丹', desc: '疯狂吃药' },
      { icon: 'help-icon_6', title: '#一键装备', desc: '智能搭配最佳装备' },
      {
        icon: 'help-icon_53',
        title: '#一键出售+类型名',
        desc: '装备/丹药/道具/功法/草药/材料/仙宠/仙宠口粮'
      },
      {
        icon: 'help-icon_53',
        title: '#一键回收+类型名',
        desc: '装备/丹药/道具/功法/草药/材料/仙宠/仙宠口粮'
      }
    ]
  },
  {
    group: '残卷',
    list: [
      {
        icon: 'help-icon_26',
        title: '#消耗残卷',
        desc: '消耗十个残卷自选一个八品功法'
      },
      { icon: 'help-icon_13', title: '#学习+功法名', desc: '学习功法' },
      { icon: 'help-icon_16', title: '#消耗+道具名', desc: '消耗道具' },
      { icon: 'help-icon_6', title: '#服用+丹药名', desc: '服用' },
      {
        icon: 'help-icon_51',
        title: '#装备+装备名/装备代号',
        desc: '加*品级,可指定品级'
      }
    ]
  },
  {
    group: '君子爱财',
    list: [
      { icon: 'help-icon_10', title: '#打开钱包', desc: '水脚脚的钱包' },
      { icon: 'help-icon_53', title: '#金银坊', desc: '需要携带一定灵石' },
      {
        icon: 'help-icon_10',
        title: '#金银坊记录',
        desc: '看看自己是欧皇还是冤种'
      },
      {
        icon: 'help-icon_10',
        title: '#洗劫+地点名',
        desc: '支持柠檬堂、金银坊、万宝楼、星阁、万仙盟'
      },
      { icon: 'help-icon_10', title: '#探查+地点名', desc: '侦察物品' }
    ]
  },
  {
    group: '修身养性',
    list: [
      { icon: 'help-icon_19', title: '@群友 双修', desc: '年轻人要注意节制' },
      { icon: 'help-icon_12', title: '#怡红院', desc: '未成年人请不要进入' },
      { icon: 'help-icon_12', title: '#允许双修', desc: '不允许被双修' },
      { icon: 'help-icon_12', title: '#拒绝双修', desc: '主动拒绝双修' },
      { icon: 'help-icon_12', title: '@xx 结为道侣', desc: '成为道侣' },
      { icon: 'help-icon_12', title: '@xx 断绝姻缘', desc: '分手' },
      { icon: 'help-icon_12', title: '@xx 赠予百合花篮', desc: '增加亲密度' },
      {
        icon: 'help-icon_12',
        title: '#查询亲密度',
        desc: '查询自己与其他人的亲密度'
      }
    ]
  },
  {
    group: '唯我独尊',
    list: [
      { icon: 'help-icon_8', title: '#灵榜', desc: '最富有的十位肥羊' },
      { icon: 'help-icon_17', title: '#天榜', desc: '修为最高的十位大能' },
      { icon: 'help-icon_17', title: '#至尊榜', desc: '凡人战力榜' },
      { icon: 'help-icon_17', title: '#封神榜', desc: '仙人战力榜' },
      {
        icon: 'help-icon_17',
        title: '#神魄榜 #强化榜 #镇妖塔榜',
        desc: '查看各类榜单'
      },
      { icon: 'help-icon_17', title: '#魔道榜', desc: '谁是大魔头' },
      { icon: 'help-icon_17', title: '#神兵榜', desc: '玩家顶级装备排行' }
    ]
  }
];

export default mainHelpConfig;
