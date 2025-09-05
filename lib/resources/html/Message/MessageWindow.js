import MessageRow from './MessageRow.js';
import React from 'react';

function MessageWindow({ message, UserId }) {
    return (React.createElement("div", { className: 'chat-window chat-window-theme-dark flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' },
        React.createElement("div", { className: 'flex-shrink-0 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-b border-slate-600/30 px-6 py-4' },
            React.createElement("div", { className: 'flex items-center gap-3' },
                React.createElement("div", { className: 'w-3 h-3 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse' }),
                React.createElement("h2", { className: 'text-lg font-semibold text-white' }, "\u4FEE\u4ED9\u754C\u4F20\u97F3\u9601"),
                React.createElement("span", { className: 'text-sm text-slate-400' }, "\u5728\u7EBF"))),
        React.createElement("section", { className: 'flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800' },
            React.createElement("div", { className: 'px-4 py-6 space-y-2' }, message.length === 0 ? (React.createElement("div", { className: 'flex flex-col items-center justify-center h-64 text-slate-400' },
                React.createElement("div", { className: 'text-6xl mb-4' }, "\uD83D\uDCAC"),
                React.createElement("p", { className: 'text-lg font-medium' }, "\u6682\u65E0\u6D88\u606F"),
                React.createElement("p", { className: 'text-sm' }, "\u5F00\u59CB\u4F60\u7684\u4FEE\u4ED9\u4E4B\u65C5\u5427\uFF01"))) : (message.map(item => {
                const key = `${item.UserId}:${item.CreateAt}`;
                return (React.createElement("div", { key: key },
                    React.createElement(MessageRow, { item: item, isOwnMessage: UserId === item.UserId })));
            })))),
        React.createElement("div", { className: 'flex-shrink-0 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-t border-slate-600/30 px-6 py-4' },
            React.createElement("div", { className: 'flex items-center gap-3' },
                React.createElement("div", { className: 'flex-1 bg-slate-700/50 rounded-2xl px-4 py-3 border border-slate-600/30 chat-input' },
                    React.createElement("span", { className: 'text-slate-400 text-sm' }, "\u8F93\u5165\u6D88\u606F...")),
                React.createElement("button", { className: 'send-button w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-lg hover:shadow-blue-500/25 transition-all duration-200' },
                    React.createElement("svg", { className: 'w-5 h-5 text-white', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                        React.createElement("path", { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8' })))))));
}

export { MessageWindow as default };
