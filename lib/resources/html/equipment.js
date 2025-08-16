import React from 'react';
import classNames from 'classnames';
import HTML from './HTML.js';

const qualityConfig = [
    {
        name: '劣',
        gradient: 'from-gray-500 to-gray-300',
        glow: 'shadow-gray-500/30',
        border: 'border-gray-400'
    },
    {
        name: '普',
        gradient: 'from-green-500 to-emerald-300',
        glow: 'shadow-green-500/40',
        border: 'border-green-400'
    },
    {
        name: '优',
        gradient: 'from-blue-500 to-cyan-300',
        glow: 'shadow-blue-500/50',
        border: 'border-blue-400'
    },
    {
        name: '精',
        gradient: 'from-purple-500 to-pink-300',
        glow: 'shadow-purple-500/60',
        border: 'border-purple-400'
    },
    {
        name: '极',
        gradient: 'from-orange-500 to-amber-300',
        glow: 'shadow-orange-500/70',
        border: 'border-orange-400'
    },
    {
        name: '绝',
        gradient: 'from-red-500 to-pink-400',
        glow: 'shadow-red-500/80',
        border: 'border-red-400'
    },
    {
        name: '顶',
        gradient: 'from-yellow-400 to-amber-200',
        glow: 'shadow-yellow-400/90',
        border: 'border-yellow-300'
    }
];
const ElementIcons = {
    金: '⚜️',
    木: '🌿',
    土: '🏔️',
    水: '💧',
    火: '🔥'
};
const EquipmentCard = ({ title, equipment, renderStats }) => {
    const quality = qualityConfig[equipment.pinji] || qualityConfig[0];
    const stats = renderStats(equipment);
    const elementIcon = ElementIcons[stats.attribute] || '⚔️';
    return (React.createElement("article", { className: "group relative" },
        React.createElement("div", { className: classNames('absolute inset-0 rounded-2xl bg-gradient-to-r p-[2px] animate-pulse', quality.gradient) },
            React.createElement("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" })),
        React.createElement("div", { className: classNames('relative rounded-2xl p-6 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl', 'border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500', 'hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white/10 hover:to-white/15', quality.glow, 'hover:shadow-lg') },
            React.createElement("div", { className: "absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" }),
            React.createElement("div", { className: "absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" }),
            React.createElement("div", { className: "flex items-center justify-between mb-4" },
                React.createElement("h2", { className: "text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-lg" }, title),
                React.createElement("div", { className: classNames('w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg', quality.gradient) },
                    React.createElement("span", { className: "text-2xl" }, elementIcon))),
            React.createElement("div", { className: "mb-4 p-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10" },
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("span", { className: "text-lg font-bold text-white/90" }, equipment.name),
                    React.createElement("span", { className: classNames('px-3 py-1 rounded-full bg-gradient-to-r text-black font-black text-sm shadow-inner border border-white/30', quality.gradient) }, quality.name))),
            React.createElement("div", { className: "space-y-3" },
                React.createElement("div", { className: "flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-400/20" },
                    React.createElement("span", { className: "text-emerald-300 font-medium" }, "\u5C5E\u6027\uFF1A"),
                    React.createElement("span", { className: "font-bold text-emerald-200 flex items-center gap-1" },
                        elementIcon,
                        " ",
                        stats.attribute)),
                React.createElement("div", { className: "flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-400/20" },
                    React.createElement("span", { className: "text-red-300 font-medium" }, "\u2694\uFE0F \u653B\u51FB\uFF1A"),
                    React.createElement("span", { className: "font-bold text-red-200" }, stats.atk)),
                React.createElement("div", { className: "flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-400/20" },
                    React.createElement("span", { className: "text-blue-300 font-medium" }, "\uD83D\uDEE1\uFE0F \u9632\u5FA1\uFF1A"),
                    React.createElement("span", { className: "font-bold text-blue-200" }, stats.def)),
                React.createElement("div", { className: "flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-pink-500/10 to-pink-600/10 border border-pink-400/20" },
                    React.createElement("span", { className: "text-pink-300 font-medium" }, "\u2764\uFE0F \u8840\u91CF\uFF1A"),
                    React.createElement("span", { className: "font-bold text-pink-200" }, stats.HP)),
                React.createElement("div", { className: "flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-400/20" },
                    React.createElement("span", { className: "text-yellow-300 font-medium" }, "\u2728 \u66B4\u51FB\u7387\uFF1A"),
                    React.createElement("span", { className: "font-bold text-yellow-200" },
                        (equipment.bao * 100).toFixed(0),
                        "%"))))));
};
const PlayerStats = ({ nickname, player_maxHP, player_atk, player_def, player_bao }) => (React.createElement("article", { className: "group relative" },
    React.createElement("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-[2px] animate-pulse" },
        React.createElement("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" })),
    React.createElement("div", { className: "relative rounded-2xl p-6 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-xl \n      border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 \n      hover:scale-[1.02] hover:bg-gradient-to-br hover:from-cyan-500/15 hover:to-purple-500/15" },
        React.createElement("div", { className: "absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" }),
        React.createElement("div", { className: "absolute top-4 right-4 w-6 h-6 border-2 border-cyan-400/50 rounded-full animate-spin", style: { animationDuration: '3s' } }),
        React.createElement("h2", { className: "text-2xl font-black mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-lg tracking-wider" }, "\u2728 \u4FEE\u4ED9\u5C5E\u6027 \u2728"),
        React.createElement("div", { className: "space-y-4" },
            React.createElement("div", { className: "p-3 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-600/15 border border-emerald-400/30" },
                React.createElement("div", { className: "text-center" },
                    React.createElement("span", { className: "text-emerald-200 font-medium" }, "\u9053\u53F7"),
                    React.createElement("div", { className: "text-xl font-bold text-emerald-100 mt-1" }, nickname))),
            React.createElement("div", { className: "grid grid-cols-2 gap-3" },
                React.createElement("div", { className: "p-3 rounded-xl bg-gradient-to-r from-pink-500/15 to-pink-600/15 border border-pink-400/30 text-center" },
                    React.createElement("div", { className: "text-pink-300 text-sm font-medium" }, "\u2764\uFE0F \u8840\u91CF"),
                    React.createElement("div", { className: "text-lg font-bold text-pink-200" }, player_maxHP.toFixed(0))),
                React.createElement("div", { className: "p-3 rounded-xl bg-gradient-to-r from-red-500/15 to-red-600/15 border border-red-400/30 text-center" },
                    React.createElement("div", { className: "text-red-300 text-sm font-medium" }, "\u2694\uFE0F \u653B\u51FB"),
                    React.createElement("div", { className: "text-lg font-bold text-red-200" }, player_atk.toFixed(0))),
                React.createElement("div", { className: "p-3 rounded-xl bg-gradient-to-r from-blue-500/15 to-blue-600/15 border border-blue-400/30 text-center" },
                    React.createElement("div", { className: "text-blue-300 text-sm font-medium" }, "\uD83D\uDEE1\uFE0F \u9632\u5FA1"),
                    React.createElement("div", { className: "text-lg font-bold text-blue-200" }, player_def.toFixed(0))),
                React.createElement("div", { className: "p-3 rounded-xl bg-gradient-to-r from-yellow-500/15 to-yellow-600/15 border border-yellow-400/30 text-center" },
                    React.createElement("div", { className: "text-yellow-300 text-sm font-medium" }, "\u2728 \u66B4\u51FB\u7387"),
                    React.createElement("div", { className: "text-lg font-bold text-yellow-200" },
                        player_bao.toFixed(0),
                        "%")))))));
