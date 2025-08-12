import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/player.jpg.js';
import fileUrl$1 from '../img/player_footer.png.js';

const Gongfa = ({ nickname, gongfa_need = [], gongfa_have = [] }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-no-repeat bg-[length:100%]", style: {
            backgroundImage: `url(${fileUrl}), url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100%, auto'
        } },
        React.createElement("main", { className: "max-w-4xl mx-auto space-y-8" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement("h1", { className: "inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" },
                    nickname,
                    "\u7684\u529F\u6CD5")),
            gongfa_need.length > 0 && (React.createElement("section", { className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4" },
                React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-white tracking-wide mb-2" }, "\u3010\u672A\u5B66\u4E60\u3011"),
                React.createElement("div", { className: "grid gap-4 sm:grid-cols-2" }, gongfa_need.map((item, index) => (React.createElement("article", { key: index, className: "rounded-xl bg-white/10 p-4 flex flex-col gap-2 shadow" },
                    React.createElement("h3", { className: "text-base font-bold text-white tracking-wide mb-1" }, item.name),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" },
                            (item.修炼加成 * 100).toFixed(0),
                            "%")),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.出售价.toFixed(0))))))))),
            gongfa_have.length > 0 && (React.createElement("section", { className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4" },
                React.createElement("h2", { className: "text-lg md:text-xl font-semibold text-brand-accent tracking-wide mb-2" }, "\u3010\u5DF2\u5B66\u4E60\u3011"),
                React.createElement("div", { className: "grid gap-4 sm:grid-cols-2" }, gongfa_have.map((item, index) => (React.createElement("article", { key: index, className: "rounded-xl bg-white/10 p-4 flex flex-col gap-2 shadow hover:bg-brand-accent/10 transition" },
                    React.createElement("h3", { className: "text-base font-bold text-white tracking-wide mb-1" }, item.name),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" },
                            (item.修炼加成 * 100).toFixed(0),
                            "%")),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.出售价.toFixed(0))))))))))));
};

export { Gongfa as default };
