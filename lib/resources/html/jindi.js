import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/road.jpg.js';

const SecretPlace = ({ didian_list }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-5xl mx-auto space-y-8" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" }, "\u7981\u5730")),
            React.createElement("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, didian_list?.map((item, index) => (React.createElement("article", { key: index, className: "relative group rounded-2xl overflow-hidden bg-[length:100%_100%] bg-center shadow-card ring-1 ring-white/10 hover:ring-brand-accent transition-all duration-300", style: { backgroundImage: `url(${fileUrl$1})` } },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 group-hover:from-black/30 group-hover:to-black/60 transition-colors" }),
                React.createElement("div", { className: "relative z-10 p-4 md:p-5 flex flex-col h-full justify-between" },
                    React.createElement("header", { className: "space-y-1" },
                        React.createElement("h2", { className: "text-lg font-semibold text-white tracking-wide drop-shadow" },
                            React.createElement("span", { className: "text-brand-accent" },
                                "\u3010\u7B49\u7EA7:",
                                item.Grade,
                                "\u3011"),
                            item.name)),
                    React.createElement("div", { className: "mt-4 space-y-1 text-sm md:text-base text-white/90 font-medium" },
                        React.createElement("p", null,
                            "\u6781\u54C1\uFF1A",
                            React.createElement("span", { className: "text-brand-accent font-semibold" }, item.Best[0])),
                        React.createElement("p", null,
                            "\u6240\u9700\u7075\u77F3\uFF1A",
                            React.createElement("span", { className: "text-brand-accent font-semibold" }, item.Price)),
                        React.createElement("p", null,
                            "\u6240\u9700\u4FEE\u4E3A\uFF1A",
                            React.createElement("span", { className: "text-brand-accent font-semibold" }, item.experience))))))) || React.createElement("p", { className: "col-span-full text-white/60" }, "\u6682\u65E0\u7981\u5730")))));
};

export { SecretPlace as default };
