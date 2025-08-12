import React from 'react';
import fileUrl from '../img/najie.jpg.js';
import HTML from './HTML.js';

const Shop = ({ name, level, state, thing = [] }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: " bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center py-8", style: {
                backgroundImage: `url('${fileUrl}')`,
                backgroundSize: 'cover'
            } },
            React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                React.createElement("div", { className: "rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center" },
                    React.createElement("div", { className: "text-2xl font-bold text-yellow-700 mb-2" },
                        "[",
                        name,
                        "]"),
                    React.createElement("div", { className: "text-base text-gray-600 mb-1" },
                        "\u96BE\u5EA6: ",
                        level),
                    React.createElement("div", { className: "text-base text-gray-600 mb-4" },
                        "\u72B6\u6001: ",
                        state),
                    React.createElement("div", { className: "w-full" }, thing.map((item, index) => (React.createElement("div", { key: index, className: "flex justify-between items-center border-b py-2" },
                        React.createElement("span", { className: "text-base text-gray-800 font-medium" }, item.name),
                        React.createElement("span", { className: "text-sm text-gray-500" },
                            "\u6570\u91CF: ",
                            item.数量))))))))));
};

export { Shop as default };
