import React from 'react';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../img/valuables-top.jpg.js';
import fileUrl$3 from '../img/valuables-danyao.jpg.js';
import { LinkStyleSheet } from 'jsxp';

const floors = [
    { name: '#功法楼', type: '功法' },
    { name: '#丹药楼', type: '丹药' },
    { name: '#装备楼', type: '装备' },
    { name: '#道具楼', type: '道具' },
    { name: '#仙宠楼', type: '仙宠' }
];
const FloorSection = ({ name, type }) => (React.createElement("div", { className: "rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center" },
    React.createElement("div", { className: "text-xl font-bold text-blue-700 mb-2" }, name),
    React.createElement("div", { className: "text-base text-gray-600 mb-1" },
        "\u7C7B\u578B: ",
        type),
    React.createElement("div", { className: "text-base text-green-600" },
        "\u67E5\u770B\u5168\u90E8",
        type,
        "\u4EF7\u683C")));
const Valuables = () => {
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
            React.createElement("div", { className: "min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center py-6" },
                React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                    React.createElement("div", { className: "text-3xl font-bold text-yellow-700 mb-6 text-center drop-shadow" }, "#\u4E07\u5B9D\u697C"),
                    React.createElement("div", { className: "w-full h-64 rounded-xl mb-6 bg-cover bg-center", style: { backgroundImage: `url('${fileUrl$2}')` } }),
                    React.createElement("div", { className: "rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center" },
                        React.createElement("div", { className: "text-xl font-bold text-blue-700 mb-2" }, "\u4FEE\u4ED9\u754C\u6700\u5927\u7684\u5F53\u94FA"),
                        React.createElement("div", { className: "text-base text-gray-600 mb-1" }, "\u6C47\u805A\u5929\u4E0B\u6240\u6709\u7269\u54C1"),
                        React.createElement("div", { className: "text-base text-green-600" }, "\u5FEB\u53BB\u79D8\u5883\u5386\u7EC3\u83B7\u5F97\u795E\u5668\u5427")),
                    floors.map((floor, index) => (React.createElement(FloorSection, { key: index, name: floor.name, type: floor.type }))),
                    React.createElement("div", { className: "w-full h-32 rounded-xl mt-6 bg-cover bg-center", style: { backgroundImage: `url('${fileUrl$3}')` } }))))));
};

export { Valuables as default };
