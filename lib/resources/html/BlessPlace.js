import React from 'react';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/road.jpg.js';
import HTML from './HTML.js';

const SecretPlace = ({ didian_list }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover relative text-white", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/20 backdrop-blur-[2px] pointer-events-none" }),
        React.createElement("main", { className: "relative max-w-5xl mx-auto space-y-8" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-white/30 backdrop-blur-md \n            text-2xl md:text-3xl font-bold tracking-widest shadow-lg border border-white/40\n            text-blue-900 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" }, "\u6D1E\u5929\u798F\u5730")),
            React.createElement("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, didian_list?.map((item, index) => (React.createElement("article", { key: index, className: "relative group rounded-2xl overflow-hidden bg-[length:100%_100%] bg-center \n              shadow-lg ring-1 ring-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl", style: { backgroundImage: `url(${fileUrl$1})` } },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 group-hover:from-black/20 group-hover:to-black/30 transition-colors" }),
                React.createElement("div", { className: "relative z-10 p-4 md:p-5 flex flex-col h-full justify-between" },
                    React.createElement("header", { className: "space-y-1" },
                        React.createElement("h2", { className: "text-lg font-semibold tracking-wide drop-shadow-md" },
                            React.createElement("span", { className: "block text-sm font-medium text-blue-100/90" },
                                "\u3010\u5165\u9A7B\u5B97\u95E8: ",
                                item.ass || '-',
                                "\u3011"),
                            item.name)),
                    React.createElement("div", { className: "mt-4 space-y-2 text-sm md:text-base font-medium" },
                        React.createElement("p", { className: "flex items-center gap-2" },
                            React.createElement("span", { className: "px-2 py-0.5 rounded-full bg-blue-500/30 border border-white/20" }, "\u798F\u5730\u7B49\u7EA7"),
                            React.createElement("span", { className: "font-semibold" }, item.level)),
                        React.createElement("p", { className: "flex items-center gap-2" },
                            React.createElement("span", { className: "px-2 py-0.5 rounded-full bg-blue-400/30 border border-white/20" }, "\u4FEE\u70BC\u6548\u7387"),
                            React.createElement("span", { className: "font-semibold" }, item.efficiency))))))) || React.createElement("p", { className: "col-span-full text-blue-900/60" }, "\u6682\u65E0\u6570\u636E")))));
};

export { SecretPlace as default };
