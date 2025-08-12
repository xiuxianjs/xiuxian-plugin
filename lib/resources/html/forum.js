import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';

const Forum = ({ Forum: forumData }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-4xl mx-auto space-y-8" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" }, "\u805A\u5B9D\u5802"),
                React.createElement("div", { className: "text-white/70 text-sm md:text-base space-y-1" },
                    React.createElement("div", null, "\u53D1\u5E03\u6307\u4EE4\uFF1A#\u53D1\u5E03+\u7269\u54C1\u540D*\u4EF7\u683C*\u6570\u91CF"),
                    React.createElement("div", null, "\u63A5\u53D6\u6307\u4EE4\uFF1A#\u63A5\u53D6+\u7F16\u53F7*\u6570\u91CF"),
                    React.createElement("div", null, "\u53D6\u6D88\u6307\u4EE4\uFF1A#\u53D6\u6D88+\u7F16\u53F7"))),
            React.createElement("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, forumData?.length ? (forumData.map((item, index) => (React.createElement("article", { key: index, className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition" },
                React.createElement("h2", { className: "text-lg font-semibold text-brand-accent tracking-wide mb-1" },
                    "\u3010",
                    item.class,
                    "\u3011",
                    item.name),
                React.createElement("div", { className: "text-sm text-white/80" },
                    "\u7F16\u53F7\uFF1A",
                    React.createElement("span", { className: "font-semibold text-brand-accent" },
                        "No.",
                        item.num)),
                React.createElement("div", { className: "text-sm text-white/80" },
                    "\u5355\u4EF7\uFF1A",
                    React.createElement("span", { className: "font-semibold text-brand-accent" }, item.price)),
                React.createElement("div", { className: "text-sm text-white/80" },
                    "\u6570\u91CF\uFF1A",
                    React.createElement("span", { className: "font-semibold text-brand-accent" }, item.aconut)),
                React.createElement("div", { className: "text-sm text-white/80" },
                    "\u603B\u4EF7\uFF1A",
                    React.createElement("span", { className: "font-semibold text-brand-accent" }, item.whole)),
                React.createElement("div", { className: "text-sm text-white/80" },
                    "QQ\uFF1A",
                    React.createElement("span", { className: "font-semibold text-brand-accent" }, item.qq)))))) : (React.createElement("p", { className: "col-span-full text-white/60" }, "\u6682\u65E0\u53D1\u5E03"))))));
};

export { Forum as default };
