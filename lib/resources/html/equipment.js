import React from 'react';
import HTML from './HTML.js';

const qualityGradients = [
    'from-gray-400 to-gray-200',
    'from-green-400 to-lime-300',
    'from-blue-400 to-cyan-300',
    'from-purple-400 to-pink-300',
    'from-orange-400 to-amber-300',
    'from-red-400 to-pink-300',
    'from-yellow-300 to-amber-100'
];
const EquipmentCard = ({ title, equipment, qualities, renderStats }) => {
    const qualityStyle = qualityGradients[equipment.pinji] || qualityGradients[0];
    const stats = renderStats(equipment);
    return (React.createElement("article", { className: `rounded-2xl p-4 flex flex-col gap-2 
      bg-white/10 backdrop-blur-lg ring-2 shadow-xl 
      ring-white/20 hover:scale-[1.02] hover:shadow-2xl 
      transition-all duration-300 
      border border-white/20 relative overflow-hidden` },
        React.createElement("div", { className: `absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${qualityStyle}` }),
        React.createElement("h2", { className: "text-xl font-extrabold tracking-wide mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 drop-shadow-md" }, title),
        React.createElement("div", { className: "text-lg font-semibold flex items-center gap-2" },
            React.createElement("span", null, equipment.name),
            React.createElement("span", { className: `text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${qualityStyle} text-black font-bold shadow-inner` }, qualities[equipment.pinji])),
        React.createElement("div", { className: "text-sm flex gap-1 items-center" },
            React.createElement("span", { className: "opacity-70" }, "\u5C5E\u6027\uFF1A"),
            React.createElement("span", { className: "font-semibold text-emerald-300" }, stats.attribute)),
        React.createElement("div", { className: "text-sm flex gap-1 items-center" },
            React.createElement("span", { className: "text-red-300" }, "\u2694 \u653B\u51FB\uFF1A"),
            React.createElement("span", { className: "font-semibold" }, stats.atk)),
        React.createElement("div", { className: "text-sm flex gap-1 items-center" },
            React.createElement("span", { className: "text-blue-300" }, "\uD83D\uDEE1 \u9632\u5FA1\uFF1A"),
            React.createElement("span", { className: "font-semibold" }, stats.def)),
        React.createElement("div", { className: "text-sm flex gap-1 items-center" },
            React.createElement("span", { className: "text-pink-300" }, "\u2764\uFE0F \u8840\u91CF\uFF1A"),
            React.createElement("span", { className: "font-semibold" }, stats.HP)),
        React.createElement("div", { className: "text-sm flex gap-1 items-center" },
            React.createElement("span", { className: "text-yellow-300" }, "\u2728 \u66B4\u51FB\u7387\uFF1A"),
            React.createElement("span", { className: "font-semibold" },
                (equipment.bao * 100).toFixed(0),
                "%"))));
};
const PlayerStats = ({ nickname, player_maxHP, player_atk, player_def, player_bao }) => (React.createElement("article", { className: "rounded-2xl p-4 bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-2xl transition" },
    React.createElement("h2", { className: "text-xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400" }, "[\u5C5E\u6027\u677F]"),
    React.createElement("div", { className: "text-base mb-1" },
        "\u9053\u53F7\uFF1A",
        React.createElement("span", { className: "font-semibold text-emerald-200" }, nickname)),
    React.createElement("div", { className: "text-sm text-pink-200" },
        "\u2764\uFE0F \u8840\u91CF\uFF1A",
        React.createElement("span", { className: "font-semibold" }, player_maxHP.toFixed(0))),
    React.createElement("div", { className: "text-sm text-red-200" },
        "\u2694 \u653B\u51FB\uFF1A",
        React.createElement("span", { className: "font-semibold" }, player_atk.toFixed(0))),
    React.createElement("div", { className: "text-sm text-blue-200" },
        "\uD83D\uDEE1 \u9632\u5FA1\uFF1A",
        React.createElement("span", { className: "font-semibold" }, player_def.toFixed(0))),
    React.createElement("div", { className: "text-sm text-yellow-200" },
        "\u2728 \u66B4\u51FB\u7387\uFF1A",
        React.createElement("span", { className: "font-semibold" },
            player_bao.toFixed(0),
            "%"))));
const Equipment = ({ arms = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, armor = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, treasure = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, nickname, player_maxHP, player_atk, player_def, player_bao }) => {
    const qualities = ['劣', '普', '优', '精', '极', '绝', '顶'];
    const elements = ['金', '木', '土', '水', '火'];
    const renderStats = (item) => {
        const isAbsolute = item.atk > 10 || item.def > 10 || item.HP > 10;
        return {
            attribute: isAbsolute ? '无' : elements[item.id - 1],
            atk: isAbsolute ? item.atk.toFixed(0) : (item.atk * 100).toFixed(0) + '%',
            def: isAbsolute ? item.def.toFixed(0) : (item.def * 100).toFixed(0) + '%',
            HP: isAbsolute ? item.HP.toFixed(0) : (item.HP * 100).toFixed(0) + '%'
        };
    };
    return (React.createElement(HTML, { className: "min-h-screen w-full bg-black bg-opacity-40 p-4 md:p-8 bg-top bg-cover relative" },
        React.createElement("div", { className: "absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:20px_20px]" }),
        React.createElement("main", { className: "relative z-10 max-w-4xl mx-auto grid gap-8 md:grid-cols-2" },
            React.createElement(EquipmentCard, { title: "[\u6B66\u5668]", equipment: arms, qualities: qualities, renderStats: renderStats }),
            React.createElement(EquipmentCard, { title: "[\u62A4\u5177]", equipment: armor, qualities: qualities, renderStats: renderStats }),
            React.createElement(EquipmentCard, { title: "[\u6CD5\u5B9D]", equipment: treasure, qualities: qualities, renderStats: renderStats }),
            React.createElement(PlayerStats, { nickname: nickname, player_maxHP: player_maxHP, player_atk: player_atk, player_def: player_def, player_bao: player_bao }))));
};

export { Equipment as default };
