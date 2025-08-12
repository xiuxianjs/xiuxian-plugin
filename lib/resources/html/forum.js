import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';

const Forum = ({ Forum: forumData }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover relative", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("div", { className: "absolute inset-0 pointer-events-none \n        bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] \n        bg-[length:18px_18px] animate-pulse" }),
        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-b from-sky-900/40 via-sky-800/20 to-transparent" }),
        React.createElement("main", { className: "relative z-10 max-w-5xl mx-auto space-y-10" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement("h1", { className: "inline-block px-10 py-3 rounded-3xl \n              bg-gradient-to-r from-sky-400/50 via-cyan-300/40 to-sky-400/50 \n              backdrop-blur-lg border border-sky-300/40 \n              text-3xl md:text-4xl font-extrabold tracking-widest shadow-lg ring-1 ring-sky-200/60" }, "\u805A\u5B9D\u5802"),
                React.createElement("div", { className: "text-sky-100/80 text-xs md:text-sm space-y-1 drop-shadow" },
                    React.createElement("div", null, "\uD83D\uDCDC \u53D1\u5E03\u6307\u4EE4\uFF1A#\u53D1\u5E03+\u7269\u54C1\u540D*\u4EF7\u683C*\u6570\u91CF"),
                    React.createElement("div", null, "\uD83E\uDD1D \u63A5\u53D6\u6307\u4EE4\uFF1A#\u63A5\u53D6+\u7F16\u53F7*\u6570\u91CF"),
                    React.createElement("div", null, "\u274C \u53D6\u6D88\u6307\u4EE4\uFF1A#\u53D6\u6D88+\u7F16\u53F7"))),
            React.createElement("section", { className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-3" }, forumData?.length ? (forumData.map((item, index) => (React.createElement("article", { key: index, className: "relative rounded-2xl p-5 flex flex-col gap-2\n                  bg-sky-900/50 backdrop-blur-lg border border-sky-200/30\n                  shadow-lg hover:shadow-cyan-400/40 hover:scale-[1.03]\n                  transition-all duration-300 overflow-hidden" },
                React.createElement("div", { className: "absolute top-0 left-0 w-full h-[3px] \n                  bg-gradient-to-r from-cyan-300 via-sky-400 to-cyan-300 shadow-md" }),
                React.createElement("h2", { className: "text-lg font-bold tracking-wide text-cyan-200 drop-shadow" },
                    "\u3010",
                    item.class,
                    "\u3011",
                    item.name),
                React.createElement("div", { className: "text-sm text-sky-100/80" },
                    "\uD83C\uDD94 \u7F16\u53F7\uFF1A",
                    React.createElement("span", { className: "font-semibold text-indigo-300" },
                        "No.",
                        item.num)),
                React.createElement("div", { className: "text-sm text-sky-100/80" },
                    "\uD83D\uDCB0 \u5355\u4EF7\uFF1A",
                    React.createElement("span", { className: "font-semibold text-amber-300" }, item.price)),
                React.createElement("div", { className: "text-sm text-sky-100/80" },
                    "\uD83D\uDCE6 \u6570\u91CF\uFF1A",
                    React.createElement("span", { className: "font-semibold text-emerald-300" }, item.aconut)),
                React.createElement("div", { className: "text-sm text-sky-100/80" },
                    "\uD83E\uDE99 \u603B\u4EF7\uFF1A",
                    React.createElement("span", { className: "font-semibold text-orange-300" }, item.whole)),
                React.createElement("div", { className: "text-sm text-sky-100/80" },
                    "\u2709 QQ\uFF1A",
                    React.createElement("span", { className: "font-semibold text-cyan-300" }, item.qq)))))) : (React.createElement("p", { className: "col-span-full px-6 py-3 rounded-xl \n              border border-sky-200/30 bg-sky-900/40 \n              text-sky-100/70 backdrop-blur-md" }, "\u6682\u65E0\u53D1\u5E03"))))));
};

export { Forum as default };
