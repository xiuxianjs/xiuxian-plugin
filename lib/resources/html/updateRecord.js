import React from 'react';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import { LinkStyleSheet } from 'jsxp';

var updateRecord = ({ Record }) => {
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
            React.createElement("div", { className: "min-h-screen bg-gradient-to-b from-gray-100 to-blue-100 flex flex-col items-center py-8" },
                React.createElement("div", { className: "w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8" },
                    React.createElement("h2", { className: "text-3xl font-bold text-blue-700 mb-6 text-center" }, "\u66F4\u65B0\u65E5\u5FD7"),
                    React.createElement("ul", null, Record.map((item, index) => (React.createElement("li", { key: item.id || index, className: "flex items-start gap-4 mb-6 border-b pb-6 last:border-b-0 last:pb-0" },
                        React.createElement("div", { className: "flex flex-col items-center mr-2" },
                            item.user.avatar ? (React.createElement("img", { src: item.user.avatar, alt: item.user.name, className: "w-12 h-12 rounded-full object-cover border" })) : (React.createElement("div", { className: "w-12 h-12 rounded-full bg-blue-300 flex items-center justify-center text-xl font-bold text-white" }, item.user.name.charAt(0))),
                            React.createElement("span", { className: "text-sm text-gray-700 mt-2" }, item.user.name)),
                        React.createElement("div", { className: "flex-1" },
                            React.createElement("p", { className: "text-base text-gray-800 mb-2" }, item.text),
                            React.createElement("time", { className: "text-xs text-gray-500" }, item.time)))))))))));
};

export { updateRecord as default };
