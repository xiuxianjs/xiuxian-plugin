import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './equipment.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/equipment.jpg.js';

const EquipmentCard = ({ title, equipment, qualities, renderStats }) => (React.createElement("div", { className: "equipment-card" },
    React.createElement("div", { className: "user_font_title" }, title),
    React.createElement("div", { className: "user_font" },
        "\u540D\u79F0: ",
        React.createElement("span", { className: `quality-${equipment.pinji}` },
            equipment.name,
            " (",
            qualities[equipment.pinji],
            ")")),
    React.createElement("div", { className: "user_font" },
        "\u8840\u91CF:",
        renderStats(equipment).HP),
    React.createElement("div", { className: "user_font" },
        "\u66B4\u51FB\u7387:",
        (equipment.bao * 100).toFixed(0),
        "%")));
const PlayerStats = ({ nickname, player_maxHP, player_atk, player_def, player_bao }) => (React.createElement("div", { className: "equipment-card" },
    React.createElement("div", { className: "user_font_title" }, "[\u5C5E\u6027\u677F]"),
    React.createElement("div", { className: "user_font2" },
        "\u9053\u53F7:",
        nickname),
    React.createElement("div", { className: "user_font2" },
        "\u8840\u91CF:",
        player_maxHP.toFixed(0)),
    React.createElement("div", { className: "user_font2" },
        "\u653B\u51FB:",
        player_atk.toFixed(0)),
    React.createElement("div", { className: "user_font2" },
        "\u9632\u5FA1:",
        player_def.toFixed(0)),
    React.createElement("div", { className: "user_font2" },
        "\u66B4\u51FB\u7387:",
        player_bao.toFixed(0),
        "%")));
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
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
          @font-face {
            font-family: 'tttgbnumber';
            src: url('${fileUrl$1}');
            font-weight: normal;
            font-style: normal;
          }

          body {
            transform: scale(1);
            width: 100%;
            margin: 0;
            background-image: url('${fileUrl$2}');
            background-size: 100% auto;
          }
        `
                } })),
        React.createElement("body", null,
            React.createElement("div", { className: "equipment-container" },
                React.createElement(EquipmentCard, { title: "[\u6B66\u5668]", equipment: arms, qualities: qualities, renderStats: renderStats }),
                React.createElement(EquipmentCard, { title: "[\u62A4\u5177]", equipment: armor, qualities: qualities, renderStats: renderStats }),
                React.createElement(EquipmentCard, { title: "[\u6CD5\u5B9D]", equipment: treasure, qualities: qualities, renderStats: renderStats }),
                React.createElement(PlayerStats, { nickname: nickname, player_maxHP: player_maxHP, player_atk: player_atk, player_def: player_def, player_bao: player_bao })))));
};

export { Equipment as default };
