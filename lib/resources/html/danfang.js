import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';

const Danfang = ({ danfang_list }) => {
    const renderItemInfo = (item) => {
        if (item.type === '修为' || item.type === '血气') {
            return item.exp2 ?? (item.exp ? item.exp.join(' / ') : '');
        }
        if (item.exp) {
            return item.exp.join(' / ');
        }
        return '';
    };
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover relative", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent backdrop-blur-sm pointer-events-none" }),
        React.createElement("main", { className: "relative max-w-6xl mx-auto space-y-10" },
            React.createElement("header", { className: "space-y-3" },
                React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-white/30 backdrop-blur-md \n            text-2xl md:text-3xl font-bold tracking-widest shadow-lg border border-white/40\n            text-blue-900 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" }, "\u4E39\u65B9"),
                React.createElement("p", { className: "text-blue-900/80 text-sm md:text-base font-medium" }, "\u70BC\u5236\u6307\u4EE4\uFF1A#\u70BC\u5236+\u4E39\u836F\u540D"),
                React.createElement("p", { className: "text-blue-900/70 text-xs md:text-sm" }, "\u70BC\u5236\u6210\u529F\u7387 = \u4E39\u65B9\u6210\u529F\u7387 + \u73A9\u5BB6\u804C\u4E1A\u7B49\u7EA7\u6210\u529F\u7387")),
            React.createElement("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, danfang_list?.map((item, index) => {
                const ratePercent = Math.floor(item.rate * 100);
                return (React.createElement("article", { key: index, className: "group rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 \n                shadow-lg p-4 flex flex-col gap-3 transition-transform transform hover:scale-[1.02] hover:shadow-xl hover:border-blue-200" },
                    React.createElement("header", { className: "space-y-1" },
                        React.createElement("h2", { className: "text-lg font-semibold tracking-wide text-blue-900" },
                            item.type ? (React.createElement("span", { className: "" },
                                "\u3010",
                                item.type,
                                "\u3011")) : null,
                            item.name),
                        React.createElement("div", { className: "flex items-center gap-3 text-sm text-blue-900/80" },
                            React.createElement("span", { className: "px-2 py-0.5 rounded-full bg-blue-500/20 font-medium shadow-sm border border-blue-300/50" },
                                ratePercent,
                                "%"),
                            React.createElement("span", { className: "px-2 py-0.5 rounded-full bg-blue-200/40 font-medium shadow-sm border border-blue-300/50" },
                                "lv.",
                                item.level_limit))),
                    React.createElement("div", { className: "text-sm text-blue-900/90 font-medium leading-relaxed" },
                        item.type ? `${item.type}：` : '效果：',
                        React.createElement("span", { className: "font-semibold" }, renderItemInfo(item))),
                    React.createElement("div", { className: "mt-auto space-y-2" },
                        React.createElement("h3", { className: "text-sm font-semibold text-blue-900/80 tracking-wide" }, "\u914D\u65B9"),
                        React.createElement("ul", { className: "space-y-1 max-h-40 overflow-auto pr-1 scrollbar-thin scrollbar-thumb-blue-300/40 scrollbar-track-transparent" }, item.materials.map((m, mi) => (React.createElement("li", { key: mi, className: "flex justify-between gap-4 text-xs md:text-sm text-blue-900/80 bg-white/50 border border-white/40 rounded px-2 py-1" },
                            React.createElement("span", { className: "truncate", title: m.name }, m.name),
                            React.createElement("span", { className: "font-semibold" },
                                "\u00D7",
                                m.amount))))))));
            }) || React.createElement("p", { className: "col-span-full text-blue-900/60" }, "\u6682\u65E0\u4E39\u65B9")))));
};

export { Danfang as default };
