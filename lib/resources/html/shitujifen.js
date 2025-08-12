import React from 'react';
import fileUrl from '../img/fairyrealm.jpg.js';
import HTML from './HTML.js';

const Shitujifen = ({ name, jifen, commodities_list }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: " bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8", style: {
                backgroundImage: `url('${fileUrl}')`,
                backgroundSize: 'cover'
            } },
            React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                React.createElement("div", { className: "rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center" },
                    React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u5E08\u5F92\u5546\u5E97"),
                    React.createElement("div", { className: "text-base text-gray-600 mb-1" }, "\u8D2D\u4E70\u6307\u4EE4\uFF1A#\u5E08\u5F92\u5151\u6362+\u7269\u54C1\u540D"),
                    React.createElement("div", { className: "text-base text-green-600 mb-4" },
                        name,
                        "\u7684\u79EF\u5206\uFF1A",
                        jifen),
                    React.createElement("div", { className: "w-full" }, commodities_list?.map((item, index) => (React.createElement("div", { key: index, className: "border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4" },
                        React.createElement("div", { className: "flex items-center justify-between mb-2" },
                            React.createElement("span", { className: "font-bold text-blue-800 text-lg" },
                                "\u3010",
                                item.type,
                                "\u3011",
                                item.name),
                            React.createElement("span", { className: "text-sm text-green-700" },
                                item.积分,
                                "\u79EF\u5206")),
                        item.class === '装备' && (React.createElement("div", { className: "flex flex-wrap gap-2 mb-2" },
                            React.createElement("span", { className: "inline-block bg-blue-200 text-blue-900 rounded px-2 py-1 text-xs font-semibold" },
                                "\u653B\uFF1A",
                                item.atk),
                            React.createElement("span", { className: "inline-block bg-green-200 text-green-900 rounded px-2 py-1 text-xs font-semibold" },
                                "\u9632\uFF1A",
                                item.def),
                            React.createElement("span", { className: "inline-block bg-yellow-200 text-yellow-900 rounded px-2 py-1 text-xs font-semibold" },
                                "\u8840\uFF1A",
                                item.HP),
                            React.createElement("span", { className: "inline-block bg-pink-200 text-pink-900 rounded px-2 py-1 text-xs font-semibold" },
                                "\u66B4\uFF1A",
                                item.bao * 100,
                                "%"))),
                        item.class === '丹药' && (React.createElement("div", { className: "text-sm text-gray-700 mb-2" },
                            "\u6548\u679C\uFF1A",
                            item.exp,
                            item.xueqi)),
                        item.class === '功法' && (React.createElement("div", { className: "text-sm text-gray-700 mb-2" },
                            "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                            (item.修炼加成 * 100).toFixed(0),
                            "%")),
                        (item.class === '道具' || item.class === '草药') && (React.createElement("div", { className: "text-sm text-gray-700 mb-2" },
                            "\u63CF\u8FF0\uFF1A",
                            item.desc)))))))))));
};

export { Shitujifen as default };
