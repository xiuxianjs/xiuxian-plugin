import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './equipment.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/equipment_pifu/0.jpg.js';

const Equipment = ({ arms = {}, armor = {}, treasure = {}, nickname, player_maxHP, player_atk, player_def, player_bao }) => {
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
            height: 480px;
            margin: 0;
            text-align: center;
            background-image: url('${fileUrl$2}');
            background-size: 100% auto;
          }
        `
                } })),
        React.createElement("body", null,
            React.createElement("div", { className: "user_width" },
                React.createElement("div", { className: "user_left" },
                    React.createElement("div", { className: "user_left_top" },
                        React.createElement("div", { className: "user_font_title" }, "[\u6B66\u5668]"),
                        React.createElement("div", { className: "user_font" },
                            "\u540D\u79F0:",
                            arms.name,
                            "(",
                            qualities[arms.pinji],
                            ")"),
                        React.createElement("div", { className: "user_font" },
                            "\u5C5E\u6027:",
                            renderStats(arms).attribute),
                        React.createElement("div", { className: "user_font" },
                            "\u653B\u51FB:",
                            renderStats(arms).atk),
                        React.createElement("div", { className: "user_font" },
                            "\u9632\u5FA1:",
                            renderStats(arms).def),
                        React.createElement("div", { className: "user_font" },
                            "\u8840\u91CF:",
                            renderStats(arms).HP),
                        React.createElement("div", { className: "user_font" },
                            "\u66B4\u51FB\u7387:",
                            (arms.bao * 100).toFixed(0),
                            "%")),
                    React.createElement("div", { className: "user_left_buttom" },
                        React.createElement("div", { className: "user_font_title" }, "[\u62A4\u5177]"),
                        React.createElement("div", { className: "user_font" },
                            "\u540D\u79F0:",
                            armor.name,
                            "(",
                            qualities[armor.pinji],
                            ")"),
                        React.createElement("div", { className: "user_font" },
                            "\u5C5E\u6027:",
                            renderStats(armor).attribute),
                        React.createElement("div", { className: "user_font" },
                            "\u653B\u51FB:",
                            renderStats(armor).atk),
                        React.createElement("div", { className: "user_font" },
                            "\u9632\u5FA1:",
                            renderStats(armor).def),
                        React.createElement("div", { className: "user_font" },
                            "\u8840\u91CF:",
                            renderStats(armor).HP),
                        React.createElement("div", { className: "user_font" },
                            "\u66B4\u51FB\u7387:",
                            (armor.bao * 100).toFixed(0),
                            "%"))),
                React.createElement("div", { className: "user_right" },
                    React.createElement("div", { className: "user_right_top" },
                        React.createElement("div", { className: "user_font_title" }, "[\u6CD5\u5B9D]"),
                        React.createElement("div", { className: "user_font" },
                            "\u540D\u79F0:",
                            treasure.name,
                            "(",
                            qualities[treasure.pinji],
                            ")"),
                        React.createElement("div", { className: "user_font" },
                            "\u5C5E\u6027:",
                            renderStats(treasure).attribute),
                        React.createElement("div", { className: "user_font" },
                            "\u653B\u51FB:",
                            renderStats(treasure).atk),
                        React.createElement("div", { className: "user_font" },
                            "\u9632\u5FA1:",
                            renderStats(treasure).def),
                        React.createElement("div", { className: "user_font" },
                            "\u8840\u91CF:",
                            renderStats(treasure).HP),
                        React.createElement("div", { className: "user_font" },
                            "\u66B4\u51FB\u7387:",
                            (treasure.bao * 100).toFixed(0),
                            "%")),
                    React.createElement("div", { className: "user_right_buttom" },
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
                            "%")))))));
};

export { Equipment as default };
