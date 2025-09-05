import MessageBubble from './MessageBubble.js';
import classNames from 'classnames';
import React from 'react';

const MessageRow = ({ item, isOwnMessage }) => {
    return (React.createElement("div", { className: classNames('flex gap-3 mb-4 px-4', {
            'flex-row-reverse': isOwnMessage,
            'flex-row': !isOwnMessage
        }) },
        React.createElement("div", { className: classNames('flex-shrink-0', {
                'order-2': isOwnMessage,
                'order-1': !isOwnMessage
            }) }, item.UserAvatar ? (React.createElement("img", { className: 'user-avatar w-10 h-10 rounded-full border-2 border-slate-600/50 shadow-md', src: item.UserAvatar, alt: '\u7528\u6237\u5934\u50CF' })) : (React.createElement("div", { className: 'user-avatar w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border-2 border-slate-600/50 shadow-md' },
            React.createElement("span", { className: 'text-slate-300 text-xs font-medium' }, "\u7528\u6237")))),
        React.createElement("div", { className: classNames('flex-1', {
                'order-1': isOwnMessage,
                'order-2': !isOwnMessage
            }) },
            React.createElement(MessageBubble, { data: item.data, createAt: item.CreateAt, isOwnMessage: isOwnMessage }))));
};

export { MessageRow as default };
