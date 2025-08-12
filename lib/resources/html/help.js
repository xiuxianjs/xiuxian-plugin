import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../styles/help.scss.js';
import fileUrl$1 from '../img/xiuxian.jpg.js';
import fileUrl$2 from '../img/icon.png.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../../../package.json');
const Help = ({ helpData = [], page = 1, pageSize, total }) => {
    return (React.createElement(HTML, { className: "elem-default default-mode text-[18px] text-brand font-sans min-h-screen", style: {
            backgroundImage: `url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top left',
            backgroundSize: '100% 100%',
            fontFamily: 'PingFangSC-Medium, PingFang SC, sans-serif'
        }, linkStyleSheets: [fileUrl] },
        React.createElement("div", { className: "max-w-[900px] mx-auto px-6 py-10", id: "container" },
            React.createElement("header", { className: "mb-6" },
                React.createElement("div", { className: "relative px-6 py-5 rounded-2xl bg-black/30 backdrop-blur-md ring-1 ring-white/10 shadow-card" },
                    React.createElement("h1", { className: "text-4xl font-bold tracking-wide text-white text-center drop-shadow" }, pkg.name),
                    React.createElement("span", { className: "absolute top-2 right-4 text-xs text-white/50 select-none" },
                        "v",
                        pkg.version))),
            React.createElement("main", { className: "space-y-8" }, helpData.map((val, index) => (React.createElement("section", { key: index, className: "border border-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl bg-white/10 backdrop-blur-md overflow-hidden" },
                React.createElement("h2", { className: "flex items-center justify-between pr-4 text-xl font-semibold tracking-wide text-teal-100 bg-black/30 px-3 py-2" },
                    React.createElement("span", { className: "flex items-center gap-2" },
                        React.createElement("span", { className: "w-1.5 h-5 bg-gradient-to-b from-teal-300 to-teal-600 rounded-sm inline-block" }),
                        val.group),
                    Array.isArray(val.list) && val.list.length > 0 && (React.createElement("span", { className: "text-xs font-normal text-white/50" },
                        val.list.length,
                        " \u6761"))),
                React.createElement("div", { className: "px-1 py-2" },
                    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3" }, val.list?.map((item, itemIndex) => (React.createElement("div", { key: itemIndex, className: "relative pl-[52px] pr-3 py-3 text-left bg-black/20 hover:bg-black/35 transition-colors group border border-transparent hover:border-white/10 rounded-md m-[3px]" },
                        React.createElement("span", { className: `${item.icon} ring-1 ring-white/10 shadow-md group-hover:ring-teal-300/60 group-hover:shadow-teal-300/20 transition absolute left-[6px] top-3 scale-[0.85] block rounded`, style: {
                                width: 40,
                                height: 40,
                                backgroundImage: `url(${fileUrl$2})`,
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '500px auto'
                            } }),
                        React.createElement("strong", { className: "block font-medium text-teal-200 group-hover:text-teal-100" }, item.title),
                        React.createElement("span", { className: "block text-xs leading-5 text-white/75 group-hover:text-white/90" }, item.desc)))))))))),
            React.createElement("footer", { className: "mt-12 pt-8 border-t border-white/10" },
                React.createElement("div", { className: "text-center px-2 py-2 text-[15px] sm:text-base md:text-lg leading-relaxed text-white/90 font-medium tracking-wide" },
                    React.createElement("span", { className: "inline-flex items-baseline gap-2 bg-black/30 px-4 py-2 rounded-xl shadow-inner shadow-black/40 backdrop-blur-sm" },
                        React.createElement("span", { className: "text-white/70 text-sm md:text-base" }, "\u7B2C"),
                        React.createElement("b", { className: "text-2xl md:text-3xl text-red-300 drop-shadow-sm font-bold" }, page),
                        typeof total === 'number' && total > 0 ? (React.createElement(React.Fragment, null,
                            React.createElement("span", { className: "text-white/50 text-base md:text-lg" }, "/"),
                            React.createElement("b", { className: "text-xl md:text-2xl text-red-300 font-bold" }, total),
                            React.createElement("span", { className: "text-white/70 text-sm md:text-base" }, "\u9875"))) : (React.createElement("span", { className: "text-white/70 text-sm md:text-base" }, "\u9875")),
                        typeof pageSize !== 'undefined' && pageSize ? (React.createElement("span", { className: "ml-1 md:ml-3 text-xs md:text-sm text-red-100/80 font-normal" },
                            "\uFF08\u6BCF\u9875 ",
                            pageSize,
                            " \u7EC4\uFF09")) : null),
                    React.createElement("div", { className: "mt-4 text-red-100/90 text-sm md:text-base font-normal" },
                        React.createElement("span", { className: "ml-2 inline-flex gap-2 flex-wrap justify-center" },
                            React.createElement("code", { className: "px-2 py-1 rounded-lg bg-red-700/50 text-white text-sm md:text-base shadow ring-1 ring-white/10" }, "\u7FFB\u9875\uFF1A\u6307\u4EE4\u540E\u76F4\u63A5\u52A0\u9875\u7801")))),
                React.createElement("div", { className: "mt-2 text-center text-[10px] tracking-widest text-white/30 select-none" },
                    pkg.name,
                    " \u00B7 v",
                    pkg.version)))));
};

export { Help as default };
