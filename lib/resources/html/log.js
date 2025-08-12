import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/najie.jpg.js';

const Log = ({ log }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-3xl mx-auto space-y-4" },
            React.createElement("section", { className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card" }, log?.length ? (log.map((item, index) => (React.createElement("div", { key: index, className: "mb-4" },
                React.createElement("div", { className: "text-white text-base md:text-lg font-mono break-words whitespace-pre-line" }, item),
                React.createElement("div", { className: "border-b border-dashed border-white/30 my-2" }))))) : (React.createElement("p", { className: "text-white/60" }, "\u6682\u65E0\u65E5\u5FD7"))))));
};

export { Log as default };
