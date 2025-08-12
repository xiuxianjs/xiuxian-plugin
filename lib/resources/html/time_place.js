import React from 'react';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import { LinkStyleSheet } from 'jsxp';
import fileUrl$2 from '../img/fairyrealm.jpg.js';

const TimePlace = ({ didian_list }) => {
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
                        React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u4ED9\u5E9C"),
                        React.createElement("div", { className: "text-base text-gray-600 mb-4" }, "\u6307\u4EE4\uFF1A#\u63A2\u7D22\u4ED9\u5E9C"),
                        didian_list?.map((item, index) => (React.createElement("div", { key: index, className: "border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4 w-full" },
                            React.createElement("div", { className: "flex items-center justify-between mb-2" },
                                React.createElement("span", { className: "font-bold text-blue-800 text-lg" },
                                    "\u3010",
                                    item.Grade,
                                    "\u3011",
                                    item.name),
                                React.createElement("span", { className: "text-sm text-green-700" },
                                    item.Price,
                                    "\u7075\u77F3")),
                            React.createElement("div", { className: "space-y-2" },
                                React.createElement("div", null,
                                    React.createElement("span", { className: "font-semibold text-gray-700" }, "\u4F4E\u7EA7\u5956\u52B1\uFF1A"),
                                    React.createElement("span", { className: "flex flex-wrap gap-2 ml-2" }, item.one?.map((thing, idx) => (React.createElement("span", { key: idx, className: "inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold" }, thing.name))))),
                                React.createElement("div", null,
                                    React.createElement("span", { className: "font-semibold text-gray-700" }, "\u4E2D\u7EA7\u5956\u52B1\uFF1A"),
                                    React.createElement("span", { className: "flex flex-wrap gap-2 ml-2" }, item.two?.map((thing, idx) => (React.createElement("span", { key: idx, className: "inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold" }, thing.name))))),
                                React.createElement("div", null,
                                    React.createElement("span", { className: "font-semibold text-gray-700" }, "\u9AD8\u7EA7\u5956\u52B1\uFF1A"),
                                    React.createElement("span", { className: "flex flex-wrap gap-2 ml-2" }, item.three?.map((thing, idx) => (React.createElement("span", { key: idx, className: "inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold" }, thing.name)))))))))))))));
};

export { TimePlace as default };
