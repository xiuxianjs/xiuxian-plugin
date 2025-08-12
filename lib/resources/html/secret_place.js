import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/road.jpg.js';

const SecretPlace = ({ didian_list }) => {
    return (React.createElement(HTML, { className: "min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8", style: {
            backgroundImage: `url('${fileUrl}')`,
            backgroundSize: 'cover'
        } },
        React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
            React.createElement("div", { className: "rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center" },
                React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u79D8\u5883"),
                React.createElement("div", { className: "text-base text-gray-600 mb-1" }, "\u964D\u4E34\u6307\u4EE4\uFF1A#\u964D\u4E34\u79D8\u5883+\u79D8\u5883\u540D"),
                React.createElement("div", { className: "text-base text-gray-600 mb-4" }, "\u7B5B\u9009\u6307\u4EE4\uFF1A#\u79D8\u5883+\u7C7B\u578B\uFF08\u88C5\u5907/\u4E39\u836F/\u8349\u836F/\u529F\u6CD5\uFF09")),
            didian_list?.map((item, index) => (React.createElement("div", { key: index, className: "rounded-xl shadow bg-white/70 p-4 mb-6 flex flex-col items-center", style: {
                    backgroundImage: `url('${fileUrl$1}')`,
                    backgroundSize: 'cover'
                } },
                React.createElement("div", { className: "flex items-center justify-between w-full mb-2" },
                    React.createElement("span", { className: "font-bold text-blue-800 text-lg" },
                        "\u3010",
                        item.Grade,
                        "\u3011",
                        item.name),
                    React.createElement("span", { className: "text-sm text-green-700" },
                        item.Price,
                        "\u7075\u77F3")),
                React.createElement("div", { className: "w-full space-y-2" },
                    React.createElement("div", null,
                        React.createElement("span", { className: "font-semibold text-gray-700" }, "\u4F4E\u7EA7\u5956\u52B1\uFF1A"),
                        React.createElement("span", { className: "flex flex-wrap gap-2 ml-2" }, item.one?.map((thing, idx) => (React.createElement("span", { key: idx, className: "inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold" }, thing.name))))),
                    React.createElement("div", null,
                        React.createElement("span", { className: "font-semibold text-gray-700" }, "\u4E2D\u7EA7\u5956\u52B1\uFF1A"),
                        React.createElement("span", { className: "flex flex-wrap gap-2 ml-2" }, item.two?.map((thing, idx) => (React.createElement("span", { key: idx, className: "inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold" }, thing.name))))),
                    React.createElement("div", null,
                        React.createElement("span", { className: "font-semibold text-gray-700" }, "\u9AD8\u7EA7\u5956\u52B1\uFF1A"),
                        React.createElement("span", { className: "flex flex-wrap gap-2 ml-2" }, item.three?.map((thing, idx) => (React.createElement("span", { key: idx, className: "inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold" }, thing.name))))))))))));
};

export { SecretPlace as default };
