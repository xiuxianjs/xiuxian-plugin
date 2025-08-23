import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/player.jpg.js';
import fileUrl$1 from '../img/player_footer.png.js';
import { getAvatar } from '../../model/utils/utilsx.js';
import { Avatar } from './Avatar.js';

const Danyao = ({ user_id, danyao_have = [], danyao2_have = [], danyao_need = [] }) => {
    const renderEffect = (item) => {
        const effects = [];
        if (item.HP)
            effects.push(item.HP);
        if (item.exp)
            effects.push(item.exp);
        if (item.xueqi)
            effects.push(item.xueqi);
        if (item.xingyun > 0)
            effects.push(`${(item.xingyun * 100).toFixed(1)}%`);
        return effects.join('');
    };
    return (React.createElement(HTML, { className: "w-full text-center p-4 md:p-8 bg-top bg-no-repeat min-h-screen", style: {
            backgroundImage: `url(${fileUrl}), url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100%, auto'
        } },
        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-b from-emerald-900/50 via-emerald-700/30 to-red-900/50 pointer-events-none" }),
        React.createElement("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" }),
        React.createElement("main", { className: "relative max-w-5xl mx-auto space-y-12 z-10" },
            React.createElement("header", { className: "space-y-6 flex flex-col items-center" },
                React.createElement("div", { className: "relative" },
                    React.createElement(Avatar, { src: getAvatar(user_id) }))),
            (danyao_have.length > 0 || danyao2_have.length > 0) && (React.createElement("section", { className: "relative" },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-emerald-800/10 rounded-3xl blur-2xl" }),
                React.createElement("div", { className: "relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-emerald-400/30 p-6 md:p-8 shadow-2xl space-y-6 border border-emerald-300/20" },
                    React.createElement("div", { className: "flex items-center justify-center space-x-3 mb-6" },
                        React.createElement("div", { className: "w-8 h-8 bg-emerald-400/30 rounded-full flex items-center justify-center" },
                            React.createElement("span", { className: "text-emerald-300 text-lg" }, "\uD83D\uDC8A")),
                        React.createElement("h2", { className: "text-xl md:text-2xl font-bold tracking-wider text-emerald-200 drop-shadow-lg" }, "\u3010\u5DF2\u62E5\u6709\u3011"),
                        React.createElement("div", { className: "w-8 h-8 bg-emerald-400/30 rounded-full flex items-center justify-center" },
                            React.createElement("span", { className: "text-emerald-300 text-lg" }, "\uD83D\uDC8A"))),
                    React.createElement("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, [...danyao_have, ...danyao2_have].map((item, index) => (React.createElement("article", { key: index, className: "relative rounded-2xl bg-gradient-to-br from-emerald-900/40 to-emerald-700/30 p-5 shadow-xl border border-emerald-400/30 backdrop-blur-md" },
                        React.createElement("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-t-2xl" }),
                        React.createElement("div", { className: "absolute top-2 right-2 w-3 h-3 bg-emerald-400/50 rounded-full" }),
                        React.createElement("div", { className: "space-y-3" },
                            React.createElement("div", { className: "flex items-center space-x-2" },
                                React.createElement("span", { className: "text-emerald-300 text-lg" }, "\uD83E\uDDEA"),
                                React.createElement("h3", { className: "text-lg font-bold tracking-wide text-emerald-100 drop-shadow" }, item.name)),
                            React.createElement("div", { className: "space-y-2 text-sm" },
                                React.createElement("div", { className: "flex items-center space-x-2 text-white/90" },
                                    React.createElement("span", { className: "text-emerald-300" }, "\uD83D\uDCCB"),
                                    React.createElement("span", null, "\u7C7B\u578B\uFF1A"),
                                    React.createElement("span", { className: "font-semibold text-emerald-200" }, item.type)),
                                React.createElement("div", { className: "flex items-start space-x-2 text-white/90" },
                                    React.createElement("span", { className: "text-emerald-300 mt-0.5" }, "\u26A1"),
                                    React.createElement("span", null, "\u6548\u679C\uFF1A"),
                                    React.createElement("span", { className: "font-semibold text-emerald-200" }, renderEffect(item))),
                                React.createElement("div", { className: "flex items-center space-x-2 text-white/90" },
                                    React.createElement("span", { className: "text-amber-300" }, "\uD83D\uDCB0"),
                                    React.createElement("span", null, "\u4EF7\u683C\uFF1A"),
                                    React.createElement("span", { className: "font-bold text-amber-300 text-lg" }, item.出售价.toFixed(0)))))))))))),
            danyao_need.length > 0 && (React.createElement("section", { className: "relative" },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-red-600/10 to-red-800/10 rounded-3xl blur-2xl" }),
                React.createElement("div", { className: "relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-red-400/30 p-6 md:p-8 shadow-2xl space-y-6 border border-red-300/20" },
                    React.createElement("div", { className: "flex items-center justify-center space-x-3 mb-6" },
                        React.createElement("div", { className: "w-8 h-8 bg-red-400/30 rounded-full flex items-center justify-center" },
                            React.createElement("span", { className: "text-red-300 text-lg" }, "\u274C")),
                        React.createElement("h2", { className: "text-xl md:text-2xl font-bold tracking-wider text-red-200 drop-shadow-lg" }, "\u3010\u672A\u62E5\u6709\u3011"),
                        React.createElement("div", { className: "w-8 h-8 bg-red-400/30 rounded-full flex items-center justify-center" },
                            React.createElement("span", { className: "text-red-300 text-lg" }, "\u274C"))),
                    React.createElement("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, danyao_need.map((item, index) => (React.createElement("article", { key: index, className: "relative rounded-2xl bg-gradient-to-br from-red-900/40 to-red-700/30 p-5 shadow-xl border border-red-400/30 backdrop-blur-md" },
                        React.createElement("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-red-300 rounded-t-2xl" }),
                        React.createElement("div", { className: "absolute top-2 right-2 w-3 h-3 bg-red-400/50 rounded-full" }),
                        React.createElement("div", { className: "space-y-3" },
                            React.createElement("div", { className: "flex items-center space-x-2" },
                                React.createElement("span", { className: "text-red-300 text-lg" }, "\uD83E\uDDEA"),
                                React.createElement("h3", { className: "text-lg font-bold tracking-wide text-red-100 drop-shadow" }, item.name)),
                            React.createElement("div", { className: "space-y-2 text-sm" },
                                React.createElement("div", { className: "flex items-center space-x-2 text-white/90" },
                                    React.createElement("span", { className: "text-red-300" }, "\uD83D\uDCCB"),
                                    React.createElement("span", null, "\u7C7B\u578B\uFF1A"),
                                    React.createElement("span", { className: "font-semibold text-red-200" }, item.type)),
                                React.createElement("div", { className: "flex items-start space-x-2 text-white/90" },
                                    React.createElement("span", { className: "text-red-300 mt-0.5" }, "\u26A1"),
                                    React.createElement("span", null, "\u6548\u679C\uFF1A"),
                                    React.createElement("span", { className: "font-semibold text-red-200" }, renderEffect(item))),
                                React.createElement("div", { className: "flex items-center space-x-2 text-white/90" },
                                    React.createElement("span", { className: "text-amber-300" }, "\uD83D\uDCB0"),
                                    React.createElement("span", null, "\u4EF7\u683C\uFF1A"),
                                    React.createElement("span", { className: "font-bold text-amber-300 text-lg" }, item.出售价.toFixed(0)))))))))))),
            React.createElement("div", { className: "flex justify-center space-x-4 pt-8" },
                React.createElement("div", { className: "w-16 h-1 bg-gradient-to-r from-emerald-400/50 to-transparent rounded-full" }),
                React.createElement("div", { className: "w-8 h-8 bg-gradient-to-br from-emerald-400/30 to-red-400/30 rounded-full flex items-center justify-center" },
                    React.createElement("span", { className: "text-white/70 text-sm" }, "\uD83D\uDD25")),
                React.createElement("div", { className: "w-16 h-1 bg-gradient-to-l from-red-400/50 to-transparent rounded-full" })))));
};

export { Danyao as default };
