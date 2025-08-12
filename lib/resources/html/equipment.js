import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/equipment.jpg.js';

const EquipmentCard = ({ title, equipment, qualities, renderStats }) => (React.createElement("article", { className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card hover:ring-brand-accent hover:bg-white/10 transition" },
    React.createElement("h2", { className: "text-lg font-bold text-brand-accent tracking-wide mb-1" }, title),
    React.createElement("div", { className: "text-white/90 text-base font-semibold" },
        equipment.name,
        ' ',
        React.createElement("span", { className: "text-brand-accent" },
            "(",
            qualities[equipment.pinji],
            ")")),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u5C5E\u6027\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" }, renderStats(equipment).attribute)),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u653B\u51FB\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" }, renderStats(equipment).atk)),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u9632\u5FA1\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" }, renderStats(equipment).def)),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u8840\u91CF\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" }, renderStats(equipment).HP)),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u66B4\u51FB\u7387\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" },
            (equipment.bao * 100).toFixed(0),
            "%"))));
const PlayerStats = ({ nickname, player_maxHP, player_atk, player_def, player_bao }) => (React.createElement("article", { className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 flex flex-col gap-2 shadow-card" },
    React.createElement("h2", { className: "text-lg font-bold text-white tracking-wide mb-1" }, "[\u5C5E\u6027\u677F]"),
    React.createElement("div", { className: "text-base text-white/90 font-semibold" },
        "\u9053\u53F7\uFF1A",
        React.createElement("span", { className: "text-brand-accent" }, nickname)),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u8840\u91CF\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" }, player_maxHP.toFixed(0))),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u653B\u51FB\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" }, player_atk.toFixed(0))),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u9632\u5FA1\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" }, player_def.toFixed(0))),
    React.createElement("div", { className: "text-sm text-white/80" },
        "\u66B4\u51FB\u7387\uFF1A",
        React.createElement("span", { className: "font-semibold text-brand-accent" },
            player_bao.toFixed(0),
            "%"))));
const Equipment = ({ arms = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, armor = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, treasure = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, nickname, player_maxHP, player_atk, player_def, player_bao }) => {
    const qualities = ['劣', '普', '优', '精', '极', '绝', '顶'];
    const elements = ['金', '木', '土', '水', '火'];
    const renderStats = item => {
        const isAbsolute = item.atk > 10 || item.def > 10 || item.HP > 10;
        return {
            attribute: isAbsolute ? '无' : elements[item.id - 1],
            atk: isAbsolute ? item.atk.toFixed(0) : (item.atk * 100).toFixed(0) + '%',
            def: isAbsolute ? item.def.toFixed(0) : (item.def * 100).toFixed(0) + '%',
            HP: isAbsolute ? item.HP.toFixed(0) : (item.HP * 100).toFixed(0) + '%'
        };
    };
    return (React.createElement(HTML, { className: "min-h-screen w-full p-4 md:p-8 bg-top bg-cover", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-4xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2" },
            React.createElement(EquipmentCard, { title: "[\u6B66\u5668]", equipment: arms, qualities: qualities, renderStats: renderStats }),
            React.createElement(EquipmentCard, { title: "[\u62A4\u5177]", equipment: armor, qualities: qualities, renderStats: renderStats }),
            React.createElement(EquipmentCard, { title: "[\u6CD5\u5B9D]", equipment: treasure, qualities: qualities, renderStats: renderStats }),
            React.createElement(PlayerStats, { nickname: nickname, player_maxHP: player_maxHP, player_atk: player_atk, player_def: player_def, player_bao: player_bao }))));
};

export { Equipment as default };
