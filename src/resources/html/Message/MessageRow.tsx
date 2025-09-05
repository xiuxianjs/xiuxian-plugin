import MessageBubble from './MessageBubble';
import classNames from 'classnames';
import React from 'react';

// 单个消息行组件
const MessageRow = ({ item, isOwnMessage }) => {
  return (
    <div
      className={classNames('flex gap-3 mb-4 px-4', {
        'flex-row-reverse': isOwnMessage,
        'flex-row': !isOwnMessage
      })}
    >
      {/* 用户头像 */}
      <div
        className={classNames('flex-shrink-0', {
          'order-2': isOwnMessage,
          'order-1': !isOwnMessage
        })}
      >
        {item.UserAvatar ? (
          <img className='user-avatar w-10 h-10 rounded-full border-2 border-slate-600/50 shadow-md' src={item.UserAvatar} alt='用户头像' />
        ) : (
          <div className='user-avatar w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border-2 border-slate-600/50 shadow-md'>
            <span className='text-slate-300 text-xs font-medium'>用户</span>
          </div>
        )}
      </div>

      {/* 消息气泡 */}
      <div
        className={classNames('flex-1', {
          'order-1': isOwnMessage,
          'order-2': !isOwnMessage
        })}
      >
        <MessageBubble data={item.data} createAt={item.CreateAt} isOwnMessage={isOwnMessage} />
      </div>
    </div>
  );
};

export default MessageRow;
