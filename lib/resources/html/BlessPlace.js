import React from 'react';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/user_state.png.js';
import fileUrl$2 from '../img/road.jpg.js';
import HTML from './HTML.js';

const SecretPlace = ({ didian_list }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-5xl mx-auto space-y-8" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement("div", { className: "w-56 h-56 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card", style: { backgroundImage: `url(${fileUrl$1})` } }),
                React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" }, "\u6D1E\u5929\u798F\u5730")),
            React.createElement("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, didian_list?.map((item, index) => (React.createElement("article", { key: index, className: "relative group rounded-2xl overflow-hidden bg-[length:100%_100%] bg-center shadow-card ring-1 ring-white/10 hover:ring-brand-accent transition-all duration-300", style: { backgroundImage: `url(${fileUrl$2})` } },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50 group-hover:from-black/30 group-hover:to-black/60 transition-colors" }),
                React.createElement("div", { className: "relative z-10 p-4 md:p-5 flex flex-col h-full justify-between" },
                    React.createElement("header", { className: "space-y-1" },
                        React.createElement("h2", { className: "text-lg font-semibold text-white tracking-wide drop-shadow" },
                            React.createElement("span", { className: "text-brand-accent" },
                                "\u3010\u5165\u9A7B\u5B97\u95E8:",
                                item.ass || '-',
                                "\u3011"),
                            item.name)),
                    React.createElement("div", { className: "mt-4 space-y-1 text-sm md:text-base text-white/90 font-medium" },
                        React.createElement("p", null,
                            "\u798F\u5730\u7B49\u7EA7\uFF1A",
                            React.createElement("span", { className: "text-brand-accent font-semibold" }, item.level)),
                        React.createElement("p", null,
                            "\u4FEE\u70BC\u6548\u7387\uFF1A",
                            React.createElement("span", { className: "text-brand-accent font-semibold" }, item.efficiency))))))) || React.createElement("p", { className: "col-span-full text-white/60" }, "\u6682\u65E0\u6570\u636E")))));
};

export { SecretPlace as default };
