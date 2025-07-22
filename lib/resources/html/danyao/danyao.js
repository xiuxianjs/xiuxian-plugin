import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../gongfa/gongfa.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../font/NZBZ.ttf.js';
import fileUrl$3 from '../../img/player/player.jpg.js';
import fileUrl$4 from '../../img/state/user_state.png.js';

const Danyao = ({ nickname, danyao_have = [], danyao2_have = [], danyao_need = [] }) => {
    const renderEffect = item => {
        const effects = [];
        if (item.HP)
            effects.push(item.HP);
        if (item.exp)
            effects.push(item.exp);
        if (item.xueqi)
            effects.push(item.xueqi);
        if (item.xingyun > 0)
            effects.push(`${(item.xingyun * 100).toFixed(1)}%`);
        return effects.join('');
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

          @font-face {
            font-family: 'NZBZ';
            src: url('${fileUrl$2}');
            font-weight: normal;
            font-style: normal;
          }

          body {
            width: 100%;
            text-align: center;
            background-image: url('${fileUrl$3}');
            background-size: 100% auto;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${fileUrl$4}');
            background-size: 100% auto;
            width: 280px;
            height: 280px;
          }
        `
                } })),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "header" }),
                React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" },
                            nickname,
                            "\u7684\u4E39\u836F"))),
                (danyao_have.length > 0 || danyao2_have.length > 0) && (React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u5DF2\u62E5\u6709\u3011"),
                        React.createElement("div", { className: "user_font wupin" },
                            danyao_have.map((item, index) => (React.createElement("div", { key: `danyao_${index}`, className: "item" },
                                React.createElement("div", { className: "item_title font_item_title" }, item.name),
                                React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                    "\u7C7B\u578B\uFF1A",
                                    item.type),
                                React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                    "\u6548\u679C\uFF1A",
                                    renderEffect(item)),
                                React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                    "\u4EF7\u683C\uFF1A",
                                    item.出售价.toFixed(0))))),
                            danyao2_have.map((item, index) => (React.createElement("div", { key: `danyao2_${index}`, className: "item" },
                                React.createElement("div", { className: "item_title font_item_title" }, item.name),
                                React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                    "\u7C7B\u578B\uFF1A",
                                    item.type),
                                React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                    "\u6548\u679C\uFF1A",
                                    renderEffect(item)),
                                React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                    "\u4EF7\u683C\uFF1A",
                                    item.出售价.toFixed(0))))))))),
                danyao_need.length > 0 && (React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u672A\u62E5\u6709\u3011"),
                        React.createElement("div", { className: "user_font wupin" }, danyao_need.map((item, index) => (React.createElement("div", { key: `need_${index}`, className: "item" },
                            React.createElement("div", { className: "item_title font_item_title" }, item.name),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u7C7B\u578B\uFF1A",
                                item.type),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u6548\u679C\uFF1A",
                                renderEffect(item)),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u4EF7\u683C\uFF1A",
                                item.出售价.toFixed(0))))))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Danyao as default };
