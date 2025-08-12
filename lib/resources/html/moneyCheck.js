import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';

const MoneyCheck = ({ qq, victory, victory_num, defeated, defeated_num }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-xl mx-auto space-y-8" },
            React.createElement("section", { className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-6 shadow-card flex flex-col items-center gap-4" },
                React.createElement("h1", { className: "text-2xl md:text-3xl font-bold tracking-widest text-brand-accent mb-2" }, "\u91D1\u94F6\u574A\u8BB0\u5F55"),
                React.createElement("div", { className: "text-white/70 text-base mb-4" },
                    "QQ\uFF1A",
                    qq),
                React.createElement("div", { className: "grid gap-3 text-white/90 text-lg font-medium" },
                    React.createElement("div", null,
                        "\u80DC\u573A\uFF1A",
                        React.createElement("span", { className: "text-brand-accent font-semibold" }, victory)),
                    React.createElement("div", null,
                        "\u5171\u5377\u8D70\u7075\u77F3\uFF1A",
                        React.createElement("span", { className: "text-brand-accent font-semibold" }, victory_num)),
                    React.createElement("div", null,
                        "\u8D25\u573A\uFF1A",
                        React.createElement("span", { className: "text-brand-accent font-semibold" }, defeated)),
                    React.createElement("div", null,
                        "\u5171\u732E\u796D\u7075\u77F3\uFF1A",
                        React.createElement("span", { className: "text-brand-accent font-semibold" }, defeated_num)))))));
};

export { MoneyCheck as default };
