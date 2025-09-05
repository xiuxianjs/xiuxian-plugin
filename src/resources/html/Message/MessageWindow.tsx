import MessageRow from './MessageRow';
import React from 'react';

// 主消息窗口组件
function MessageWindow({ message, UserId }) {
  return (
    <div className='chat-window chat-window-theme-dark flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* 聊天窗口头部 */}
      <div className='flex-shrink-0 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-b border-slate-600/30 px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div className='w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse' />
          <h2 className='text-lg font-semibold text-white'>修仙界传音阁</h2>
          <span className='text-sm text-slate-400'>在线</span>
        </div>
      </div>

      {/* 消息列表区域 */}
      <section className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800'>
        <div className='px-4 py-6 space-y-2'>
          {message.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-slate-400'>
              <div className='text-6xl mb-4'>💬</div>
              <p className='text-lg font-medium'>暂无消息</p>
              <p className='text-sm'>开始你的修仙之旅吧！</p>
            </div>
          ) : (
            message.map(item => {
              const key = `${item.UserId}:${item.CreateAt}`;

              return (
                <div key={key}>
                  <MessageRow item={item} isOwnMessage={UserId === item.UserId} />
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 输入区域占位 */}
      <div className='flex-shrink-0 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-t border-slate-600/30 px-6 py-4'>
        <div className='flex items-center gap-3'>
          <div className='flex-1 bg-slate-700/50 rounded-2xl px-4 py-3 border border-slate-600/30 chat-input'>
            <span className='text-slate-400 text-sm'>输入消息...</span>
          </div>
          <button className='send-button w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg hover:shadow-blue-500/25 transition-all duration-200'>
            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageWindow;
