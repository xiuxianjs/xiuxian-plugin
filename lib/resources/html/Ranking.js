import React from 'react';
import classNames from 'classnames';
import HTML from './HTML.js';
import fileUrl from '../img/state.jpg.js';
import fileUrl$1 from '../img/user_state2.png.js';
import { getAvatar } from '../../model/utils/utilsx.js';

const Ranking = ({ user_id, messages = [], title, values }) => {
    const getRankStyles = (index) => {
        switch (index) {
            case 0:
                return {
                    container: 'border-yellow-400/60 bg-gradient-to-r from-yellow-900/40 to-amber-900/30 shadow-yellow-500/30 shadow-lg',
                    rank: 'bg-gradient-to-r from-yellow-400 to-amber-300 text-yellow-900',
                    glow: 'shadow-yellow-400/50',
                    icon: 'text-yellow-400'
                };
            case 1:
                return {
                    container: 'border-purple-300/60 bg-gradient-to-r from-purple-800/40 to-violet-800/30 shadow-purple-400/30 shadow-lg',
                    rank: 'bg-gradient-to-r from-purple-300 to-violet-200 text-purple-800',
                    glow: 'shadow-purple-300/50',
                    icon: 'text-purple-300'
                };
            case 2:
                return {
                    container: 'border-cyan-600/60 bg-gradient-to-r from-cyan-900/40 to-blue-900/30 shadow-cyan-600/30 shadow-lg',
                    rank: 'bg-gradient-to-r from-cyan-400 to-blue-300 text-cyan-900',
                    glow: 'shadow-cyan-400/50',
                    icon: 'text-cyan-400'
                };
            default:
                return {
                    container: 'border-blue-500/40 bg-gradient-to-r from-blue-900/30 to-indigo-900/20 shadow-blue-500/20 shadow-md',
                    rank: 'bg-gradient-to-r from-blue-400 to-indigo-300 text-blue-900',
                    glow: 'shadow-blue-400/30',
                    icon: 'text-blue-400'
                };
        }
    };
    return (React.createElement(HTML, { className: " bg-cover bg-center flex flex-col items-center justify-center p-4 font-serif relative overflow-hidden", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-b from-blue-900/30 via-purple-900/20 to-blue-800/40 pointer-events-none" }),
        React.createElement("div", { className: "absolute inset-0 pointer-events-none" },
            React.createElement("div", { className: "absolute top-20 left-10 w-2 h-2 bg-blue-300/30 rounded-full animate-pulse" }),
            React.createElement("div", { className: "absolute top-40 right-20 w-1 h-1 bg-indigo-300/40 rounded-full animate-pulse delay-1000" }),
            React.createElement("div", { className: "absolute bottom-40 left-20 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-pulse delay-500" }),
            React.createElement("div", { className: "absolute bottom-20 right-10 w-1 h-1 bg-violet-300/40 rounded-full animate-pulse delay-1500" }),
            React.createElement("div", { className: "absolute top-1/3 left-1/4 w-1 h-1 bg-cyan-300/30 rounded-full animate-float" }),
            React.createElement("div", { className: "absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-blue-300/40 rounded-full animate-float delay-2000" })),
        React.createElement("div", { className: "h-8 w-full" }),
        user_id && (React.createElement("div", { className: "relative z-10 flex flex-col md:flex-row justify-center items-center px-5 w-full max-w-5xl gap-8 mb-8 animate-fade-in" },
            React.createElement("div", { className: "relative flex items-center justify-center w-56 h-56 flex-shrink-0" },
                React.createElement("div", { className: "absolute w-56 h-56 rounded-full border-2 border-blue-400/30 animate-spin-slow" }),
                React.createElement("div", { className: "absolute w-52 h-52 rounded-full border-2 border-indigo-300/40 animate-spin-slow", style: { animationDirection: 'reverse', animationDuration: '8s' } }),
                React.createElement("div", { className: "absolute w-48 h-48 rounded-full border-2 border-purple-200/50 animate-spin-slow", style: { animationDuration: '12s' } }),
                React.createElement("div", { className: "relative w-44 h-44 rounded-full overflow-hidden shadow-2xl border-4 border-gradient-to-r from-blue-400 to-indigo-300" },
                    React.createElement("img", { className: "w-full h-full object-cover", src: getAvatar(user_id), alt: "\u7528\u6237\u5934\u50CF" }),
                    React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-400/20 to-transparent" })),
                React.createElement("img", { className: "w-56 h-56 rounded-full absolute animate-spin-slow opacity-60", src: fileUrl$1, alt: "\u4FEE\u4ED9\u5149\u73AF", style: { animationDuration: '15s' } }),
                React.createElement("div", { className: "absolute -top-4 -left-4 w-3 h-3 bg-blue-400/60 rounded-full animate-glow" }),
                React.createElement("div", { className: "absolute -bottom-4 -right-4 w-2 h-2 bg-indigo-300/60 rounded-full animate-glow delay-1000" })),
            React.createElement("div", { className: "flex-1 relative animate-slide-up" },
                React.createElement("div", { className: "absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-300 rounded-full shadow-lg animate-bounce-slow" }),
                React.createElement("div", { className: "absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-violet-300 rounded-full shadow-lg animate-bounce-slow delay-500" }),
                React.createElement("div", { className: "relative px-8 py-8 rounded-2xl shadow-2xl border-2 border-gradient-to-r from-blue-400/50 to-indigo-300/50 bg-gradient-to-br from-black/40 via-black/20 to-black/30 backdrop-blur-xl text-blue-50 overflow-hidden" },
                    React.createElement("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" }),
                    React.createElement("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent" }),
                    React.createElement("div", { className: "absolute top-2 left-2 w-2 h-2 bg-blue-400/40 rounded-full" }),
                    React.createElement("div", { className: "absolute top-2 right-2 w-2 h-2 bg-indigo-300/40 rounded-full" }),
                    React.createElement("div", { className: "absolute bottom-2 left-2 w-2 h-2 bg-purple-400/40 rounded-full" }),
                    React.createElement("div", { className: "absolute bottom-2 right-2 w-2 h-2 bg-violet-300/40 rounded-full" }),
                    React.createElement("div", { className: "flex flex-col gap-4 relative z-10" }, messages))))),
        React.createElement("div", { className: "relative z-10 w-full max-w-4xl flex flex-col items-center px-5 gap-6 animate-fade-in" },
            title && (React.createElement("div", { className: "relative w-full animate-scale-in" },
                React.createElement("div", { className: "absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full shadow-lg" }),
                React.createElement("div", { className: "absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-orange-400 to-red-300 rounded-full shadow-md" }),
                React.createElement("div", { className: "border-2 border-gradient-to-r from-yellow-400/60 to-amber-300/60 rounded-2xl w-full flex justify-center bg-gradient-to-br from-black/50 via-black/30 to-black/40 backdrop-blur-xl shadow-2xl py-6 relative overflow-hidden" },
                    React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-transparent to-amber-300/5" }),
                    React.createElement("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" }),
                    React.createElement("div", { className: "absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent" }),
                    React.createElement("div", { className: "absolute top-2 left-4 w-1 h-1 bg-yellow-400/60 rounded-full" }),
                    React.createElement("div", { className: "absolute top-2 right-4 w-1 h-1 bg-amber-300/60 rounded-full" }),
                    React.createElement("div", { className: "absolute bottom-2 left-4 w-1 h-1 bg-orange-400/60 rounded-full" }),
                    React.createElement("div", { className: "absolute bottom-2 right-4 w-1 h-1 bg-red-300/60 rounded-full" }),
                    React.createElement("span", { className: "text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-200 tracking-widest relative z-10", style: {
                            textShadow: '0 4px 8px rgba(0,0,0,0.8)',
                            filter: 'drop-shadow(0 2px 4px rgba(251, 191, 36, 0.3))'
                        } }, title)))),
            values && values.length > 0 ? (React.createElement("div", { className: "w-full flex flex-col gap-5" }, values.map((item, index) => {
                const styles = getRankStyles(index);
                return (React.createElement("div", { key: index, className: classNames('relative backdrop-blur-xl shadow-xl border-2 p-6 flex gap-6 items-center transition-all duration-500 rounded-2xl', styles.container, styles.glow), style: { animationDelay: `${index * 100}ms` } },
                    React.createElement("div", { className: "flex-1 text-white/95 text-lg leading-relaxed" }, item),
                    React.createElement("div", { className: "absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-blue-400 to-indigo-300 rounded-full opacity-60 animate-pulse" }),
                    React.createElement("div", { className: "absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-br from-purple-400 to-violet-300 rounded-full opacity-40 animate-pulse delay-1000" }),
                    React.createElement("div", { className: "absolute top-0 left-0 w-4 h-1 bg-gradient-to-r from-blue-400/40 to-transparent" }),
                    React.createElement("div", { className: "absolute top-0 right-0 w-4 h-1 bg-gradient-to-l from-indigo-300/40 to-transparent" }),
                    React.createElement("div", { className: "absolute bottom-0 left-0 w-4 h-1 bg-gradient-to-r from-purple-400/40 to-transparent" }),
                    React.createElement("div", { className: "absolute bottom-0 right-0 w-4 h-1 bg-gradient-to-l from-violet-300/40 to-transparent" })));
            }))) : (React.createElement("div", { className: "w-full text-center py-12 animate-fade-in" },
                React.createElement("div", { className: "text-2xl text-blue-200/70 font-medium" }, "\u6682\u65E0\u6392\u884C\u6570\u636E"),
                React.createElement("div", { className: "text-lg text-blue-200/50 mt-2" }, "\u4FEE\u4ED9\u4E4B\u8DEF\uFF0C\u59CB\u4E8E\u8DB3\u4E0B")))),
        React.createElement("div", { className: "h-8 w-full" })));
};

export { Ranking as default };
