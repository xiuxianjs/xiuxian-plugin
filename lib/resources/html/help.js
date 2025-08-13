import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../styles/help.scss.js';
import fileUrl$1 from '../img/xiuxian.jpg.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../../../package.json');
const CommandIcons = {
    修仙: '🧘',
    战斗: '⚔️',
    装备: '🗡️',
    丹药: '💊',
    宗门: '🏛️',
    交易: '💰',
    任务: '📜',
    其他: '✨'
};
const getCommandIcon = (title) => {
    for (const [key, icon] of Object.entries(CommandIcons)) {
        if (title.includes(key))
            return icon;
    }
    return '✨';
};
const Help = ({ helpData = [], page = 1, pageSize, total }) => {
    return (React.createElement(HTML, { className: "elem-default default-mode text-[18px] text-brand font-sans ", style: {
            backgroundImage: `url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top left',
            backgroundSize: '100% 100%',
            fontFamily: 'PingFangSC-Medium, PingFang SC, sans-serif'
        }, linkStyleSheets: [fileUrl] },
        React.createElement("div", { className: "absolute inset-0 pointer-events-none" },
            React.createElement("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:25px_25px]" }),
            React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/3 to-transparent" }),
            React.createElement("div", { className: "absolute top-16 left-16 text-cyan-400/15 text-3xl" }, "\u262F"),
            React.createElement("div", { className: "absolute top-32 right-24 text-purple-400/15 text-2xl" }, "\u26A1"),
            React.createElement("div", { className: "absolute bottom-32 left-20 text-yellow-400/15 text-2xl" }, "\uD83C\uDF1F"),
            React.createElement("div", { className: "absolute bottom-16 right-16 text-pink-400/15 text-3xl" }, "\uD83D\uDCAB")),
        React.createElement("div", { className: "relative z-10 max-w-[1000px] mx-auto px-6 py-10", id: "container" },
            React.createElement("header", { className: "mb-8" },
                React.createElement("div", { className: "relative" },
                    React.createElement("div", { className: "absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[3px]" },
                        React.createElement("div", { className: "absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent" })),
                    React.createElement("div", { className: "relative rounded-3xl p-6 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-xl border border-white/20 shadow-2xl" },
                        React.createElement("div", { className: "absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" }),
                        React.createElement("div", { className: "absolute top-4 right-4 w-8 h-8 border-2 border-cyan-400/50 rounded-full" }),
                        React.createElement("div", { className: "text-center" },
                            React.createElement("h1", { className: "text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-2xl mb-2" }, pkg.name),
                            React.createElement("div", { className: "w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full shadow-lg mb-3" }),
                            React.createElement("span", { className: "inline-block px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-200 font-bold shadow-lg" },
                                "v",
                                pkg.version))))),
            React.createElement("main", { className: "space-y-8" }, helpData.map((val, index) => (React.createElement("section", { key: index, className: "relative" },
                React.createElement("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 p-[2px]" }),
                React.createElement("div", { className: "relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-xl overflow-hidden" },
                    React.createElement("div", { className: "absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-teal-400/50 rounded-tr-lg" }),
                    React.createElement("div", { className: "absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-teal-400/50 rounded-bl-lg" }),
                    React.createElement("h2", { className: "flex items-center justify-between pr-6 text-xl font-bold tracking-wide text-teal-100 bg-gradient-to-r from-black/40 to-black/60 px-4 py-3 border-b border-white/10" },
                        React.createElement("span", { className: "flex items-center gap-3" },
                            React.createElement("span", { className: "w-2 h-6 bg-gradient-to-b from-teal-300 to-teal-600 rounded-sm shadow-lg" }),
                            React.createElement("span", { className: "text-2xl mr-2" }, "\uD83D\uDCDA"),
                            val.group),
                        Array.isArray(val.list) && val.list.length > 0 && (React.createElement("span", { className: "px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-400/30 text-teal-200 text-sm font-medium shadow-inner" },
                            val.list.length,
                            " \u6761"))),
                    React.createElement("div", { className: "p-4" },
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, val.list?.map((item, itemIndex) => (React.createElement("div", { key: itemIndex, className: "relative p-4 rounded-xl bg-gradient-to-br from-black/20 to-black/30 border border-white/10" },
                            React.createElement("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-teal-500/5 to-transparent" }),
                            React.createElement("div", { className: "relative flex items-start gap-3" },
                                React.createElement("div", { className: "flex-shrink-0" },
                                    React.createElement("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-400/30 flex items-center justify-center shadow-lg" },
                                        React.createElement("span", { className: "text-2xl" }, getCommandIcon(item.title)))),
                                React.createElement("div", { className: "flex-1 min-w-0" },
                                    React.createElement("strong", { className: "block font-bold text-teal-200 mb-1" }, item.title),
                                    React.createElement("span", { className: "block text-sm leading-relaxed text-white/70" }, item.desc))))))))))))),
            React.createElement("footer", { className: "mt-8" },
                React.createElement("div", { className: "relative" },
                    React.createElement("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 p-[2px]" }),
                    React.createElement("div", { className: "relative rounded-2xl p-6 bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-xl border border-white/20 shadow-xl" },
                        React.createElement("div", { className: "absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full" }),
                        React.createElement("div", { className: "absolute top-4 right-4 w-6 h-6 border-2 border-red-400/50 rounded-full" }),
                        React.createElement("div", { className: "text-center" },
                            React.createElement("div", { className: "inline-flex items-center gap-3 bg-gradient-to-r from-red-500/20 to-yellow-500/20 px-6 py-3 rounded-2xl shadow-inner border border-red-400/30 backdrop-blur-sm" },
                                React.createElement("span", { className: "text-white/70 text-sm md:text-base font-medium" }, "\u7B2C"),
                                React.createElement("b", { className: "text-3xl md:text-4xl text-red-300 drop-shadow-lg font-black" }, page),
                                typeof total === 'number' && total > 0 ? (React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "text-white/50 text-lg md:text-xl" }, "/"),
                                    React.createElement("b", { className: "text-2xl md:text-3xl text-red-300 font-black" }, total),
                                    React.createElement("span", { className: "text-white/70 text-sm md:text-base font-medium" }, "\u9875"))) : (React.createElement("span", { className: "text-white/70 text-sm md:text-base font-medium" }, "\u9875")),
                                typeof pageSize !== 'undefined' && pageSize ? (React.createElement("span", { className: "ml-3 text-xs md:text-sm text-red-200/80 font-normal" },
                                    "\uFF08\u6BCF\u9875 ",
                                    pageSize,
                                    " \u7EC4\uFF09")) : null),
                            React.createElement("div", { className: "mt-6" },
                                React.createElement("div", { className: "inline-flex items-center shadow-inner gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600/30 to-red-700/30 border border-red-400/20 " },
                                    React.createElement("span", { className: "text-red-200/90  text-sm md:text-base font-medium" }, "\u7FFB\u9875\uFF1A \u6307\u4EE4\u540E\u76F4\u63A5\u52A0\u9875\u7801"))))))))));
};

export { Help as default };
