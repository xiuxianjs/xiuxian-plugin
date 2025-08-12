import React from 'react';
import HTML from './HTML.js';

const floors = [
    {
        name: '功法楼',
        type: '功法',
        icon: '📚',
        color: 'from-purple-400 to-purple-600',
        borderColor: 'border-purple-400/30'
    },
    {
        name: '丹药楼',
        type: '丹药',
        icon: '🧪',
        color: 'from-red-400 to-red-600',
        borderColor: 'border-red-400/30'
    },
    {
        name: '装备楼',
        type: '装备',
        icon: '⚔️',
        color: 'from-blue-400 to-blue-600',
        borderColor: 'border-blue-400/30'
    },
    {
        name: '道具楼',
        type: '道具',
        icon: '🎒',
        color: 'from-green-400 to-green-600',
        borderColor: 'border-green-400/30'
    },
    {
        name: '仙宠楼',
        type: '仙宠',
        icon: '🐉',
        color: 'from-yellow-400 to-yellow-600',
        borderColor: 'border-yellow-400/30'
    }
];
const FloorSection = ({ name, type, icon, color, borderColor }) => (React.createElement("div", { className: "relative group" },
    React.createElement("div", { className: `absolute inset-0 bg-gradient-to-r ${color.replace('400', '500')}/20 rounded-2xl blur-sm` }),
    React.createElement("div", { className: `relative backdrop-blur-md bg-white/5 rounded-2xl border ${borderColor} p-6 hover:border-opacity-60 transition-all duration-300` },
        React.createElement("div", { className: "flex flex-col items-center gap-4" },
            React.createElement("div", { className: `w-16 h-16 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center border border-white/20` },
                React.createElement("span", { className: "text-3xl" }, icon)),
            React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "text-xl font-bold text-white mb-2" }, name),
                React.createElement("div", { className: "text-sm text-gray-300 mb-3" },
                    "\u7C7B\u578B: ",
                    type),
                React.createElement("div", { className: "inline-block px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm" },
                    React.createElement("span", { className: "text-blue-200 text-sm font-medium" },
                        "\u67E5\u770B\u5168\u90E8",
                        type,
                        "\u4EF7\u683C")))))));
const Valuables = () => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 relative overflow-hidden" },
            React.createElement("div", { className: "absolute inset-0 opacity-10" },
                React.createElement("div", { className: "absolute top-10 left-10 w-32 h-32 border border-amber-400 rounded-full" }),
                React.createElement("div", { className: "absolute top-32 right-20 w-24 h-24 border border-yellow-400 rounded-full" }),
                React.createElement("div", { className: "absolute bottom-20 left-1/4 w-16 h-16 border border-orange-400 rounded-full" }),
                React.createElement("div", { className: "absolute bottom-40 right-1/3 w-20 h-20 border border-red-400 rounded-full" })),
            React.createElement("div", { className: "relative z-10 container mx-auto px-4 py-8" },
                React.createElement("div", { className: "text-center mb-12" },
                    React.createElement("div", { className: "inline-block relative" },
                        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl blur-lg opacity-50" }),
                        React.createElement("div", { className: "relative bg-gradient-to-r from-amber-600 to-yellow-600 rounded-2xl px-8 py-4 border border-amber-400/30" },
                            React.createElement("h1", { className: "text-3xl font-bold text-white tracking-wider" }, "\uD83C\uDFDB\uFE0F \u4E07\u5B9D\u697C \uD83C\uDFDB\uFE0F"))),
                    React.createElement("div", { className: "mt-4 text-amber-200 text-sm" }, "\uD83D\uDC8E \u4FEE\u4ED9\u754C\u6700\u5927\u7684\u5F53\u94FA \uD83D\uDC8E")),
                React.createElement("div", { className: "max-w-4xl mx-auto mb-12" },
                    React.createElement("div", { className: "relative" },
                        React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-3xl blur-xl" }),
                        React.createElement("div", { className: "relative backdrop-blur-sm bg-white/10 rounded-3xl border border-amber-400/30 p-8" },
                            React.createElement("div", { className: "text-center" },
                                React.createElement("div", { className: "text-2xl font-extrabold text-amber-300 mb-4" }, "\uD83C\uDFDB\uFE0F \u4E07\u5B9D\u697C"),
                                React.createElement("div", { className: "text-lg font-bold text-white mb-2" }, "\u4FEE\u4ED9\u754C\u6700\u5927\u7684\u5F53\u94FA"),
                                React.createElement("div", { className: "text-base text-gray-300 mb-4" }, "\u6C47\u805A\u5929\u4E0B\u6240\u6709\u7269\u54C1"),
                                React.createElement("div", { className: "inline-block px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm" },
                                    React.createElement("span", { className: "text-blue-200 text-sm font-medium" }, "\uD83D\uDDFA\uFE0F \u5FEB\u53BB\u79D8\u5883\u5386\u7EC3\u83B7\u5F97\u795E\u5668\u5427 \uD83D\uDDFA\uFE0F")))))),
                React.createElement("div", { className: "max-w-6xl mx-auto" },
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" }, floors.map((floor, index) => (React.createElement(FloorSection, { key: index, name: floor.name, type: floor.type, icon: floor.icon, color: floor.color, borderColor: floor.borderColor }))))),
                React.createElement("div", { className: "text-center mt-12" },
                    React.createElement("div", { className: "inline-block px-6 py-3 bg-gradient-to-r from-amber-600/20 to-yellow-600/20 rounded-full border border-amber-400/30 backdrop-blur-sm" },
                        React.createElement("span", { className: "text-amber-200 text-sm" }, "\uD83D\uDC8E \u4E07\u5B9D\u697C\u4E2D\u85CF\u4E07\u5B9D\uFF0C\u4FEE\u4ED9\u8DEF\u4E0A\u5BFB\u4ED9\u7F18 \uD83D\uDC8E")))))));
};

export { Valuables as default };
