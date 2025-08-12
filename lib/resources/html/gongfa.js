import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/player.jpg.js';
import fileUrl$1 from '../img/player_footer.png.js';

const Gongfa = ({ nickname, gongfa_need = [], gongfa_have = [] }) => {
    return (React.createElement(HTML, { className: " w-full text-center p-4 md:p-8 bg-top bg-no-repeat", style: {
            backgroundImage: `url(${fileUrl}), url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100%, auto'
        } },
        React.createElement("main", { className: "max-w-5xl mx-auto space-y-10" },
            React.createElement("header", { className: "flex flex-col items-center space-y-4" },
                React.createElement("h1", { className: "px-8 py-3 rounded-2xl bg-gradient-to-r from-green-900/70 to-yellow-900/70 text-3xl md:text-4xl font-extrabold tracking-widest shadow-lg border-2 border-yellow-400/60 text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" },
                    nickname,
                    "\u7684\u529F\u6CD5")),
            gongfa_need.length > 0 && (React.createElement("section", { className: "rounded-2xl bg-black/30 backdrop-blur-lg border border-yellow-500/30 p-6 shadow-2xl space-y-4" },
                React.createElement("h2", { className: "text-lg md:text-xl font-bold tracking-wide text-yellow-200 drop-shadow" }, "\u3010\u672A\u5B66\u4E60\u3011"),
                React.createElement("div", { className: "grid gap-6 sm:grid-cols-2" }, gongfa_need.map((item, index) => (React.createElement("article", { key: index, className: "rounded-xl bg-gradient-to-b from-green-800/40 to-green-900/40 p-4 border border-yellow-500/30 shadow-inner transition transform hover:-translate-y-1 hover:shadow-yellow-500/40" },
                    React.createElement("h3", { className: "text-lg font-bold text-yellow-300 drop-shadow mb-2" }, item.name),
                    React.createElement("p", { className: "text-sm text-green-100/90" },
                        "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                        React.createElement("span", { className: "font-semibold text-yellow-200" },
                            (item.修炼加成 * 100).toFixed(0),
                            "%")),
                    React.createElement("p", { className: "text-sm text-green-100/90" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement("span", { className: "font-semibold text-yellow-200" }, item.出售价.toFixed(0))))))))),
            gongfa_have.length > 0 && (React.createElement("section", { className: "rounded-2xl bg-black/30 backdrop-blur-lg border border-green-400/30 p-6 shadow-2xl space-y-4" },
                React.createElement("h2", { className: "text-lg md:text-xl font-bold tracking-wide text-green-200 drop-shadow" }, "\u3010\u5DF2\u5B66\u4E60\u3011"),
                React.createElement("div", { className: "grid gap-6 sm:grid-cols-2" }, gongfa_have.map((item, index) => (React.createElement("article", { key: index, className: "rounded-xl bg-gradient-to-b from-green-700/40 to-green-900/50 p-4 border border-green-400/30 shadow-inner transition transform hover:-translate-y-1 hover:shadow-green-400/40" },
                    React.createElement("h3", { className: "text-lg font-bold text-green-200 drop-shadow mb-2" }, item.name),
                    React.createElement("p", { className: "text-sm text-green-100/90" },
                        "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                        React.createElement("span", { className: "font-semibold text-green-300" },
                            (item.修炼加成 * 100).toFixed(0),
                            "%")),
                    React.createElement("p", { className: "text-sm text-green-100/90" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement("span", { className: "font-semibold text-green-300" }, item.出售价.toFixed(0))))))))))));
};

export { Gongfa as default };
