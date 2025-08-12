import React from 'react';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import { LinkStyleSheet } from 'jsxp';
import fileUrl$2 from '../img/najie.jpg.js';

const Temp = ({ temp }) => {
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
            React.createElement("div", { className: "min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center py-8", style: {
                    backgroundImage: `url('${fileUrl$2}')`,
                    backgroundSize: 'cover'
                } },
                React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                    React.createElement("div", { className: "rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center" }, temp &&
                        temp.map((item, index) => (React.createElement("div", { key: index, className: "w-full mb-4" },
                            React.createElement("div", { className: "text-base text-gray-800 font-medium mb-2" }, item),
                            React.createElement("div", { className: "w-full border-b border-dashed border-gray-400" }))))))))));
};

export { Temp as default };
