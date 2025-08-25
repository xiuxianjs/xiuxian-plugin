import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/player.jpg.js';
import fileUrl$1 from '../img/player_footer.png.js';

const Shop = ({ name, level, state, thing = [] }) => {
    return (React.createElement(HTML, { className: "w-full text-center p-4 md:p-8 bg-top bg-no-repeat min-h-screen", style: {
            backgroundImage: `url(${fileUrl}), url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100%, auto'
        } },
        React.createElement("main", { className: "max-w-4xl mx-auto space-y-8" },
            React.createElement("header", { className: "relative" },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-amber-600/20 to-orange-600/20 rounded-3xl blur-2xl" }),
                React.createElement("div", { className: "relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-amber-400/30 p-8 shadow-2xl border border-amber-300/20" },
                    React.createElement("div", { className: "flex items-center justify-center space-x-4 mb-6" },
                        React.createElement("div", { className: "w-10 h-10 bg-amber-400/30 rounded-full flex items-center justify-center" },
                            React.createElement("span", { className: "text-amber-300 text-xl" }, "\uD83C\uDFEA")),
                        React.createElement("h1", { className: "text-2xl md:text-3xl font-bold tracking-wider text-amber-200 drop-shadow-lg" },
                            "\u3010",
                            name,
                            "\u3011"),
                        React.createElement("div", { className: "w-10 h-10 bg-amber-400/30 rounded-full flex items-center justify-center" },
                            React.createElement("span", { className: "text-amber-300 text-xl" }, "\uD83C\uDFEA"))),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
                        React.createElement("div", { className: "flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-900/40 to-orange-900/40 border border-amber-400/30" },
                            React.createElement("span", { className: "text-amber-200 font-bold text-lg" }, level)),
                        React.createElement("div", { className: "flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-400/30" },
                            React.createElement("span", { className: "text-emerald-200 font-bold text-lg" }, state))))),
            thing.length > 0 && (React.createElement("section", { className: "relative" },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl blur-2xl" }),
                React.createElement("div", { className: "relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-blue-400/30 p-6 md:p-8 shadow-2xl border border-blue-300/20" },
                    React.createElement("div", { className: "space-y-4" }, thing.map((item, index) => (React.createElement("article", { key: index, className: "relative rounded-2xl bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-5 shadow-xl border border-blue-400/30 backdrop-blur-md hover:border-blue-300/50 transition-all duration-300" },
                        React.createElement("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-t-2xl" }),
                        React.createElement("div", { className: "absolute top-2 right-2 w-3 h-3 bg-blue-400/50 rounded-full" }),
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement("div", { className: "flex items-center space-x-4" },
                                React.createElement("div", { className: "w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center" },
                                    React.createElement("span", { className: "text-blue-300 text-xl" }, "\uD83D\uDCE6")),
                                React.createElement("div", null,
                                    React.createElement("h3", { className: "text-lg font-bold tracking-wide text-blue-100 drop-shadow" }, item.name),
                                    React.createElement("p", { className: "text-blue-200/80 text-sm" },
                                        "\u7F16\u53F7: ",
                                        index + 1))),
                            React.createElement("div", { className: "flex items-center space-x-3" },
                                React.createElement("div", { className: "text-center" },
                                    React.createElement("div", { className: "text-2xl font-bold text-amber-300" }, item.数量)),
                                React.createElement("div", { className: "w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center" },
                                    React.createElement("span", { className: "text-amber-300 text-sm" }, "\uD83D\uDCCA"))))))))))),
            thing.length === 0 && (React.createElement("section", { className: "relative" },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-br from-gray-600/10 to-slate-600/10 rounded-3xl blur-2xl" }),
                React.createElement("div", { className: "relative rounded-3xl bg-white/8 backdrop-blur-xl ring-2 ring-gray-400/30 p-8 shadow-2xl border border-gray-300/20" },
                    React.createElement("div", { className: "flex flex-col items-center space-y-4" },
                        React.createElement("div", { className: "w-16 h-16 bg-gray-400/20 rounded-full flex items-center justify-center" },
                            React.createElement("span", { className: "text-gray-300 text-3xl" }, "\uD83D\uDCED")),
                        React.createElement("h3", { className: "text-xl font-bold text-gray-200" }, "\u6682\u65E0"))))))));
};

export { Shop as default };
