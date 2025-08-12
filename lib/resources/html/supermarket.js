import React from 'react';
import fileUrl from '../img/fairyrealm.jpg.js';
import HTML from './HTML.js';

const Supermarket = ({ Exchange_list }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: "min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8", style: {
                backgroundImage: `url(${fileUrl})`,
                backgroundSize: 'cover'
            } },
            React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                React.createElement("div", { className: "rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center" },
                    React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u51B2\u6C34\u5802"),
                    React.createElement("div", { className: "text-base text-gray-600 mb-1" }, "\u4E0A\u67B6\u6307\u4EE4\uFF1A#\u4E0A\u67B6+\u7269\u54C1\u540D*\u4EF7\u683C*\u6570\u91CF"),
                    React.createElement("div", { className: "text-base text-gray-600 mb-1" }, "\u9009\u8D2D\u6307\u4EE4\uFF1A#\u9009\u8D2D+\u7F16\u53F7*\u6570\u91CF"),
                    React.createElement("div", { className: "text-base text-gray-600 mb-4" }, "\u4E0B\u67B6\u6307\u4EE4\uFF1A#\u4E0B\u67B6+\u7F16\u53F7"),
                    React.createElement("div", { className: "w-full" }, Exchange_list &&
                        Exchange_list.map((item, index) => (React.createElement("div", { key: index, className: "border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4" },
                            React.createElement("div", { className: "flex items-center justify-between mb-2" },
                                React.createElement("span", { className: "font-bold text-blue-800 text-lg" }, item.name.class === '装备'
                                    ? `【${item.name.class}】${item.name.name}【${item.pinji}】`
                                    : `【${item.name.class}】${item.name.name}`),
                                React.createElement("span", { className: "text-sm text-gray-700" },
                                    "No.",
                                    item.num)),
                            item.name.class === '装备' && (React.createElement("div", { className: "flex flex-wrap gap-2 mb-2" },
                                item.name.atk > 10 ||
                                    item.name.def > 10 ||
                                    item.name.HP > 10 ? (React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "inline-block bg-gray-200 text-gray-900 rounded px-2 py-1 text-xs font-semibold" }, "\u5C5E\u6027:\u65E0"),
                                    React.createElement("span", { className: "inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold" },
                                        "\u653B\u51FB\uFF1A",
                                        item.name.atk.toFixed(0)),
                                    React.createElement("span", { className: "inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold" },
                                        "\u9632\u5FA1\uFF1A",
                                        item.name.def.toFixed(0)),
                                    React.createElement("span", { className: "inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold" },
                                        "\u8840\u91CF\uFF1A",
                                        item.name.HP.toFixed(0)))) : (React.createElement(React.Fragment, null,
                                    React.createElement("span", { className: "inline-block bg-gray-200 text-gray-900 rounded px-2 py-1 text-xs font-semibold" },
                                        "\u5C5E\u6027:",
                                        ['金', '木', '土', '水', '火'][item.name.id - 1]),
                                    React.createElement("span", { className: "inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold" },
                                        "\u653B\u51FB\uFF1A",
                                        (item.name.atk * 100).toFixed(0),
                                        "%"),
                                    React.createElement("span", { className: "inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold" },
                                        "\u9632\u5FA1\uFF1A",
                                        (item.name.def * 100).toFixed(0),
                                        "%"),
                                    React.createElement("span", { className: "inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold" },
                                        "\u8840\u91CF\uFF1A",
                                        (item.name.HP * 100).toFixed(0),
                                        "%"))),
                                React.createElement("span", { className: "inline-block bg-pink-200 text-pink-900 rounded px-2 py-1 text-xs font-semibold" },
                                    "\u66B4\uFF1A",
                                    (item.name.bao * 100).toFixed(0),
                                    "%"))),
                            item.name.class === '仙宠' && (React.createElement("span", { className: "inline-block bg-purple-200 text-purple-900 rounded px-2 py-1 text-xs font-semibold mb-2" },
                                "\u7B49\u7EA7\uFF1A",
                                item.name.等级.toFixed(0))),
                            React.createElement("div", { className: "flex flex-wrap gap-2 mb-2" },
                                React.createElement("span", { className: "inline-block bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs font-semibold" },
                                    "\u5355\u4EF7\uFF1A",
                                    item.price),
                                React.createElement("span", { className: "inline-block bg-green-100 text-green-900 rounded px-2 py-1 text-xs font-semibold" },
                                    "\u6570\u91CF\uFF1A",
                                    item.aconut),
                                React.createElement("span", { className: "inline-block bg-yellow-100 text-yellow-900 rounded px-2 py-1 text-xs font-semibold" },
                                    "\u603B\u4EF7\uFF1A",
                                    item.whole),
                                React.createElement("span", { className: "inline-block bg-gray-100 text-gray-900 rounded px-2 py-1 text-xs font-semibold" },
                                    "QQ\uFF1A",
                                    item.qq)))))))))));
};

export { Supermarket as default };
