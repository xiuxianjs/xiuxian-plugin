import React from 'react';
import HTML from './HTML';
import supermarketURL from '@src/resources/img/fairyrealm.jpg';

interface MonthCardProps {
  isMonth: boolean;
}

const features = [
  {
    title: '自定义快捷键'
  },
  {
    title: '支持打工本沉迷'
  },
  {
    title: '签到奖励增加',
    desc: '（闪闪发光的石头-1，秘境之匙-10）'
  },
  {
    title: '签到每满7天，触发周签到奖励',
    desc: '（修为丹-n，仙府通行证，道具盲盒）'
  }
];

const Monthcard: React.FC<MonthCardProps> = ({ isMonth }) => {
  return (
    <HTML
      style={{
        minHeight: '100vh',
        minWidth: '375px',
        maxWidth: '430px',
        margin: '0 auto',
        padding: 0,
        background: `linear-gradient(120deg, #e0e7ff 0%, #f0f9ff 100%), url(${supermarketURL}) center/cover no-repeat`,
        backgroundBlendMode: 'lighten',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className='w-full  mx-auto p-6 sm:p-8 bg-white/90 rounded-[2.5rem] shadow-2xl border border-blue-100 backdrop-blur-xl flex flex-col items-center'
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
          marginTop: '5vh',
          marginBottom: '5vh'
        }}
      >
        <div className='flex flex-col items-center mb-8'>
          <span className='inline-block mb-2 text-blue-500 drop-shadow-lg'>
            <svg width='48' height='48' fill='none' viewBox='0 0 24 24'>
              <path fill='currentColor' d='M12 2l2.09 6.26L20 9.27l-5 3.64L16.18 21 12 17.27 7.82 21 9 12.91l-5-3.64 5.91-.91z' />
            </svg>
          </span>
          <h2 className='text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow'>月卡权益</h2>
          {isMonth ? (
            <span className='mt-3 px-6 py-1.5 rounded-full bg-green-100 text-green-700 text-lg font-semibold shadow animate-pulse'>已开通</span>
          ) : (
            <span className='mt-3 px-6 py-1.5 rounded-full bg-red-100 text-red-600 text-lg font-semibold shadow'>未开通</span>
          )}
        </div>

        <div className='w-full'>
          <h3 className='text-xl font-semibold text-blue-600 mb-4 text-center'>专属功能</h3>
          <ul className='space-y-6'>
            {features.map((f, idx) => (
              <li key={idx} className='flex flex-col sm:flex-row items-center bg-blue-50/80 rounded-2xl px-5 py-4 shadow-md border border-blue-100'>
                <div className='flex-1 flex flex-col items-center sm:items-start'>
                  <span className='font-semibold text-blue-800 text-lg'>{f.title}</span>
                  {f.desc && <span className='mt-1 text-xs text-gray-500'>{f.desc}</span>}
                </div>
                <span
                  className={`mt-2 sm:mt-0 sm:ml-auto px-4 py-1 rounded-full font-medium text-base shadow ${
                    isMonth ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isMonth ? '已解锁' : '未解锁'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </HTML>
  );
};

export default Monthcard;
