import React from 'react';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import { LinkStyleSheet } from 'jsxp';
import fileUrl$2 from '../img/fairyrealm.jpg.js';

const Talent = ({ talent_list = [] }) => {
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
                        React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u7075\u6839\u5217\u8868"),
                        React.createElement("div", { className: "w-full" }, talent_list.map((item, index) => (React.createElement("div", { key: index, className: "border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4" },
                            React.createElement("div", { className: "font-bold text-blue-800 text-lg mb-2" },
                                "\u3010",
                                item.type,
                                "\u3011",
                                item.name),
                            React.createElement("div", { className: "flex flex-wrap gap-2" },
                                React.createElement("span", { className: "inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold" },
                                    "\u4FEE\u70BC\u6548\u7387\uFF1A",
                                    item.eff * 100,
                                    "%"),
                                React.createElement("span", { className: "inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold" },
                                    "\u989D\u5916\u589E\u4F24\uFF1A",
                                    item.法球倍率 * 100,
                                    "%"))))))))))));
};

export { Talent as default };
