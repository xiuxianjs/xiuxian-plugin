import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/state.jpg.js';
import fileUrl$1 from '../img/user_state2.png.js';

const Ranking = ({ user_id, messages = [], title, values }) => {
    const getRankStyles = index => {
        switch (index) {
            case 0:
                return 'border-yellow-400/80 bg-yellow-900/30 hover:bg-yellow-800/50 shadow-yellow-500/50';
            case 1:
                return 'border-orange-600/60 bg-orange-950/30 hover:bg-orange-900/50 shadow-orange-600/40';
            case 2:
                return 'border-slate-400/80 bg-slate-800/30 hover:bg-slate-700/50 shadow-slate-400/40';
            default:
                return 'border-sky-500/30 bg-sky-950/20 hover:bg-sky-900/40 shadow-sky-500/30';
        }
    };
    return (React.createElement(HTML, { className: "min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4 font-serif", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("div", { className: "h-8 w-full" }),
        user_id && (React.createElement("div", { className: "flex flex-col md:flex-row justify-center items-center px-5 w-full max-w-4xl gap-6" },
            React.createElement("div", { className: "relative flex items-center justify-center w-48 h-48 flex-shrink-0" },
                React.createElement("img", { className: "w-40 h-40 rounded-full shadow-2xl border-2 border-amber-200/50", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, alt: "\u7528\u6237\u5934\u50CF" }),
                React.createElement("img", { className: "w-52 h-52 rounded-full absolute animate-spin-slow", src: fileUrl$1, alt: "\u4FEE\u4ED9\u5149\u73AF" })),
            React.createElement("div", { className: "flex-1 px-8 py-6 rounded-lg shadow-2xl border border-amber-300/30 bg-black/20 backdrop-blur-md text-amber-50" },
                React.createElement("div", { className: "flex flex-col gap-3" }, messages)))),
        React.createElement("div", { className: "w-full max-w-3xl flex flex-col items-center mt-8 px-5 gap-3" },
            React.createElement("div", { className: "border-x-2 border-t-2 border-amber-300/50 rounded-t-xl w-full flex justify-center bg-black/25 backdrop-blur-xl shadow-lg py-2" },
                React.createElement("span", { className: "text-3xl font-bold text-amber-200 tracking-widest", style: { textShadow: '0 2px 4px rgba(0,0,0,0.5)' } }, title)),
            values && values.length > 0 ? (React.createElement("div", { className: "w-full flex flex-col gap-4" }, values.map((item, index) => (React.createElement("div", { key: index, className: `backdrop-blur-md shadow-lg border p-5 flex gap-4 items-center transition-all duration-300 rounded-lg transform hover:scale-105 ${getRankStyles(index)}` },
                React.createElement("span", { className: "text-2xl font-bold w-8 text-center text-amber-100/90" }, index + 1),
                React.createElement("div", { className: "flex-1 text-white/90" }, item)))))) : null),
        React.createElement("div", { className: "h-8 w-full" })));
};

export { Ranking as default };
