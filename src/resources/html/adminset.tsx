import React from 'react';
import stateURL from '@src/resources/img/state.jpg';
import HTML from './HTML';

interface XiuxianSettingsProps {
  // 冷却时间设置
  CDassociation: number;
  CDjoinassociation: number;
  CDassociationbattle: number;
  CDrob: number;
  CDgambling: number;
  CDcouple: number;
  CDgarden: number;
  CDlevel_up: number;
  CDsecretplace: number;
  CDtimeplace: number;
  CDforbiddenarea: number;
  CDreborn: number;
  CDtransfer: number;
  CDhonbao: number;
  // 金银坊设置
  percentagecost: number;
  percentageMoneynumber: number;
  percentagepunishment: number;
  sizeMoney: number;
  // 开关设置
  switchplay: string;
  switchMoneynumber: string;
  switchcouple: string;
  switchXiuianplay_key: string;
  // 收益设置
  biguansize: number;
  biguantime: number;
  biguancycle: number;
  worksize: number;
  worktime: number;
  workcycle: number;
  // 出金概率
  SecretPlaceone: number;
  SecretPlacetwo: number;
  SecretPlacethree: number;
}

// 修仙风格图标组件
const XiuxianIcon = ({ type }: { type: string }) => {
  const iconMap: { [key: string]: string } = {
    宗门维护: '🏛️',
    退宗: '🚪',
    宗门大战: '⚔️',
    打劫: '🗡️',
    金银坊: '💰',
    双修: '💕',
    药园: '🌿',
    突破: '⚡',
    秘境: '🏔️',
    仙府: '🏯',
    禁地: '☠️',
    重生: '🔄',
    转账: '💸',
    抢红包: '🧧',
    手续费: '💎',
    金银坊收益: '🏆',
    出千收益: '🎲',
    出千控制: '🎯',
    怡红院: '🏮',
    怡红院卡图: '🖼️',
    闭关倍率: '🧘',
    闭关最低时间: '⏰',
    闭关周期: '📅',
    除妖倍率: '👹',
    除妖最低时间: '⏱️',
    除妖周期: '🗓️',
    第一概率: '🥇',
    第二概率: '🥈',
    第三概率: '🥉'
  };

  return <span className='text-lg mr-2 opacity-80'>{iconMap[type] || '⚙️'}</span>;
};

// 设置项组件
const SettingItem = ({ label, value, unit = '' }: { label: string; value: string | number; unit?: string }) => (
  <div className='relative group'>
    {/* 装饰性边框 */}
    <div className='absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 rounded-xl blur-sm' />
    <div className='relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl'>
      {/* 顶部装饰线 */}
      <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent' />

      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <XiuxianIcon type={label} />
          <span className='font-medium tracking-wide text-white/90 text-sm'>{label}</span>
        </div>
        <div className='flex items-center'>
          <span className='font-bold text-amber-300 text-lg tracking-wider'>{value}</span>
          {unit && <span className='ml-1 text-amber-200/80 text-sm font-medium'>{unit}</span>}
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent' />
    </div>
  </div>
);

// 设置区块组件
const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className='relative'>
    {/* 背景装饰 */}
    <div className='absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 rounded-3xl blur-sm' />
    <div className='relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl'>
      {/* 四角装饰 */}
      <div className='absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-amber-400 rounded-tl-lg' />
      <div className='absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-amber-400 rounded-tr-lg' />
      <div className='absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-amber-400 rounded-bl-lg' />
      <div className='absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-amber-400 rounded-br-lg' />

      <div className='mb-6'>
        <h2 className='text-2xl font-bold tracking-widest text-center text-white/95 flex items-center justify-center gap-3'>
          <div className='w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent' />
          <span className='bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent'>{title}</span>
          <div className='w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent' />
        </h2>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>{children}</div>
    </div>
  </section>
);

