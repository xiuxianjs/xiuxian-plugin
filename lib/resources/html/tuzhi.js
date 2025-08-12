import React from 'react';
import fileUrl$2 from '../img/fairyrealm.jpg.js';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import { LinkStyleSheet } from 'jsxp';

const Tuzhi = ({ tuzhi_list }) => {
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
                        React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u56FE\u7EB8"),
                        React.createElement("div", { className: "text-base text-gray-600 mb-1" }, "\u70BC\u5236\u6307\u4EE4\uFF1A#\u6253\u9020+\u6B66\u5668\u540D"),
                        React.createElement("div", { className: "text-base text-green-600 mb-4" }, "\u70BC\u5236\u6210\u529F\u7387 = \u70BC\u5236\u6210\u529F\u7387 + \u73A9\u5BB6\u804C\u4E1A\u7B49\u7EA7\u6210\u529F\u7387"),
                        React.createElement("div", { className: "w-full" }, tuzhi_list?.map((item, index) => (React.createElement("div", { key: index, className: "border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4" },
                            React.createElement("div", { className: "flex items-center justify-between mb-2" },
                                React.createElement("span", { className: "font-bold text-blue-800 text-lg" }, item.name),
                                React.createElement("span", { className: "text-sm text-gray-700" },
                                    "\u57FA\u7840\u6210\u529F\u7387 ",
                                    ~~(item.rate * 100),
                                    "%")),
                            React.createElement("div", { className: "flex flex-wrap gap-2" }, item.materials?.map((material, idx) => (React.createElement("span", { key: idx, className: "inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold" },
                                material.name,
                                " \u00D7 ",
                                material.amount))))))))))))));
};

export { Tuzhi as default };
