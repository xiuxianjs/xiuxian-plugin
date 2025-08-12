import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/state.jpg.js';

const Shenbing = ({ newwupin }) => {
    return (React.createElement(HTML, { className: "min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8", style: {
            backgroundImage: `url('${fileUrl}')`,
            backgroundSize: 'cover'
        } },
        React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
            React.createElement("div", { className: "rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center" },
                React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u795E\u5175\u699C")),
            newwupin?.map((item, index) => (React.createElement("div", { key: index, className: "rounded-xl shadow bg-white/70 p-4 mb-6 flex flex-col items-center" },
                React.createElement("div", { className: "text-lg font-semibold text-blue-800 mb-2" },
                    "No.",
                    index + 1),
                React.createElement("div", { className: "w-full flex flex-col gap-1 text-base text-gray-700" },
                    React.createElement("div", null,
                        "\u5175\u5668\u540D\uFF1A",
                        React.createElement("span", { className: "font-bold text-blue-700" }, item.name)),
                    React.createElement("div", null,
                        "\u7C7B\u522B\uFF1A",
                        item.type),
                    React.createElement("div", null,
                        "\u7F14\u9020\u8005\uFF1A",
                        item.制作者),
                    React.createElement("div", null,
                        "\u6301\u5175\u8005\uFF1A",
                        item.使用者),
                    React.createElement("div", null,
                        "\u7075\u97F5\u503C\uFF1A",
                        React.createElement("span", { className: "font-bold text-green-700" }, item.评分)))))))));
};

export { Shenbing as default };
