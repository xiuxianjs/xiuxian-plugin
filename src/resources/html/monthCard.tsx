import React from 'react';
import HTML from './HTML';
import { Avatar } from './Avatar';
import supermarketURL from '@src/resources/img/fairyrealm.jpg';
import userStateURL from '@src/resources/img/user_state2.png';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classNames from 'classnames';

// 配置dayjs插件
dayjs.extend(relativeTime);

interface MonthCardProps {
  isMonth: boolean;
  avatar: string;
  isNewbie?: boolean;
  data: {
    userId: string;
    currency: number;
    small_month_card_days: number;
    big_month_card_days: number;
    has_small_month_card: boolean;
    has_big_month_card: boolean;
    is_first_recharge: boolean;
    total_recharge_amount: number;
    total_recharge_count: number;
  };
}

// 月卡类型配置
interface MonthCardConfig {
  name: string;
  price: string;
  icon: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    price: string;
    expireBg: string;
    expireBorder: string;
    expireText: string;
  };
}

const monthCardConfigs: Record<'small' | 'big', MonthCardConfig> = {
  small: {
    name: '小月卡',
    price: '28¥',
    icon: '💍',
    colorTheme: {
      bg: 'from-blue-50/80 to-cyan-50/80',
      border: 'border-blue-200/50',
      text: 'text-blue-800',
      price: 'text-blue-600',
      expireBg: 'bg-blue-100/50',
      expireBorder: 'border-blue-200/30',
      expireText: 'text-blue-700'
    }
  },
  big: {
    name: '大月卡',
    price: '58¥',
    icon: '💎',
    colorTheme: {
      bg: 'from-purple-50/80 to-pink-50/80',
      border: 'border-purple-200/50',
      text: 'text-purple-800',
      price: 'text-purple-600',
      expireBg: 'bg-purple-100/50',
      expireBorder: 'border-purple-200/30',
      expireText: 'text-purple-700'
    }
  }
};

// 月卡组件
interface MonthCardItemProps {
  type: 'small' | 'big';
  config: MonthCardConfig;
  isActive: boolean;
  days: number;
  expireInfo: {
    date: string;
    relative: string;
  } | null;
}

