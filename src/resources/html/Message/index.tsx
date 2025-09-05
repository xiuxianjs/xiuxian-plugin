import React from 'react';
import HTML from '../HTML';
import MessageWindow from './MessageWindow';

const Message = ({
  message,
  UserId
}: {
  message: {
    UserId: string;
    CreateAt: number;
    UserAvatar: string; // 可选
    data: any;
  }[];
  UserId: any;
}) => {
  return (
    <HTML className='w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      <div className='h-full max-w-4xl mx-auto shadow-2xl'>
        <MessageWindow message={message} UserId={UserId} />
      </div>
    </HTML>
  );
};

export default Message;
