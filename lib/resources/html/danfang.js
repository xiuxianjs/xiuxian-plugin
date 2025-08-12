import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/user_state.png.js';

const Danfang = ({ danfang_list }) => {
    const renderItemInfo = (item) => {
        switch (item.type) {
            case '血量':
                return item.HP;
            case '修为':
                return item.exp2;
            case '血气':
                return item.exp2;
            default:
                return '';
        }
    };
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-6xl mx-auto space-y-10" },
            React.createElement("header", { className: "space-y-3" },
                React.createElement("div", { className: "mx-auto w-56 h-56 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card", style: { backgroundImage: `url(${fileUrl$1})` } }),
                React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" }, "\u4E39\u65B9"),
                React.createElement("p", { className: "text-white/70 text-sm md:text-base" }, "\u70BC\u5236\u6307\u4EE4\uFF1A#\u70BC\u5236+\u4E39\u836F\u540D"),
                React.createElement("p", { className: "text-white/60 text-xs md:text-sm" }, "\u70BC\u5236\u6210\u529F\u7387 = \u4E39\u65B9\u6210\u529F\u7387 + \u73A9\u5BB6\u804C\u4E1A\u7B49\u7EA7\u6210\u529F\u7387")),
            React.createElement("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, danfang_list?.map((item, index) => {
                const ratePercent = Math.floor(item.rate * 100);
                return (React.createElement("article", { key: index, className: "group rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-3 shadow-card hover:ring-brand-accent hover:bg-white/10 transition" },
                    React.createElement("header", { className: "space-y-1" },
                        React.createElement("h2", { className: "text-lg font-semibold text-white tracking-wide" },
                            React.createElement("span", { className: "text-brand-accent" },
                                "\u3010",
                                item.type,
                                "\u3011"),
                            item.name),
                        React.createElement("div", { className: "flex items-center gap-3 text-sm text-white/80" },
                            React.createElement("span", { className: "px-2 py-0.5 rounded-full bg-brand-dark/60 text-brand-accent font-medium shadow" },
                                ratePercent,
                                "%"),
                            React.createElement("span", { className: "px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent font-medium shadow" },
                                "lv.",
                                item.level_limit))),
                    React.createElement("div", { className: "text-sm text-white/90 font-medium" },
                        item.type,
                        "\uFF1A",
                        React.createElement("span", { className: "text-brand-accent font-semibold" }, renderItemInfo(item))),
                    React.createElement("div", { className: "mt-auto space-y-2" },
                        React.createElement("h3", { className: "text-sm font-semibold text-white/80 tracking-wide" }, "\u914D\u65B9"),
                        React.createElement("ul", { className: "space-y-1 max-h-40 overflow-auto pr-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent" }, item.materials?.map((m, mi) => (React.createElement("li", { key: mi, className: "flex justify-between gap-4 text-xs md:text-sm text-white/80 bg-white/5 rounded px-2 py-1" },
                            React.createElement("span", { className: "truncate", title: m.name }, m.name),
                            React.createElement("span", { className: "text-brand-accent font-semibold" },
                                "\u00D7",
                                m.amount))))))));
            }) || React.createElement("p", { className: "col-span-full text-white/60" }, "\u6682\u65E0\u4E39\u65B9")))));
};

export { Danfang as default };
