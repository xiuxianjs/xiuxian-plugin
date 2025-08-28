import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/road.jpg.js';

const SecretPlace = ({ didian_list }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: 'min-h-screen relative overflow-hidden', style: {
                backgroundImage: `url(${fileUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            } },
            React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-br from-black/60 via-gray-900/50 to-black/70' }),
            React.createElement("div", { className: 'absolute inset-0 opacity-30' },
                React.createElement("div", { className: 'absolute top-10 left-10 w-32 h-32 border border-red-400 rounded-full' }),
                React.createElement("div", { className: 'absolute top-32 right-20 w-24 h-24 border border-orange-400 rounded-full' }),
                React.createElement("div", { className: 'absolute bottom-20 left-1/4 w-16 h-16 border border-yellow-400 rounded-full' }),
                React.createElement("div", { className: 'absolute bottom-40 right-1/3 w-20 h-20 border border-red-400 rounded-full' })),
            React.createElement("div", { className: 'relative z-10 container mx-auto px-4 py-8' },
                React.createElement("div", { className: 'text-center mb-8' },
                    React.createElement("div", { className: 'inline-block relative' },
                        React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur-lg opacity-50' }),
                        React.createElement("div", { className: 'relative bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl px-8 py-4 border border-red-400/30 backdrop-blur-sm' },
                            React.createElement("h1", { className: 'text-3xl font-bold text-white tracking-wider' }, "\u26A0\uFE0F \u7981\u5730 \u26A0\uFE0F"))),
                    React.createElement("div", { className: 'mt-4 text-red-200 text-sm' }, "\uD83D\uDD25 \u4FEE\u4ED9\u754C\u5371\u9669\u7981\u5730\uFF0C\u751F\u6B7B\u4E0E\u673A\u7F18\u5E76\u5B58 \uD83D\uDD25")),
                React.createElement("div", { className: 'max-w-6xl mx-auto' },
                    React.createElement("div", { className: 'relative' },
                        React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl' }),
                        React.createElement("div", { className: 'relative backdrop-blur-sm bg-black/40 rounded-3xl border border-red-400/30 p-8 shadow-xl' },
                            React.createElement("div", { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' }, didian_list?.length ? (didian_list.map((item, index) => (React.createElement("div", { key: index, className: 'relative group' },
                                React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-600/20 rounded-2xl blur-sm' }),
                                React.createElement("div", { className: 'relative backdrop-blur-md bg-black/60 rounded-2xl border border-red-400/40 p-6 shadow-lg', style: {
                                        backgroundImage: `url(${fileUrl$1})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    } },
                                    React.createElement("div", { className: 'flex items-center justify-between mb-4' },
                                        React.createElement("div", { className: 'flex items-center gap-3' },
                                            React.createElement("div", { className: 'w-10 h-10 bg-gradient-to-br from-red-400 to-orange-600 rounded-lg flex items-center justify-center border border-red-300/50 shadow-md' },
                                                React.createElement("span", { className: 'text-sm' },
                                                    typeof item.Grade === 'number' && item.Grade <= 10 && '🌱',
                                                    typeof item.Grade === 'number'
                                                        && item.Grade > 10
                                                        && item.Grade <= 20
                                                        && '🌿',
                                                    typeof item.Grade === 'number'
                                                        && item.Grade > 20
                                                        && item.Grade <= 30
                                                        && '🌳',
                                                    typeof item.Grade === 'number'
                                                        && item.Grade > 30
                                                        && item.Grade <= 40
                                                        && '🌲',
                                                    typeof item.Grade === 'number'
                                                        && item.Grade > 40
                                                        && item.Grade <= 50
                                                        && '🌟',
                                                    typeof item.Grade === 'number' && item.Grade > 50 && '💎',
                                                    typeof item.Grade === 'string'
                                                        && item.Grade.includes('初级')
                                                        && '🌱',
                                                    typeof item.Grade === 'string'
                                                        && item.Grade.includes('中级')
                                                        && '🌿',
                                                    typeof item.Grade === 'string'
                                                        && item.Grade.includes('高级')
                                                        && '🌳',
                                                    typeof item.Grade === 'string'
                                                        && item.Grade.includes('顶级')
                                                        && '🌲',
                                                    typeof item.Grade === 'string'
                                                        && item.Grade.includes('传说')
                                                        && '🌟',
                                                    typeof item.Grade === 'string'
                                                        && item.Grade.includes('神话')
                                                        && '💎',
                                                    !['🌱', '🌿', '🌳', '🌲', '🌟', '💎'].includes(item.Grade) && '⚠️')),
                                            React.createElement("div", null,
                                                React.createElement("h3", { className: 'text-lg font-bold text-red-200' }, item.name),
                                                React.createElement("span", { className: 'text-xs text-gray-400' },
                                                    "\u7B49\u7EA7: ",
                                                    item.Grade))),
                                        React.createElement("div", { className: 'text-right' },
                                            React.createElement("div", { className: 'text-lg font-bold text-yellow-300' },
                                                "#",
                                                index + 1),
                                            React.createElement("div", { className: 'text-xs text-yellow-400' }, "\u7981\u5730"))),
                                    React.createElement("div", { className: 'space-y-4' },
                                        React.createElement("div", { className: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/20' },
                                            React.createElement("div", { className: 'flex items-center gap-2 mb-2' },
                                                React.createElement("div", { className: 'w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center' },
                                                    React.createElement("span", { className: 'text-xs' }, "\uD83D\uDC8E")),
                                                React.createElement("span", { className: 'text-sm font-medium text-purple-200' }, "\u6781\u54C1\u5956\u52B1")),
                                            React.createElement("div", { className: 'flex flex-wrap gap-2' }, item.Best.map((best, idx) => (React.createElement("span", { key: idx, className: 'inline-block bg-purple-200 text-purple-900 rounded-lg px-3 py-1 text-xs font-semibold border border-purple-300/50' }, best))))),
                                        React.createElement("div", { className: 'grid grid-cols-1 gap-3' },
                                            React.createElement("div", { className: 'flex items-center gap-2' },
                                                React.createElement("div", { className: 'w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center' },
                                                    React.createElement("span", { className: 'text-xs' }, "\uD83D\uDCB0")),
                                                React.createElement("span", { className: 'text-sm text-blue-200' }, "\u6240\u9700\u7075\u77F3\uFF1A"),
                                                React.createElement("span", { className: 'text-sm font-bold text-blue-100' }, item.Price)),
                                            React.createElement("div", { className: 'flex items-center gap-2' },
                                                React.createElement("div", { className: 'w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center' },
                                                    React.createElement("span", { className: 'text-xs' }, "\u2B50")),
                                                React.createElement("span", { className: 'text-sm text-green-200' }, "\u6240\u9700\u4FEE\u4E3A\uFF1A"),
                                                React.createElement("span", { className: 'text-sm font-bold text-green-100' }, item.experience)))),
                                    React.createElement("div", { className: 'mt-4' },
                                        React.createElement("div", { className: 'flex items-center gap-3 mb-2' },
                                            React.createElement("div", { className: 'w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center' },
                                                React.createElement("span", { className: 'text-xs' }, "\uD83D\uDD25")),
                                            React.createElement("span", { className: 'text-sm font-medium text-red-200' }, "\u5371\u9669\u7B49\u7EA7")),
                                        React.createElement("div", { className: 'flex items-center gap-2' },
                                            React.createElement("div", { className: 'flex-1 bg-gray-700/30 rounded-full h-3' },
                                                React.createElement("div", { className: 'bg-gradient-to-r from-red-400 to-orange-600 h-3 rounded-full', style: {
                                                        width: `${Math.min((index + 1) * 15, 100)}%`
                                                    } })),
                                            React.createElement("span", { className: 'text-xs text-gray-300' },
                                                Math.min((index + 1) * 15, 100),
                                                "%"))),
                                    React.createElement("div", { className: 'mt-4 text-center' },
                                        React.createElement("div", { className: 'inline-block px-4 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-400/30 backdrop-blur-sm' },
                                            React.createElement("span", { className: 'text-red-200 text-sm font-medium' },
                                                index === 0 && '⚠️ 初级禁地，新手慎入',
                                                index === 1 && '🔥 中级禁地，挑战与机遇',
                                                index === 2 && '⚡ 高级禁地，强者云集',
                                                index >= 3 && index < 6 && '💀 顶级禁地，生死一线',
                                                index >= 6 && index < 9 && '👹 传说禁地，恶魔横行',
                                                index >= 9 && '💀 神话禁地，九死一生')))))))) : (React.createElement("div", { className: 'col-span-full text-center' },
                                React.createElement("div", { className: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 rounded-xl p-8 border border-gray-400/30 backdrop-blur-sm' },
                                    React.createElement("div", { className: 'w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4' },
                                        React.createElement("span", { className: 'text-2xl' }, "\u26A0\uFE0F")),
                                    React.createElement("p", { className: 'text-gray-300 text-lg font-medium' }, "\u6682\u65E0\u7981\u5730"),
                                    React.createElement("p", { className: 'text-gray-400 text-sm mt-2' }, "\u7B49\u5F85\u65B0\u7684\u7981\u5730\u51FA\u73B0"))))),
                            React.createElement("div", { className: 'mt-8 pt-6 border-t border-red-400/20' },
                                React.createElement("div", { className: 'flex items-center justify-center gap-6' },
                                    React.createElement("div", { className: 'flex items-center gap-2' },
                                        React.createElement("div", { className: 'w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center' },
                                            React.createElement("span", { className: 'text-xs' }, "\uD83D\uDCCA")),
                                        React.createElement("span", { className: 'text-sm text-red-200' },
                                            "\u5171 ",
                                            didian_list?.length || 0,
                                            " \u4E2A\u7981\u5730")),
                                    React.createElement("div", { className: 'flex items-center gap-2' },
                                        React.createElement("div", { className: 'w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center' },
                                            React.createElement("span", { className: 'text-xs' }, "\uD83D\uDC80")),
                                        React.createElement("span", { className: 'text-sm text-yellow-200' },
                                            "\u6700\u9AD8\u5371\u9669\u7B49\u7EA7\uFF1A",
                                            didian_list?.length || 0))))))),
                React.createElement("div", { className: 'text-center mt-12' },
                    React.createElement("div", { className: 'inline-block px-6 py-3 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-full border border-red-400/30 backdrop-blur-sm' },
                        React.createElement("span", { className: 'text-red-200 text-sm' }, "\u26A0\uFE0F \u7981\u5730\u6DF1\u5904\u85CF\u6740\u673A\uFF0C\u4FEE\u4ED9\u8DEF\u4E0A\u9700\u8C28\u614E \u26A0\uFE0F")))))));
};

export { SecretPlace as default };