const Equipment = ({ arms = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, armor = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, treasure = { name: '无', pinji: 0, id: 1, atk: 0, def: 0, HP: 0, bao: 0 }, nickname, player_maxHP, player_atk, player_def, player_bao }) => {
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
    return (React.createElement(HTML, { className: " w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 relative overflow-hidden" },
        React.createElement("div", { className: "absolute inset-0" },
            React.createElement("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:30px_30px] animate-pulse" }),
            React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-pulse", style: { animationDuration: '4s' } }),
            React.createElement("div", { className: "absolute top-10 left-10 text-purple-400/20 text-4xl animate-bounce", style: { animationDuration: '3s' } }, "\u262F"),
            React.createElement("div", { className: "absolute top-20 right-20 text-cyan-400/20 text-3xl animate-bounce", style: { animationDuration: '2.5s' } }, "\u26A1"),
            React.createElement("div", { className: "absolute bottom-20 left-20 text-yellow-400/20 text-3xl animate-bounce", style: { animationDuration: '3.5s' } }, "\uD83C\uDF1F"),
            React.createElement("div", { className: "absolute bottom-10 right-10 text-pink-400/20 text-4xl animate-bounce", style: { animationDuration: '2s' } }, "\uD83D\uDCAB")),
        React.createElement("main", { className: "relative z-10 max-w-6xl mx-auto" },
            React.createElement("div", { className: "text-center mb-8" },
                React.createElement("h1", { className: "text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-2xl mb-2 tracking-wider" }, "\u88C5\u5907\u754C\u9762"),
                React.createElement("div", { className: "w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full shadow-lg" })),
            React.createElement("div", { className: "grid gap-6 md:grid-cols-2 lg:grid-cols-2" },
                React.createElement(EquipmentCard, { title: "\uD83D\uDDE1\uFE0F \u6B66\u5668", equipment: arms, renderStats: renderStats }),
                React.createElement(EquipmentCard, { title: "\uD83D\uDEE1\uFE0F \u62A4\u5177", equipment: armor, renderStats: renderStats }),
                React.createElement(EquipmentCard, { title: "\uD83D\uDD2E \u6CD5\u5B9D", equipment: treasure, renderStats: renderStats }),
                React.createElement(PlayerStats, { nickname: nickname, player_maxHP: player_maxHP, player_atk: player_atk, player_def: player_def, player_bao: player_bao })))));
};

export { Equipment as default };
