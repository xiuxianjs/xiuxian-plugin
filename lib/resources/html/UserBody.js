import React from 'react';
import HTML from './HTML.js';
import { Avatar } from './Avatar.js';
import { getAvatar } from '../../model/utils/utilsx.js';
import fileUrl from '../img/player.jpg.js';
import fileUrl$1 from '../img/player_footer.png.js';
import { BackgroundImage } from 'jsxp';
import classNames from 'classnames';

const GONGFA_COLORS = {
    blue: {
        from: 'from-blue-400/90',
        via: 'via-blue-300/90',
        to: 'to-blue-500/90',
        border: 'border-blue-300/60',
        text: 'text-blue-900',
        bg: 'bg-blue-500/20',
        icon: 'text-blue-500'
    },
    purple: {
        from: 'from-purple-400/90',
        via: 'via-purple-300/90',
        to: 'to-purple-500/90',
        border: 'border-purple-300/60',
        text: 'text-purple-900',
        bg: 'bg-purple-500/20',
        icon: 'text-purple-500'
    },
    red: {
        from: 'from-red-400/90',
        via: 'via-red-300/90',
        to: 'to-red-500/90',
        border: 'border-red-300/60',
        text: 'text-red-900',
        bg: 'bg-red-500/20',
        icon: 'text-red-500'
    },
    orange: {
        from: 'from-orange-400/90',
        via: 'via-orange-300/90',
        to: 'to-orange-500/90',
        border: 'border-orange-300/60',
        text: 'text-orange-900',
        bg: 'bg-orange-500/20',
        icon: 'text-orange-500'
    },
    gold: {
        from: 'from-yellow-400/90',
        via: 'via-yellow-300/90',
        to: 'to-yellow-500/90',
        border: 'border-yellow-300/60',
        text: 'text-yellow-900',
        bg: 'bg-yellow-500/20',
        icon: 'text-yellow-500'
    }
};
const getGongfaColor = (efficiency) => {
    if (efficiency >= 0.51) {
        return GONGFA_COLORS.gold;
    }
    if (efficiency >= 0.26) {
        return GONGFA_COLORS.orange;
    }
    if (efficiency >= 0.16) {
        return GONGFA_COLORS.red;
    }
    if (efficiency >= 0.07) {
        return GONGFA_COLORS.purple;
    }
    return GONGFA_COLORS.blue;
};
const UserBody = ({ user_id, nickname, player_nowHP, player_maxHP, levelId, levelMax, xueqi, need_xueqi, physiqueId, lingshi, association, gongfa }) => {
    return (React.createElement(HTML, null,
        React.createElement(BackgroundImage, { className: 'bg-cover p-0 m-0 w-full text-center', src: [fileUrl, fileUrl$1], style: {
                backgroundRepeat: 'no-repeat, repeat',
                backgroundSize: '100%, auto'
            } },
            React.createElement("div", { className: 'h-3' }),
            React.createElement("div", null,
                React.createElement("div", { className: 'm-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px] pb-4' },
                    React.createElement("div", { className: 'text-center mt-5 ml-4 w-80' },
                        React.createElement("div", { className: 'flex justify-center' },
                            React.createElement(Avatar, { src: getAvatar(user_id), rootClassName: 'w-64 h-64', className: 'w-44 h-44' })),
                        React.createElement("div", { className: 'mt-3 mx-2 relative' },
                            React.createElement("div", { className: 'bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl px-3 py-2 shadow-xl border-2 border-amber-300 backdrop-blur-sm' },
                                React.createElement("div", { className: 'flex items-center gap-2' },
                                    React.createElement("div", { className: 'w-6 h-6 bg-white/20 rounded-full flex items-center justify-center' },
                                        React.createElement("span", { className: 'text-white text-sm' }, "\uD83C\uDFEE")),
                                    React.createElement("div", { className: 'text-center' },
                                        React.createElement("div", { className: 'text-white text-xs font-semibold opacity-90 drop-shadow-sm' }, "\u9053\u53F7"),
                                        React.createElement("div", { className: 'text-white text-lg font-bold drop-shadow-lg' }, nickname))),
                                React.createElement("div", { className: 'absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-60 animate-pulse' }),
                                React.createElement("div", { className: 'absolute -bottom-1 -left-1 w-2 h-2 bg-orange-300 rounded-full opacity-40' })))),
                    React.createElement("div", { className: 'float-right text-left mr-4 mt-4 rounded-3xl flex-1 text-slate-600' },
                        React.createElement("div", { className: 'space-y-2' },
                            React.createElement("div", { className: 'flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20' },
                                React.createElement("span", { className: 'text-base' }, "\uD83D\uDCAC"),
                                React.createElement("span", { className: 'text-base font-semibold text-gray-900 drop-shadow-sm' },
                                    "\u8D26\u53F7\uFF1A",
                                    user_id)),
                            React.createElement("div", { className: 'flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20' },
                                React.createElement("span", { className: 'text-base' }, "\u2694\uFE0F"),
                                React.createElement("span", { className: 'text-base font-semibold text-gray-900 drop-shadow-sm' },
                                    "\u4F53\u5883\uFF1A",
                                    levelMax)),
                            React.createElement("div", { className: 'bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20' },
                                React.createElement("div", { className: 'flex items-center gap-2 mb-2' },
                                    React.createElement("span", { className: 'text-base' }, "\u2764\uFE0F"),
                                    React.createElement("span", { className: 'text-base font-semibold text-gray-900 drop-shadow-sm' }, "\u751F\u547D")),
                                React.createElement("div", { className: 'relative w-64 text-white h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg shadow-lg overflow-hidden border border-gray-600/50' },
                                    React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' }),
                                    React.createElement("div", { className: 'h-full bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden', style: { width: `${(player_nowHP / player_maxHP) * 100}%` } },
                                        React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' }),
                                        React.createElement("div", { className: 'absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' }),
                                        React.createElement("div", { className: 'absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' })),
                                    React.createElement("div", { className: 'absolute inset-0 flex items-center justify-center' },
                                        React.createElement("span", { className: 'font-bold text-sm drop-shadow-lg' },
                                            player_nowHP?.toFixed(0),
                                            "/",
                                            player_maxHP?.toFixed(0))))),
                            React.createElement("div", { className: 'flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20' },
                                React.createElement("span", { className: 'text-base' }, "\uD83D\uDCB0"),
                                React.createElement("span", { className: 'text-base font-semibold text-gray-900 drop-shadow-sm' },
                                    "\u7075\u77F3\uFF1A",
                                    lingshi)),
                            React.createElement("div", { className: 'flex items-center gap-2 bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-2 border border-white/20' },
                                React.createElement("span", { className: 'text-base' }, "\uD83C\uDFDB\uFE0F"),
                                React.createElement("span", { className: 'text-base font-semibold text-gray-900 drop-shadow-sm' },
                                    "\u5B97\u95E8\uFF1A\u3010",
                                    association?.宗门名称 || '无',
                                    "\u3011",
                                    association?.宗门名称 !== '无' && `[${association?.职位}]`))))),
                React.createElement("div", { className: 'm-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]' },
                    React.createElement("div", { className: 'm-4 w-[780px]' },
                        React.createElement("div", { className: 'flex items-center gap-3 mb-3' },
                            React.createElement("div", { className: 'w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center' },
                                React.createElement("span", { className: 'text-sm' }, "\uD83D\uDCCA")),
                            React.createElement("h2", { className: 'text-xl font-bold text-gray-900 drop-shadow-sm' }, "\u3010\u57FA\u7840\u4FE1\u606F\u3011")),
                        React.createElement("div", { className: 'space-y-3' },
                            React.createElement("div", { className: 'grid grid-cols-1 md:grid-cols-2 gap-3' },
                                React.createElement("div", { className: 'bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg relative overflow-hidden' },
                                    React.createElement("div", { className: 'absolute top-0 right-0 w-12 h-12 bg-blue-400/10 rounded-full blur-lg' }),
                                    React.createElement("div", { className: 'absolute bottom-0 left-0 w-8 h-8 bg-blue-400/5 rounded-full blur-md' }),
                                    React.createElement("div", { className: 'space-y-2 relative z-10' },
                                        React.createElement("div", { className: 'flex items-center justify-between' },
                                            React.createElement("span", { className: 'text-sm font-semibold text-gray-800 flex items-center gap-1.5' },
                                                React.createElement("span", { className: 'w-3 h-3 bg-blue-500/20 rounded-full flex items-center justify-center' },
                                                    React.createElement("span", { className: 'text-blue-500 text-xs' }, "\uD83D\uDC99")),
                                                React.createElement("span", { className: 'text-base font-bold text-gray-900' }, "\u6C14\u8840"))),
                                        React.createElement("div", { className: 'relative w-full h-8 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg overflow-hidden border border-gray-600/50 shadow-inner' },
                                            React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent' }),
                                            React.createElement("div", { className: 'h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-lg transition-all duration-300 ease-out shadow-lg relative overflow-hidden', style: { width: `${(xueqi / need_xueqi) * 100}%` } },
                                                React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent' }),
                                                React.createElement("div", { className: 'absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent' }),
                                                React.createElement("div", { className: 'absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-black/20 to-transparent' })),
                                            React.createElement("div", { className: 'absolute inset-0 flex items-center justify-center' },
                                                React.createElement("span", { className: 'text-white font-bold text-base drop-shadow-lg' },
                                                    ((xueqi / need_xueqi) * 100).toFixed(0),
                                                    "%"))),
                                        React.createElement("div", { className: 'text-center text-base font-semibold text-gray-800' },
                                            xueqi,
                                            "/",
                                            need_xueqi))),
                                React.createElement("div", { className: 'bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg' },
                                    React.createElement("div", { className: 'space-y-2' },
                                        React.createElement("div", { className: 'flex items-center justify-between' },
                                            React.createElement("span", { className: 'text-base font-semibold text-gray-800' }, "\u5F53\u524D\u7B49\u7EA7"),
                                            React.createElement("span", { className: 'font-bold text-gray-900 text-lg' }, levelId)),
                                        React.createElement("div", { className: 'flex items-center justify-between' },
                                            React.createElement("span", { className: 'text-base font-semibold text-gray-800' }, "\u7B49\u7EA7\u4E0A\u9650"),
                                            React.createElement("span", { className: 'font-bold text-gray-900 text-lg' }, levelMax)))))))),
                React.createElement("div", { className: 'm-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-[radial-gradient(at_top_left,#ffffff10,#d7edea10)] border-t border-[#ffcc80] border-l border-[#ffcc80] border-r border-[#bb8020] border-b border-[#bb8020] backdrop-blur-sm w-[780px]' },
                    React.createElement("div", { className: 'm-4 w-[780px]' },
                        React.createElement("div", { className: 'flex items-center gap-3 mb-3' },
                            React.createElement("div", { className: 'w-6 h-6 bg-white/40 backdrop-blur-sm rounded-lg flex items-center justify-center' },
                                React.createElement("span", { className: 'text-sm' }, "\uD83D\uDCDA")),
                            React.createElement("h2", { className: 'text-xl font-bold text-gray-900 drop-shadow-sm' },
                                "\u5DF2\u5B66\u529F\u6CD5 (",
                                gongfa?.length ?? 0,
                                "/",
                                levelId + physiqueId,
                                ")")),
                        React.createElement("div", { className: 'bg-[hsla(42,71%,91%,.502)] backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg' }, !gongfa || gongfa.length === 0 ? (React.createElement("div", { className: 'flex items-center justify-center gap-3 py-6' },
                            React.createElement("span", { className: 'text-xl' }, "\uD83D\uDCD6"),
                            React.createElement("span", { className: 'text-lg font-bold text-gray-700 tracking-wide opacity-70' }, "\u6682\u65E0\u529F\u6CD5"),
                            React.createElement("span", { className: 'text-xl' }, "\uD83D\uDCD6"))) : (React.createElement("div", { className: 'grid grid-cols-3 gap-3' }, gongfa.map((gongfaInfo, index) => {
                            const efficiency = gongfaInfo?.修炼加成 || 0;
                            const colorConfig = getGongfaColor(efficiency);
                            return (React.createElement("div", { key: index, className: classNames('rounded-lg shadow-lg font-bold border text-sm tracking-wide relative overflow-hidden p-2 hover:scale-105 transition-transform duration-200', colorConfig.bg, colorConfig.text, colorConfig.border) },
                                React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-r from-white/20 to-transparent' }),
                                React.createElement("div", { className: 'relative z-10' },
                                    React.createElement("div", { className: 'flex items-center justify-between mb-1' },
                                        React.createElement("span", { className: 'font-bold truncate' },
                                            "\u300A",
                                            gongfaInfo.name,
                                            "\u300B"),
                                        React.createElement("span", { className: `text-xs ${colorConfig.icon} font-bold ml-1` },
                                            (efficiency * 100).toFixed(0),
                                            "%")),
                                    gongfaInfo && (React.createElement("div", { className: 'text-xs opacity-80' },
                                        React.createElement("div", { className: 'truncate' },
                                            "\u7C7B\u578B\uFF1A",
                                            gongfaInfo.type),
                                        React.createElement("div", null,
                                            "\u52A0\u6210\uFF1A+",
                                            (efficiency * 100).toFixed(1),
                                            "%"))))));
                        }))))))),
            React.createElement("div", { className: 'h-3' }))));
};

export { UserBody as default };
