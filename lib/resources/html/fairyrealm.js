import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/card.jpg.js';

const FairyRealm = ({ didian_list = [] }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-5xl mx-auto space-y-8" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" }, "\u4ED9\u5883"),
                React.createElement("span", { className: "text-white/70 text-sm md:text-base" }, "\u6307\u4EE4\uFF1A#\u9547\u5B88\u4ED9\u5883+\u4ED9\u5883\u540D")),
            React.createElement("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, didian_list?.map((item, index) => (React.createElement("article", { key: index, className: "relative group rounded-2xl overflow-hidden bg-[length:100%_100%] bg-center shadow-card ring-1 ring-white/10 hover:ring-brand-accent transition-all duration-300", style: { backgroundImage: `url(${fileUrl$1})` } },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 group-hover:from-black/30 group-hover:to-black/60 transition-colors" }),
                React.createElement("div", { className: "relative z-10 p-4 md:p-5 flex flex-col h-full justify-between" },
                    React.createElement("header", { className: "space-y-1" },
                        React.createElement("h2", { className: "text-lg font-semibold text-white tracking-wide drop-shadow" },
                            React.createElement("span", { className: "text-brand-accent" },
                                "\u3010",
                                item.Grade,
                                "\u3011"),
                            item.name),
                        React.createElement("div", { className: "text-sm text-white/80 font-medium" },
                            React.createElement("span", { className: "text-brand-accent font-bold" }, item.Price),
                            ' ',
                            "\u7075\u77F3 + 100000 \u4FEE\u4E3A")),
                    React.createElement("div", { className: "mt-4 space-y-2 text-sm md:text-base text-white/90 font-medium text-left" },
                        React.createElement("div", null,
                            React.createElement("span", { className: "font-semibold text-brand-accent" }, "\u4F4E\u7EA7\u5956\u52B1\uFF1A"),
                            React.createElement("ul", { className: "pl-4 space-y-1" }, item.one?.map((thing, thingIndex) => (React.createElement("li", { key: thingIndex, className: "text-white/80" }, thing.name))))),
                        React.createElement("div", null,
                            React.createElement("span", { className: "font-semibold text-brand-accent" }, "\u4E2D\u7EA7\u5956\u52B1\uFF1A"),
                            React.createElement("ul", { className: "pl-4 space-y-1" }, item.two?.map((thing, thingIndex) => (React.createElement("li", { key: thingIndex, className: "text-white/80" }, thing.name))))),
                        React.createElement("div", null,
                            React.createElement("span", { className: "font-semibold text-brand-accent" }, "\u9AD8\u7EA7\u5956\u52B1\uFF1A"),
                            React.createElement("ul", { className: "pl-4 space-y-1" }, item.three?.map((thing, thingIndex) => (React.createElement("li", { key: thingIndex, className: "text-white/80" }, thing.name)))))))))) || React.createElement("p", { className: "col-span-full text-white/60" }, "\u6682\u65E0\u4ED9\u5883")))));
};

export { FairyRealm as default };
