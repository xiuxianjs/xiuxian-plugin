import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';
import { BackgroundImage } from 'jsxp';

const MoneyCheck = ({ userId, victory, victory_num, defeated, defeated_num }) => {
    return (React.createElement(HTML, null,
        React.createElement(BackgroundImage, { className: ' w-full flex items-center justify-center p-6 md:p-12 relative bg-center bg-cover', src: fileUrl },
            React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-blue-200/80 pointer-events-none' }),
            React.createElement("main", { className: 'relative max-w-md w-full bg-gradient-to-tr from-blue-100/60 to-blue-200/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 flex flex-col items-center gap-8\n        hover:scale-[1.02] transition-transform duration-300' },
                React.createElement("h1", { className: 'text-4xl md:text-5xl font-extrabold tracking-widest text-blue-900 drop-shadow-lg', style: { textShadow: '0 0 6px rgba(0,0,80,0.7)' } }, "\u91D1\u94F6\u574A\u8BB0\u5F55"),
                React.createElement("div", { className: 'text-lg text-blue-800 font-semibold tracking-wide select-none' },
                    "\u8D26\u53F7\uFF1A",
                    userId),
                React.createElement("div", { className: 'w-full grid grid-cols-2 gap-6 text-blue-900 font-semibold text-xl' },
                    React.createElement("div", { className: 'flex flex-col items-center gap-1 p-4 rounded-xl bg-white/40 backdrop-blur-sm shadow-md border border-white/40' },
                        React.createElement("div", { className: 'uppercase tracking-wider text-sm' }, "\u80DC\u573A"),
                        React.createElement("div", { className: 'text-3xl font-extrabold text-blue-700' }, victory),
                        React.createElement("div", { className: 'text-xs text-blue-600 mt-1' }, "\u5171\u5377\u8D70\u7075\u77F3"),
                        React.createElement("div", { className: 'text-2xl font-bold text-blue-800' }, victory_num)),
                    React.createElement("div", { className: 'flex flex-col items-center gap-1 p-4 rounded-xl bg-white/40 backdrop-blur-sm shadow-md border border-white/40' },
                        React.createElement("div", { className: 'uppercase tracking-wider text-sm' }, "\u8D25\u573A"),
                        React.createElement("div", { className: 'text-3xl font-extrabold text-red-600' }, defeated),
                        React.createElement("div", { className: 'text-xs text-red-500 mt-1' }, "\u5171\u732E\u796D\u7075\u77F3"),
                        React.createElement("div", { className: 'text-2xl font-bold text-red-700' }, defeated_num)))))));
};

export { MoneyCheck as default };
