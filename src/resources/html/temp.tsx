import React from 'react';
import HTML from './HTML';
import tempStyles from '@src/resources/styles/temp.scss';

const Temp = ({ temp = [] }) => {
  return (
    <HTML linkStyleSheets={[tempStyles]}>
      <div className='min-h-screen bg-gradient-to-b from-amber-50 via-yellow-100 to-orange-200 flex flex-col items-center py-8 relative overflow-hidden'>
        {/* 背景装饰元素 */}
        <div className='absolute inset-0 bg-gradient-overlay' />
        <div className='absolute top-0 left-0 w-full h-32 bg-top-fade' />
        <div className='absolute bottom-0 left-0 w-full h-32 bg-bottom-fade' />

        {/* 主容器 */}
        <div className='w-full max-w-4xl mx-auto px-4 relative z-10'>
          {/* 消息容器 */}
          <div className='space-y-4'>
            {temp &&
              temp.map((item, index) => (
                <div key={index} className='relative group'>
                  {/* 消息气泡 */}
                  <div className='xiuxian-message bg-gradient-to-br from-white/90 via-amber-50/95 to-orange-50/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl border border-amber-300/50 overflow-hidden'>
                    {/* 左上角装饰 */}
                    <div className='corner-decoration top-0 left-0 w-16 h-16 rounded-br-2xl' />

                    {/* 右上角装饰 */}
                    <div className='corner-decoration top-0 right-0 w-12 h-12 rounded-bl-2xl' />

                    {/* 左下角装饰 */}
                    <div className='corner-decoration bottom-0 left-0 w-10 h-10 rounded-tr-2xl' />

                    {/* 右下角装饰 */}
                    <div className='corner-decoration bottom-0 right-0 w-14 h-14 rounded-tl-2xl' />

                    {/* 消息图标 */}
                    <div className='flex items-start space-x-4'>
                      <div className='message-number flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 border-amber-300/50'>
                        <span
                          className='text-white text-lg font-bold xiuxian-text'
                          style={{ fontFamily: 'tttgbnumber' }}
                        >
                          {index + 1}
                        </span>
                      </div>

                      {/* 消息内容 */}
                      <div className='flex-1 min-w-0'>
                        <div className='message-content rounded-xl px-3 py-2 border border-amber-200/50'>
                          <div
                            className='text-lg text-gray-800 font-medium leading-relaxed xiuxian-text'
                            style={{ fontFamily: 'tttgbnumber' }}
                          >
                            {item}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 底部装饰线 */}
                    <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rounded-full' />
                  </div>

                  {/* 连接线（除了最后一个） */}
                  {index < temp.length - 1 && (
                    <div className='connection-line absolute left-6 top-full w-0.5 h-6' />
                  )}
                </div>
              ))}
          </div>

          {/* 底部装饰 */}
          <div className='text-center mt-5'>
            <div className='bottom-decoration inline-block px-6 py-3 rounded-xl'>
              <span
                className='text-amber-100 text-sm font-medium xiuxian-text'
                style={{ fontFamily: 'tttgbnumber' }}
              >
                🎭 修仙之路，永无止境 🎭
              </span>
            </div>
          </div>
        </div>
      </div>
    </HTML>
  );
};

export default Temp;
