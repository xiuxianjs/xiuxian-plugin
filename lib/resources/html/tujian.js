import React from 'react';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import { LinkStyleSheet } from 'jsxp';
import fileUrl$2 from '../img/fairyrealm.jpg.js';

const TuJian = ({ commodities_list }) => {
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
        React.createElement("body", null,
            React.createElement("div", { className: "min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8", style: {
                    backgroundImage: `url('${fileUrl$2}')`,
                    backgroundSize: 'cover'
                } },
                React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                    React.createElement("div", { className: "rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center" },
                        React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u65A9\u9996\u795E\u5668\u5802"),
                        React.createElement("div", { className: "w-full" }, commodities_list &&
                            commodities_list.map((item, index) => (React.createElement("div", { key: index, className: "border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4" },
                                React.createElement("div", { className: "font-bold text-blue-800 text-lg mb-2" },
                                    "\u3010",
                                    item.desc[0],
                                    item.type,
                                    "\u3011",
                                    item.name),
                                item.class === '装备' && (React.createElement("div", { className: "space-y-1" },
                                    React.createElement("div", { className: "text-sm text-gray-700" },
                                        "\u5951\u5408\u5143\u7D20\uFF1A\u3010",
                                        item.desc[4],
                                        "\u3011"),
                                    React.createElement("div", { className: "text-sm text-gray-700" },
                                        "\u950B\u5229\u5EA6\uFF1A",
                                        item.atk),
                                    React.createElement("div", { className: "text-sm text-gray-700" },
                                        "\u5203\u4F53\u5F3A\u5EA6\uFF1A",
                                        item.def),
                                    React.createElement("div", { className: "text-sm text-gray-700" },
                                        "\u8840\u6676\u6838\uFF1A",
                                        item.HP),
                                    React.createElement("div", { className: "text-sm text-gray-700" },
                                        "\u5143\u7D20\u7206\u53D1\u7387\uFF1A",
                                        item.bao * 100,
                                        "%"),
                                    React.createElement("div", { className: "text-sm text-gray-700" },
                                        "\u7279\u6027\uFF1A",
                                        item.desc[1]),
                                    React.createElement("div", { className: "text-sm text-gray-700" }, item.desc[2]),
                                    React.createElement("div", { className: "text-sm text-gray-700" }, item.desc[3]),
                                    React.createElement("div", { className: "text-sm text-gray-700" },
                                        "\u83B7\u53D6\u9014\u5F84\uFF1A",
                                        item.tujin))),
                                item.class === '丹药' && (React.createElement("div", { className: "text-sm text-gray-700" },
                                    item.type,
                                    "\uFF1A",
                                    item.type === '修为'
                                        ? item.exp
                                        : item.type === '血气'
                                            ? item.xueqi
                                            : item.type === '血量'
                                                ? item.HP
                                                : '')),
                                item.class === '功法' && (React.createElement("div", { className: "text-sm text-gray-700" },
                                    "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                                    item.修炼加成 * 100,
                                    "%")),
                                (item.class === '道具' || item.class === '草药') && (React.createElement("div", { className: "text-sm text-gray-700" },
                                    "\u63CF\u8FF0\uFF1A",
                                    item.desc))))))))))));
};

export { TuJian as default };
