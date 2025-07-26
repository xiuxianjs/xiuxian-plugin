import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './gongfa.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/player.jpg.js';
import fileUrl$3 from '../../img/player_footer.png.js';
import fileUrl$4 from '../../img/user_state.png.js';

const Gongfa = ({ nickname, gongfa_need = [], gongfa_have = [] }) => {
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
            width: 100%;
            padding: 0;
            margin: 0;
            text-align: center;
            background-image: url('${fileUrl$2}'), url('${fileUrl$3}');
            background-repeat: no-repeat, repeat;
            background-size: 100%, auto;
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
                            "\u7684\u529F\u6CD5"))),
                gongfa_need.length > 0 && (React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u672A\u5B66\u4E60\u3011"),
                        React.createElement("div", { className: "user_font wupin" }, gongfa_need.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                            React.createElement("div", { className: "item_title font_item_title", style: { height: '45px' } }, item.name),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                                (item.修炼加成 * 100).toFixed(0),
                                "%"),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u4EF7\u683C\uFF1A",
                                item.出售价.toFixed(0))))))))),
                gongfa_have.length > 0 && (React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u5DF2\u5B66\u4E60\u3011"),
                        React.createElement("div", { className: "user_font wupin" }, gongfa_have.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                            React.createElement("div", { className: "item_title font_item_title", style: { height: '45px' } }, item.name),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                                (item.修炼加成 * 100).toFixed(0),
                                "%"),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u4EF7\u683C\uFF1A",
                                item.出售价.toFixed(0))))))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Gongfa as default };
