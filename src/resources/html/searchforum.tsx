import React from 'react';
import HTML from './HTML';
import ningmenghomeURL from '@src/resources/img/fairyrealm.jpg';

const SearchForum = ({ Forum, nowtime }) => {
  return (
    <HTML
      className=' bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8'
      style={{
        backgroundImage: `url('${ningmenghomeURL}')`,
        backgroundSize: 'cover'
      }}
    >
      <div className='w-full max-w-2xl mx-auto'>
        <div className='rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center'>
          <div className='text-2xl font-bold text-blue-700 mb-2'>冒险家协会</div>
          <div className='text-base text-gray-600 mb-1'>向着仙府与神界,欢迎来到冒险家协会</div>
        </div>
        <div className='space-y-6'>
          {Forum?.map((item, index) => (
            <div key={index} className='rounded-xl shadow bg-white/70 p-4 flex flex-col items-start'>
              <div className='font-semibold text-blue-800 text-lg mb-1'>
                物品：{item.thing.name}【{item.pinji}】
              </div>
              <div className='text-sm text-gray-700 mb-1'>No.{index + 1}</div>
              <div className='text-sm text-gray-700 mb-1'>类型：{item.thing.class}</div>
              <div className='text-sm text-gray-700 mb-1'>数量：{item.thingNumber}</div>
              <div className='text-sm text-green-700 mb-1'>金额：{item.thingJIAGE}</div>
              {item.end_time - nowtime > 0 && (
                <div className='text-sm text-red-600'>
                  CD：{((item.end_time - nowtime) / 60000).toFixed(0)}分{(((item.end_time - nowtime) % 60000) / 1000).toFixed(0)}秒
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </HTML>
  );
};

export default SearchForum;
