import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';

const Msg = ({ type, msg }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-3xl mx-auto space-y-8" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                type === 0 && (React.createElement(React.Fragment, null,
                    React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" }, "\u60AC\u8D4F\u76EE\u6807"),
                    React.createElement("div", { className: "text-white/70 text-sm md:text-base" }, "\u6307\u4EE4\uFF1A#\u8BA8\u4F10\u76EE\u6807+\u6570\u5B57"))),
                type === 1 && (React.createElement(React.Fragment, null,
                    React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" }, "\u60AC\u8D4F\u699C"),
                    React.createElement("div", { className: "text-white/70 text-sm md:text-base" }, "\u6307\u4EE4\uFF1A#\u523A\u6740\u76EE\u6807+\u6570\u5B57")))),
            React.createElement("section", { className: "grid gap-6" }, msg?.length ? (msg.map((item, index) => (React.createElement("article", { key: index, className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition" },
                React.createElement("div", { className: "text-lg font-semibold text-brand-accent tracking-wide mb-1" },
                    "\u540D\u53F7\uFF1A",
                    item.名号),
                React.createElement("div", { className: "text-sm text-white/80" },
                    "\u7F16\u53F7\uFF1A",
                    React.createElement("span", { className: "font-semibold text-brand-accent" },
                        "No.",
                        index + 1)),
                React.createElement("div", { className: "text-sm text-white/80" },
                    "\u8D4F\u91D1\uFF1A",
                    React.createElement("span", { className: "font-semibold text-brand-accent" }, item.赏金)))))) : (React.createElement("p", { className: "col-span-full text-white/60" }, "\u6682\u65E0\u60AC\u8D4F"))))));
};

export { Msg as default };
