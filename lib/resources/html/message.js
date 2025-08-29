import React from 'react';
import HTML from './HTML.js';
import classNames from 'classnames';

const Message = ({ stats, messages, pagination }) => {
    const getPriorityColor = (priority) => {
        switch (priority) {
            case '紧急':
                return 'bg-red-500';
            case '高':
                return 'bg-orange-500';
            case '普通':
                return 'bg-green-500';
            case '低':
                return 'bg-gray-500';
            default:
                return 'bg-green-500';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case '未读':
                return 'bg-red-500';
            case '已读':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case '系统消息':
                return '⚙️';
            case '公告':
                return '📢';
            case '奖励通知':
                return '🎁';
            case '活动通知':
                return '🎮';
            case '个人消息':
                return '💬';
            default:
                return '📄';
        }
    };
    return (React.createElement(HTML, null,
        React.createElement("div", { className: 'min-h-[700px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-8 font-sans text-gray-200 rounded-2xl shadow-2xl relative overflow-hidden border border-white/10' },
            React.createElement("div", { className: 'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 rounded-t-2xl' }),
            React.createElement("div", { className: 'absolute top-5 right-5 w-16 h-16 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full opacity-60' }),
            React.createElement("div", { className: 'text-center mb-9 p-6 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/10 shadow-xl relative' },
                React.createElement("div", { className: 'absolute top-3 left-3 right-3 bottom-3 border-2 border-yellow-400/30 rounded-xl opacity-50' }),
                React.createElement("h1", { className: 'text-4xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text drop-shadow-lg tracking-wider mb-3' }, "\uD83C\uDFEE \u4FEE\u4ED9\u754C\u4F20\u97F3\u7B26 \uD83C\uDFEE"),
                React.createElement("p", { className: 'text-lg opacity-80 drop-shadow-md tracking-wide' }, "\u2728 \u9053\u53CB\uFF0C\u8FD9\u91CC\u662F\u4F60\u7684\u4E13\u5C5E\u4F20\u97F3\u9601 \u2728")),
            React.createElement("div", { className: 'grid grid-cols-3 gap-5 mb-8' },
                React.createElement("div", { className: 'bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 text-center border border-white/10 shadow-lg' },
                    React.createElement("div", { className: 'text-3xl mb-2' }, "\uD83D\uDCCA"),
                    React.createElement("div", { className: 'text-3xl font-bold text-yellow-400 mb-1' }, stats.total),
                    React.createElement("div", { className: 'text-sm opacity-80 tracking-wide' }, "\u603B\u6D88\u606F\u6570")),
                React.createElement("div", { className: 'bg-gradient-to-br from-red-500/15 to-red-500/5 rounded-xl p-5 text-center border border-red-500/30 shadow-lg' },
                    React.createElement("div", { className: 'text-3xl mb-2' }, "\uD83D\uDD34"),
                    React.createElement("div", { className: 'text-3xl font-bold text-red-400 mb-1' }, stats.unread),
                    React.createElement("div", { className: 'text-sm opacity-80 tracking-wide' }, "\u672A\u8BFB\u6D88\u606F")),
                React.createElement("div", { className: 'bg-gradient-to-br from-green-500/15 to-green-500/5 rounded-xl p-5 text-center border border-green-500/30 shadow-lg' },
                    React.createElement("div", { className: 'text-3xl mb-2' }, "\uD83D\uDFE2"),
                    React.createElement("div", { className: 'text-3xl font-bold text-green-400 mb-1' }, stats.read),
                    React.createElement("div", { className: 'text-sm opacity-80 tracking-wide' }, "\u5DF2\u8BFB\u6D88\u606F"))),
            React.createElement("div", { className: 'bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 mb-6 border border-white/10 shadow-xl min-h-[300px]' }, messages.length === 0 ? (React.createElement("div", { className: 'text-center py-16 px-5 text-xl opacity-70 bg-white/5 rounded-xl border border-dashed border-white/20' },
                React.createElement("div", { className: 'text-5xl mb-4' }, "\uD83D\uDD4A\uFE0F"),
                React.createElement("div", null, "\u6682\u65E0\u4F20\u97F3\u6D88\u606F\uFF0C\u9759\u5F85\u4F73\u97F3..."),
                React.createElement("div", { className: 'text-sm mt-3 opacity-50' }, "\u9053\u53CB\u53EF\u9759\u5FC3\u4FEE\u70BC\uFF0C\u7B49\u5F85\u673A\u7F18"))) : (React.createElement("div", { className: 'space-y-5' }, messages.map((message, index) => (React.createElement("div", { key: message.id, className: 'bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border-2 border-opacity-40 shadow-lg relative', style: {
                    borderColor: getStatusColor(message.status).replace('bg-', '') === 'red-500'
                        ? '#ef4444'
                        : getStatusColor(message.status).replace('bg-', '') === 'green-500'
                            ? '#22c55e'
                            : '#6b7280'
                } },
                React.createElement("div", { className: 'absolute top-0 left-0 right-0 h-1 rounded-t-xl', style: {
                        background: `linear-gradient(90deg, ${getStatusColor(message.status).replace('bg-', '') === 'red-500'
                            ? '#ef4444'
                            : getStatusColor(message.status).replace('bg-', '') === 'green-500'
                                ? '#22c55e'
                                : '#6b7280'}, ${getStatusColor(message.status).replace('bg-', '') === 'red-500'
                            ? '#ef444480'
                            : getStatusColor(message.status).replace('bg-', '') === 'green-500'
                                ? '#22c55e80'
                                : '#6b728080'})`
                    } }),
                React.createElement("div", { className: 'flex justify-between items-start mb-4 gap-4' },
                    React.createElement("div", { className: 'flex items-center gap-3 flex-1' },
                        React.createElement("div", { className: 'text-2xl w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg border border-white/20' }, getTypeIcon(message.type)),
                        React.createElement("div", { className: 'flex-1' },
                            React.createElement("div", { className: 'text-lg font-bold text-yellow-400 mb-1 drop-shadow-md' }, message.title),
                            React.createElement("div", { className: 'text-xs opacity-60 tracking-wide' },
                                "\uD83D\uDCE4 ",
                                message.sender))),
                    React.createElement("div", { className: 'flex gap-2 items-center' },
                        React.createElement("span", { className: classNames('px-3 py-1.5 rounded-md text-xs font-bold text-white drop-shadow-sm tracking-wide', getPriorityColor(message.priority)) }, message.priority),
                        React.createElement("span", { className: classNames('px-3 py-1.5 rounded-md text-xs font-bold text-white drop-shadow-sm tracking-wide', getStatusColor(message.status)) }, message.status))),
                React.createElement("div", { className: 'text-base leading-relaxed mb-4 p-4 bg-black/20 rounded-lg border border-white/5 drop-shadow-sm' }, message.content),
                React.createElement("div", { className: 'flex justify-between items-center text-xs opacity-70 pt-3 border-t border-white/10' },
                    React.createElement("div", { className: 'flex gap-5' },
                        React.createElement("span", { className: 'flex items-center gap-1' },
                            React.createElement("span", null, "\uD83D\uDCC5"),
                            message.createTime)),
                    React.createElement("span", { className: 'text-yellow-400 font-bold text-sm drop-shadow-sm' },
                        "#",
                        index + 1)))))))),
            React.createElement("div", { className: 'text-center text-base opacity-80 bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-5 border border-white/10 shadow-lg flex justify-center gap-8 items-center' },
                React.createElement("span", { className: 'flex items-center gap-2' },
                    React.createElement("span", null, "\uD83D\uDCC4"),
                    "\u7B2C ",
                    pagination.current,
                    " \u9875\uFF0C\u5171 ",
                    pagination.total,
                    " \u9875"),
                React.createElement("span", { className: 'flex items-center gap-2' },
                    React.createElement("span", null, "\uD83D\uDCCA"),
                    "\u603B\u8BA1 ",
                    pagination.totalMessages,
                    " \u6761\u6D88\u606F")),
            React.createElement("div", { className: 'text-center mt-6 pt-5 border-t-2 border-yellow-400/30 text-sm opacity-70 tracking-widest drop-shadow-md' }, "\uD83C\uDFEE \u4FEE\u4ED9\u754C\u4F20\u97F3\u9601 \u00B7 \u9053\u53CB\u4E13\u5C5E\u670D\u52A1 \uD83C\uDFEE"),
            React.createElement("div", { className: 'absolute bottom-5 left-5 w-10 h-10 bg-gradient-radial from-yellow-400/20 to-transparent rounded-full opacity-40' }))));
};

export { Message as default };
