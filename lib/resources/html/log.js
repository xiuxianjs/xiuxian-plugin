import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/najie.jpg.js';

const Log = ({ log }) => {
    return (React.createElement(HTML, { className: ' w-full bg-top bg-cover relative p-4 md:p-8', style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("div", { className: 'absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none' }),
        React.createElement("main", { className: 'relative max-w-3xl mx-auto space-y-6 z-10' },
            React.createElement("section", { className: 'rounded-3xl bg-white/10 backdrop-blur-lg ring-1 ring-white/20 p-6 md:p-8 shadow-lg' }, log?.length ? (log.map((item, index) => (React.createElement("div", { key: index, className: 'mb-6 last:mb-0 bg-white/20 rounded-lg p-4 shadow-md' },
                React.createElement("div", { className: 'text-base md:text-lg font-mono leading-relaxed text-gray-100 break-words whitespace-pre-line' }, item),
                index !== log.length - 1 && (React.createElement("hr", { className: 'border-t border-dashed border-white/30 mt-4' })))))) : (React.createElement("p", { className: 'text-gray-300 text-lg font-semibold pt-10' }, "\u6682\u65E0\u65E5\u5FD7"))))));
};

export { Log as default };