const XiuxianSettings: React.FC<XiuxianSettingsProps> = props => {
  // 配置数据结构化
  const cooldownSettings = [
    { label: '宗门维护', value: props.CDassociation, unit: '分' },
    { label: '退宗', value: props.CDjoinassociation, unit: '分' },
    { label: '宗门大战', value: props.CDassociationbattle, unit: '分' },
    { label: '打劫', value: props.CDrob, unit: '分' },
    { label: '金银坊', value: props.CDgambling, unit: '分' },
    { label: '双修', value: props.CDcouple, unit: '分' },
    { label: '药园', value: props.CDgarden, unit: '分' },
    { label: '突破', value: props.CDlevel_up, unit: '分' },
    { label: '秘境', value: props.CDsecretplace, unit: '分' },
    { label: '仙府', value: props.CDtimeplace, unit: '分' },
    { label: '禁地', value: props.CDforbiddenarea, unit: '分' },
    { label: '重生', value: props.CDreborn, unit: '分' },
    { label: '转账', value: props.CDtransfer, unit: '分' },
    { label: '抢红包', value: props.CDhonbao, unit: '分' }
  ];

  const gamblingSettings = [
    { label: '手续费', value: props.percentagecost },
    { label: '金银坊收益', value: props.percentageMoneynumber },
    { label: '出千收益', value: props.percentagepunishment },
    { label: '出千控制', value: props.sizeMoney, unit: '万' }
  ];

  const switchSettings = [
    { label: '怡红院', value: props.switchplay },
    { label: '金银坊', value: props.switchMoneynumber },
    { label: '双修', value: props.switchcouple },
    { label: '怡红院卡图', value: props.switchXiuianplay_key }
  ];

  const incomeSettings = [
    { label: '闭关倍率', value: props.biguansize },
    { label: '闭关最低时间', value: props.biguantime, unit: '分' },
    { label: '闭关周期', value: props.biguancycle },
    { label: '除妖倍率', value: props.worksize },
    { label: '除妖最低时间', value: props.worktime, unit: '分' },
    { label: '除妖周期', value: props.workcycle }
  ];

  const goldSettings = [
    { label: '第一概率', value: props.SecretPlaceone },
    { label: '第二概率', value: props.SecretPlacetwo },
    { label: '第三概率', value: props.SecretPlacethree }
  ];

  // 设置区块配置数组
  const settingSections = [
    { title: '⚡ 冷却设置', settings: cooldownSettings },
    { title: '💰 金银坊设置', settings: gamblingSettings },
    { title: '🎛️ 开关控制', settings: switchSettings },
    { title: '📈 收益设置', settings: incomeSettings },
    { title: '🏆 出金设置', settings: goldSettings }
  ];

  return (
    <HTML>
      <div className=' w-full bg-cover bg-center text-center p-4 md:p-8 space-y-8' style={{ backgroundImage: `url(${stateURL})` }}>
        {/* 头部区域 */}
        <header className='relative text-center space-y-6'>
          {/* 标题区域 */}
          <div className='relative'>
            <h1 className='relative inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 text-3xl md:text-4xl font-bold tracking-widest text-white shadow-2xl'>
              🏮 修仙设置 🏮
            </h1>
          </div>
        </header>
        <main className='max-w-7xl mx-auto space-y-10'>
          {/* 设置内容区域 */}
          <div className='flex flex-col gap-10'>
            {settingSections.map((section, sectionIndex) => (
              <SettingSection key={sectionIndex} title={section.title}>
                {section.settings.map((setting, index) => (
                  <SettingItem key={index} label={setting.label} value={setting.value} unit={setting.unit} />
                ))}
              </SettingSection>
            ))}
          </div>
        </main>

        {/* 底部装饰 */}
        <footer className='text-center py-8'>
          <div className='inline-block px-6 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-400/20 rounded-xl'>
            <span className='text-amber-300/80 text-sm tracking-wide'>✨ 修仙之路，道法自然 ✨</span>
          </div>
        </footer>
      </div>
    </HTML>
  );
};

export default XiuxianSettings;