const MonthCardItem: React.FC<MonthCardItemProps> = ({ type, config, isActive, days, expireInfo }) => {
  return (
    <div
      className={`bg-gradient-to-br ${config.colorTheme.bg} backdrop-blur-sm p-4 min-h-[200px] flex flex-col w-48 ${
        type === 'small'
          ? `rounded-l-xl border-l border-t border-b ${config.colorTheme.border}`
          : `rounded-r-xl border-r border-t border-b ${config.colorTheme.border}`
      }`}
    >
      <div className='flex items-center justify-center gap-2 mb-2'>
        <span className={`${config.colorTheme.price} text-xl`}>{config.icon}</span>
        <h3 className={`text-lg font-bold ${config.colorTheme.text}`}>{config.name}</h3>
      </div>
      <div className='text-center flex-1 flex flex-col justify-center'>
        <div className='flex flex-row gap-2 items-center justify-center mb-2'>
          <div className={`text-2xl font-bold ${config.colorTheme.price}`}>{config.price}</div>
          {isActive && (
            <div className='inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full'>
              <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse' />
              <span className='text-xs text-emerald-700 font-medium'>已开通</span>
            </div>
          )}
        </div>

        {/* 未开通时的文案填充 */}
        {!isActive && (
          <div className='space-y-1'>
            <div className={`text-xs ${config.colorTheme.text.replace('800', '600')} font-medium`}>30天有效期</div>
            <div className={`text-xs ${config.colorTheme.text.replace('800', '500')} opacity-80`}>{type === 'small' ? '基础权益套餐' : '高级权益套餐'}</div>
            <div className={`text-xs ${config.colorTheme.text.replace('800', '400')} opacity-60`}>{type === 'small' ? '6项基础特权' : '8项高级特权'}</div>
          </div>
        )}
        {/* 过期时间显示 */}
        {expireInfo && (
          <div className={`mt-2 p-2 ${config.colorTheme.expireBg} rounded-lg border ${config.colorTheme.expireBorder}`}>
            <div className={`text-xs ${config.colorTheme.expireText} font-medium mb-1`}>剩余天数: {days}天</div>
            <div className={`text-xs ${config.colorTheme.expireText.replace('700', '600')}`}>过期时间: {expireInfo.date}</div>
            {type === 'big' && <div className={`text-xs ${config.colorTheme.expireText.replace('700', '500')}`}>{expireInfo.relative}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

// 权益项组件
interface FeatureItemProps {
  feature: {
    title: string;
    icon: string;
    desc: string;
    highlight: boolean;
    type: 'small' | 'big';
  };
  isMonth: boolean;
  data: {
    has_small_month_card: boolean;
    has_big_month_card: boolean;
  };
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, isMonth, data }) => {
  return (
    <div
      className={classNames('relative overflow-hidden rounded-xl p-4 border shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]', {
        'bg-gradient-to-br from-yellow-50/90 via-amber-50/85 to-orange-50/90 border-amber-200/60': feature.highlight,
        'bg-gradient-to-br from-white/90 via-blue-50/85 to-cyan-50/90 border-blue-200/50': !feature.highlight
      })}
    >
      {/* 高亮装饰 */}
      {feature.highlight && (
        <>
          <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-xl' />
          <div className='absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-orange-400/8 to-amber-400/8 rounded-full blur-lg' />
          <div className='absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg'>
            <span className='text-white text-xs'>⭐️</span>
          </div>
        </>
      )}

      <div className='relative z-10 space-y-3'>
        <div className='flex items-center gap-3'>
          <div
            className={classNames('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', {
              'bg-gradient-to-br from-amber-500 to-orange-500': feature.highlight,
              'bg-gradient-to-br from-blue-500 to-cyan-500': !feature.highlight
            })}
          >
            <span className='text-white text-xl'>{feature.icon}</span>
          </div>
          <div className='flex-1'>
            <h4
              className={classNames('text-base font-bold drop-shadow-sm', {
                'text-amber-800': feature.highlight,
                'text-blue-800': !feature.highlight
              })}
            >
              {feature.title}
            </h4>
            <p
              className={classNames('text-sm mt-1', {
                'text-amber-700': feature.highlight,
                'text-blue-600': !feature.highlight
              })}
            >
              {feature.desc}
            </p>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          {/* 月卡类型标识 */}
          <div className='flex items-center gap-1'>
            <span
              className={classNames('text-xs', {
                'text-purple-600': feature.type === 'big',
                'text-blue-600': feature.type === 'small'
              })}
            >
              {feature.type === 'big' ? '💎' : '💍'}
            </span>
            <span
              className={classNames('text-xs font-medium', {
                'text-purple-700': feature.type === 'big',
                'text-blue-700': feature.type === 'small'
              })}
            >
              {feature.type === 'big' ? '大月卡' : '小月卡'}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            {feature.type === 'small' ? (
              // 小月卡权益：小月卡或大月卡开通时都激活
              isMonth || data?.has_big_month_card ? (
                <>
                  <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse' />
                  <span className='text-xs text-emerald-600 font-medium'>已激活</span>
                </>
              ) : (
                <>
                  <div className='w-2 h-2 bg-blue-400 rounded-full animate-pulse' />
                  <span className='text-xs text-blue-600 font-medium'>未激活</span>
                </>
              )
            ) : // 大月卡权益：只有大月卡开通时才激活
            data?.has_big_month_card ? (
              <>
                <div className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse' />
                <span className='text-xs text-emerald-600 font-medium'>已激活</span>
              </>
            ) : (
              <>
                <div className='w-2 h-2 bg-purple-400 rounded-full animate-pulse' />
                <span className='text-xs text-purple-600 font-medium'>未激活</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const features: Array<{
  title: string;
  icon: string;
  type: 'small' | 'big';
  desc: string;
  highlight: boolean;
}> = [
  {
    title: '自定义快捷键',
    icon: '⚡',
    type: 'small',
    desc: '个性化操作体验',
    highlight: false
  },
  {
    title: '个性化装扮',
    icon: '📷',
    type: 'small',
    desc: '自定义背景图等',
    highlight: false
  },
  {
    title: '打工本沉迷',
    icon: '💼',
    type: 'small',
    desc: '提升修炼效率',
    highlight: false
  },
  {
    title: '日签到奖励',
    icon: '💰',
    type: 'small',
    desc: '闪闪发光的石头*1，秘境之匙*10',
    highlight: false
  },
  {
    title: '周签到奖励',
    icon: '🎁',
    type: 'small',
    desc: '修为丹*N，仙府通行证*1，道具盲盒*1',
    highlight: false
  },
  {
    title: '双倍新人礼包',
    icon: '🎁',
    type: 'small',
    desc: '仅在新人且未领取新人礼包时生效',
    highlight: false
  },
  {
    title: '仙缘红包',
    icon: '🧧',
    type: 'big',
    desc: '消耗仙缘币，以发放仙缘币红包',
    highlight: true
  },
  {
    title: '一次性获得',
    icon: '🎁',
    type: 'big',
    desc: '更名卡、重生卡、专属称号',
    highlight: true
  }
];

const Monthcard: React.FC<MonthCardProps> = ({ isMonth, avatar, isNewbie: _isNewbie, data }) => {
  // 计算过期时间（假设从当前时间开始计算）
  const now = dayjs();
  const smallExpireTime = data?.small_month_card_days > 0 ? now.add(data.small_month_card_days, 'day') : null;
  const bigExpireTime = data?.big_month_card_days > 0 ? now.add(data.big_month_card_days, 'day') : null;

  // 格式化过期时间显示
  const formatExpireTime = (expireTime: dayjs.Dayjs | null) => {
    if (!expireTime) {
      return null;
    }

    return {
      date: expireTime.format('YYYY-MM-DD'),
      time: expireTime.format('HH:mm:ss'),
      relative: expireTime.fromNow()
    };
  };

  const smallExpire = formatExpireTime(smallExpireTime);
  const bigExpire = formatExpireTime(bigExpireTime);

  return (
    <HTML
      className='p-0 m-0 w-full text-center'
      dangerouslySetInnerHTML={{
        __html: `
          body {
            background-image: url(${supermarketURL});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
        `
      }}
    >
      <div className='h-3' />
      <div className='m-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-gradient-to-br from-white/70 via-blue-50/60 to-cyan-50/65 backdrop-blur-sm border border-blue-200/40 shadow-2xl w-[780px] pb-6'>
        <div className='m-4 w-[780px]'>
          {/* 头部区域 - 重新设计 */}
          <div className='text-center mb-6'>
            {/* 用户头像和月卡信息 - 左右布局 */}
            <div className='flex items-center justify-between mb-6'>
              {/* 用户头像 - 左容器居中 */}
              <div className='flex-1 flex justify-center'>
                <div className='relative'>
                  <Avatar src={avatar} stateSrc={userStateURL} rootClassName='w-32 h-32' className='w-28 h-28' />
                  {isMonth && (
                    <div className='absolute -bottom-0 -right-1 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg'>
                      <span className='text-white text-sm'>✓</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 月卡信息 - 组合按钮样式 */}
              <div className='flex-1 flex items-center justify-center'>
                <div className='flex items-center rounded-xl overflow-hidden shadow-lg'>
                  <MonthCardItem
                    type='small'
                    config={monthCardConfigs.small}
                    isActive={data?.has_small_month_card || false}
                    days={data?.small_month_card_days || 0}
                    expireInfo={smallExpire}
                  />
                  <MonthCardItem
                    type='big'
                    config={monthCardConfigs.big}
                    isActive={data?.has_big_month_card || false}
                    days={data?.big_month_card_days || 0}
                    expireInfo={bigExpire}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 权益功能列表 */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-500/15 via-cyan-500/12 to-blue-600/15 backdrop-blur-sm rounded-lg border border-blue-200/40 shadow-lg'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-200/40'>
                  <span className='text-blue-600 text-lg'>🎯</span>
                </div>
                <h3 className='text-xl font-bold text-blue-800 drop-shadow-sm'>专属权益</h3>
              </div>

              {/* 仙缘币信息组合显示 */}
              <div className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-full border border-yellow-400/40 shadow-lg'>
                <span className='text-yellow-600 text-lg'>🪙</span>
                <span className='text-yellow-800 font-semibold text-sm'>仙缘币余额</span>
                <span className='text-yellow-700 text-sm font-bold'>{data?.currency?.toLocaleString() || 0}</span>
                <span className='text-yellow-700 text-sm'>·</span>
                <span className='text-yellow-700 text-sm'>1¥=10Coin</span>
              </div>

              <div className='text-sm text-blue-700 font-medium'>共 {features.length} 项特权</div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {features.map((feature, index) => (
                <FeatureItem key={index} feature={feature} isMonth={isMonth} data={data} />
              ))}
            </div>
          </div>

          {data?.is_first_recharge === false && (
            <div className='mt-4 text-center'>
              <div className='inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full border border-orange-400/40 shadow-lg'>
                <span className='text-orange-600 text-lg'>🎁</span>
                <span className='text-orange-800 font-semibold'>首充奖励</span>
                <span className='text-orange-700 text-sm'>·</span>
                <span className='text-orange-700 text-sm'>任何充值都将触发首充奖励(小月卡天数*7)</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='h-3' />
    </HTML>
  );
};

export default Monthcard;
