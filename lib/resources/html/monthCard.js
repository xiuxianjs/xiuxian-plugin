import React from 'react';
import HTML from './HTML.js';
import { Avatar } from './Avatar.js';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/user_state2.png.js';

const features = [
    {
        title: '自定义快捷键',
        icon: '⚡',
        desc: '个性化操作体验'
    },
    {
        title: '支持打工本沉迷',
        icon: '💼',
        desc: '提升修炼效率'
    },
    {
        title: '签到奖励增加',
        icon: '💰',
        desc: '闪闪发光的石头-1，秘境之匙-10'
    },
    {
        title: '周签到奖励',
        icon: '🎁',
        desc: '修为丹-n，仙府通行证，道具盲盒'
    }
];
const Monthcard = ({ isMonth, avatar, isNewbie }) => {
    return (React.createElement(HTML, { className: 'p-0 m-0 w-full text-center', dangerouslySetInnerHTML: {
            __html: `
          body {
            background-image: url(${fileUrl});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
        `
        } },
        React.createElement("div", { className: 'h-3' }),
        React.createElement("div", { className: 'm-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-gradient-to-br from-white/60 via-blue-50/50 to-cyan-50/55 backdrop-blur-sm border border-blue-200/30 shadow-xl w-[780px] pb-4' },
            React.createElement("div", { className: 'm-4 w-[780px]' },
                React.createElement("div", { className: 'flex items-center justify-center mb-6' },
                    React.createElement("div", { className: 'text-center' },
                        React.createElement("div", { className: 'flex justify-center mb-4' },
                            React.createElement(Avatar, { src: avatar, stateSrc: fileUrl$1, rootClassName: 'w-32 h-32', className: 'w-24 h-24' })),
                        React.createElement("div", { className: 'flex items-center gap-3 mb-3' },
                            React.createElement("div", { className: 'w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg' },
                                React.createElement("span", { className: 'text-white text-sm' }, "\u2B50")),
                            React.createElement("h2", { className: 'text-2xl font-bold text-blue-800 drop-shadow-sm' }, "\u6708\u5361\u6743\u76CA")))),
                React.createElement("div", { className: 'space-y-4' },
                    React.createElement("div", { className: 'flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-500/10 via-cyan-500/8 to-blue-600/10 backdrop-blur-sm rounded-lg border border-blue-200/30 shadow-lg' },
                        React.createElement("div", { className: 'flex items-center gap-3' },
                            React.createElement("div", { className: 'w-6 h-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-200/30' },
                                React.createElement("span", { className: 'text-blue-600 text-sm' }, "\uD83C\uDFAF")),
                            React.createElement("h3", { className: 'text-xl font-bold text-blue-800 drop-shadow-sm' }, "\u4E13\u5C5E\u529F\u80FD")),
                        isMonth ? (React.createElement("div", { className: 'inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full shadow-lg' },
                            React.createElement("span", { className: 'text-emerald-600 text-sm mr-1' }, "\u2705"),
                            React.createElement("span", { className: 'text-emerald-700 font-semibold text-sm' }, "\u5DF2\u5F00\u901A"))) : (React.createElement("div", { className: 'inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full shadow-lg' },
                            React.createElement("span", { className: 'text-blue-600 text-sm mr-1' }, "\uD83D\uDD12"),
                            React.createElement("span", { className: 'text-blue-700 font-semibold text-sm' }, "\u672A\u5F00\u901A")))),
                    React.createElement("div", { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                        features.map((feature, index) => (React.createElement("div", { key: index, className: 'bg-gradient-to-br from-white/80 via-blue-50/70 to-cyan-50/75 backdrop-blur-xl rounded-xl p-4 border border-blue-200/40 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300' },
                            React.createElement("div", { className: 'absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-xl' }),
                            React.createElement("div", { className: 'absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-cyan-400/4 to-blue-400/4 rounded-full blur-lg' }),
                            React.createElement("div", { className: 'relative z-10 space-y-3' },
                                React.createElement("div", { className: 'flex items-center gap-3' },
                                    React.createElement("div", { className: 'w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg' },
                                        React.createElement("span", { className: 'text-white text-lg' }, feature.icon)),
                                    React.createElement("div", { className: 'flex-1' },
                                        React.createElement("h4", { className: 'text-base font-bold text-blue-800 drop-shadow-sm' }, feature.title),
                                        React.createElement("p", { className: 'text-sm text-blue-600 mt-1' }, feature.desc))),
                                React.createElement("div", { className: 'relative' }, isMonth ? (React.createElement("div", { className: 'flex items-center justify-between' },
                                    React.createElement("span", { className: 'px-3 py-1 rounded-full text-sm font-medium shadow-lg bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-700 border border-emerald-400/25' }, "\u5DF2\u89E3\u9501"),
                                    React.createElement("div", { className: 'flex items-center gap-1' },
                                        React.createElement("div", { className: 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse' }),
                                        React.createElement("span", { className: 'text-xs text-emerald-600 font-medium' }, "\u6FC0\u6D3B\u4E2D")))) : (React.createElement("div", { className: 'relative' },
                                    React.createElement("div", { className: 'flex items-center justify-between' },
                                        React.createElement("div", null),
                                        React.createElement("div", { className: 'flex items-center gap-1' },
                                            React.createElement("div", { className: 'w-2 h-2 bg-blue-400 rounded-full animate-pulse' }),
                                            React.createElement("span", { className: 'text-xs text-blue-600 font-medium' }, "\u672A\u6FC0\u6D3B")))))))))),
                        isNewbie ? (React.createElement("div", { className: 'bg-gradient-to-br from-white/80 via-blue-50/70 to-cyan-50/75 backdrop-blur-xl rounded-xl p-4 border border-blue-200/40 shadow-xl relative overflow-hidden hover:shadow-2xl transition-all duration-300' },
                            React.createElement("div", { className: 'absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/8 to-cyan-400/8 rounded-full blur-xl' }),
                            React.createElement("div", { className: 'absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-cyan-400/4 to-blue-400/4 rounded-full blur-lg' }),
                            React.createElement("div", { className: 'relative z-10 space-y-3' },
                                React.createElement("div", { className: 'flex items-center gap-3' },
                                    React.createElement("div", { className: 'w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg' },
                                        React.createElement("span", { className: 'text-white text-lg' }, "\uD83D\uDCB4")),
                                    React.createElement("div", { className: 'flex-1' },
                                        React.createElement("h4", { className: 'text-base font-bold text-blue-800 drop-shadow-sm' }, "\u53CC\u500D\u65B0\u624B\u798F\u5229"),
                                        React.createElement("p", { className: 'text-sm text-blue-600 mt-1' }, "\u65B0\u624B\u793C\u5305\u5956\u52B1\u7FFB\u500D"))),
                                React.createElement("div", { className: 'relative' }, isMonth ? (React.createElement("div", { className: 'flex items-center justify-between' },
                                    React.createElement("span", { className: 'px-3 py-1 rounded-full text-sm font-medium shadow-lg bg-gradient-to-r from-emerald-500/15 to-green-500/15 text-emerald-700 border border-emerald-400/25' }, "\u5DF2\u89E3\u9501"),
                                    React.createElement("div", { className: 'flex items-center gap-1' },
                                        React.createElement("div", { className: 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse' }),
                                        React.createElement("span", { className: 'text-xs text-emerald-600 font-medium' }, "\u6FC0\u6D3B\u4E2D")))) : (React.createElement("div", { className: 'relative' },
                                    React.createElement("div", { className: 'flex items-center justify-between' },
                                        React.createElement("div", null),
                                        React.createElement("div", { className: 'flex items-center gap-1' },
                                            React.createElement("div", { className: 'w-2 h-2 bg-blue-400 rounded-full animate-pulse' }),
                                            React.createElement("span", { className: 'text-xs text-blue-600 font-medium' }, "\u672A\u6FC0\u6D3B"))))))))) : (''))),
                React.createElement("div", { className: 'mt-6 text-center' },
                    React.createElement("div", { className: 'inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-600/5 backdrop-blur-sm rounded-full border border-blue-300/30 shadow-lg' },
                        React.createElement("span", { className: 'text-blue-600 text-lg' }, "\uD83D\uDC8E"),
                        React.createElement("span", { className: 'text-blue-800 font-semibold' }, "\u6708\u5361\u7279\u6743"),
                        React.createElement("span", { className: 'text-blue-700 text-sm' }, "\u00B7"),
                        React.createElement("span", { className: 'text-blue-700 text-sm' }, isMonth ? '享受专属权益，修炼之路更加顺畅！' : '解锁更多修仙法则！'))))),
        React.createElement("div", { className: 'h-3' })));
};

export { Monthcard as default };
