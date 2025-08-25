import React from 'react';
import fileUrl from '../img/fairyrealm.jpg.js';
import HTML from './HTML.js';

const Ningmenghome = ({ commodities_list }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: ' w-full flex flex-col items-center justify-start p-6 md:p-12 bg-center bg-cover relative', style: {
                backgroundImage: `url(${fileUrl})`
            } },
            React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-blue-300/90 pointer-events-none' }),
            React.createElement("div", { className: 'relative max-w-4xl w-full bg-white/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 text-blue-900 z-10' },
                React.createElement("header", { className: 'mb-8 text-center' },
                    React.createElement("h1", { className: 'text-4xl font-extrabold tracking-widest mb-2 drop-shadow-lg' }, "\u67E0\u6AAC\u5802"),
                    React.createElement("p", { className: 'text-sm md:text-base text-blue-800/80' },
                        "\u8D2D\u4E70\u6307\u4EE4\uFF1A",
                        React.createElement("span", { className: 'font-semibold' }, "#\u8D2D\u4E70+\u7269\u54C1\u540D"),
                        " \u00A0\u00A0 \u7B5B\u9009\u6307\u4EE4\uFF1A",
                        React.createElement("span", { className: 'font-semibold' }, "#\u67E0\u6AAC\u5802+\u7269\u54C1\u7C7B\u578B"))),
                React.createElement("div", { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' }, commodities_list?.map((item, idx) => (React.createElement("div", { key: idx, className: 'bg-white/50 rounded-xl p-4 shadow-md border border-white/40 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200' },
                    React.createElement("div", { className: 'flex justify-between items-center font-semibold text-lg' },
                        React.createElement("span", null,
                            "\u3010",
                            item.type,
                            "\u3011",
                            item.name),
                        React.createElement("span", { className: 'text-blue-700 font-bold' },
                            (item.出售价 * 1.2).toFixed(0),
                            " \u7075\u77F3")),
                    item.class === '装备' && (React.createElement("div", { className: 'grid grid-cols-2 gap-2 text-blue-800 font-medium' },
                        React.createElement("div", null,
                            "\u653B\uFF1A",
                            item.atk),
                        React.createElement("div", null,
                            "\u9632\uFF1A",
                            item.def),
                        React.createElement("div", null,
                            "\u8840\uFF1A",
                            item.HP),
                        React.createElement("div", null,
                            "\u66B4\uFF1A",
                            (item.bao * 100).toFixed(1),
                            "%"))),
                    item.class === '丹药' && (React.createElement("div", { className: 'text-blue-800 font-medium' },
                        "\u6548\u679C\uFF1A",
                        (item.HP / 1000).toFixed(1),
                        "% ",
                        item.exp,
                        " ",
                        item.xueqi)),
                    item.class === '功法' && (React.createElement("div", { className: 'text-blue-800 font-medium' },
                        "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                        (item.修炼加成 * 100).toFixed(0),
                        "%")),
                    (item.class === '道具' || item.class === '草药') && (React.createElement("div", { className: 'text-blue-800 font-medium' },
                        "\u63CF\u8FF0\uFF1A",
                        item.desc))))))))));
};

export { Ningmenghome as default };
