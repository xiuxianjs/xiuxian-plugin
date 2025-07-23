import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../gongfa/gongfa.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/player.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const Daoju = ({ nickname, daoju_have = [], daoju_need = [] }) => {
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
            text-align: center;
            background-image: url('${fileUrl$2}');
            background-size: 100% auto;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${fileUrl$3}');
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
                            "\u7684\u9053\u5177"))),
                daoju_have.length > 0 && (React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u5DF2\u62E5\u6709\u3011"),
                        React.createElement("div", { className: "user_font wupin" }, daoju_have.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                            React.createElement("div", { className: "item_title font_item_title" }, item.name),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                                "\u7C7B\u578B\uFF1A",
                                item.name),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                                "\u63CF\u8FF0\uFF1A",
                                item.desc),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                                "\u4EF7\u683C\uFF1A",
                                item.出售价.toFixed(0))))))))),
                daoju_need.length > 0 && (React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u672A\u62E5\u6709\u3011"),
                        React.createElement("div", { className: "user_font wupin" }, daoju_need.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                            React.createElement("div", { className: "item_title font_item_title" }, item.name),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                                "\u7C7B\u578B\uFF1A",
                                item.name),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                                "\u63CF\u8FF0\uFF1A",
                                item.desc),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                                "\u4EF7\u683C\uFF1A",
                                item.出售价.toFixed(0))))))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Daoju as default };
