import React from 'react';
import { LinkStyleSheet } from 'jsxp';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../img/fairyrealm.jpg.js';

const ZongMeng = ({ temp }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
              @font-face { font-family: 'tttgbnumber'; src: url('${fileUrl$1}'); font-weight: normal; font-style: normal; }
              body { font-family: 'tttgbnumber', system-ui, sans-serif; }
            `
                } })),
        React.createElement("body", { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl$2})` } },
            React.createElement("main", { className: "max-w-5xl mx-auto space-y-8" },
                React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                    React.createElement("h1", { className: "inline-block px-8 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest text-white shadow" }, "\u5B97\u95E8\u5217\u8868")),
                React.createElement("section", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" }, temp?.length ? (temp.map((item, index) => (React.createElement("article", { key: index, className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition" },
                    React.createElement("h2", { className: "text-lg font-semibold text-brand-accent tracking-wide mb-1" }, item.宗名),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u4EBA\u6570\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" },
                            item.人数,
                            "/",
                            item.宗门人数上限)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u7C7B\u578B\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.位置)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u7B49\u7EA7\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.等级)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u5929\u8D4B\u52A0\u6210\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" },
                            item.天赋加成,
                            "%")),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u5EFA\u8BBE\u7B49\u7EA7\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.宗门建设等级)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u9547\u5B97\u795E\u517D\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.镇宗神兽)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u9A7B\u5730\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.宗门驻地)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u52A0\u5165\u95E8\u69DB\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.最低加入境界)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u5B97\u4E3BQQ\uFF1A",
                        React.createElement("span", { className: "font-semibold text-brand-accent" }, item.宗主)))))) : (React.createElement("p", { className: "col-span-full text-white/60" }, "\u6682\u65E0\u5B97\u95E8")))))));
};

export { ZongMeng as default };
