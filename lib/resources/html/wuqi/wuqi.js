import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../gongfa/gongfa.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/player/player.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const WuQi = ({ nickname, wuqi_have, wuqi_need }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
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
            React.createElement("div", { className: "header" }),
            React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" },
                        nickname,
                        "\u7684\u88C5\u5907"))),
            wuqi_have && wuqi_have.length > 0 && (React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u5DF2\u62E5\u6709\u3011"),
                    React.createElement("div", { className: "user_font wupin" }, wuqi_have.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                        React.createElement("div", { className: "item_title font_item_title", style: { height: '45px' } }, item.name),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                            "\u7C7B\u578B\uFF1A",
                            item.type),
                        item.atk > 10 || item.def > 10 || item.HP > 10 ? (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u653B\u51FB\uFF1A",
                                item.atk),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u9632\u5FA1\uFF1A",
                                item.def),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u8840\u91CF\uFF1A",
                                item.HP))) : (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u653B\u51FB:",
                                (item.atk * 100).toFixed(0),
                                "%"),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u9632\u5FA1:",
                                (item.def * 100).toFixed(0),
                                "%"),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u8840\u91CF:",
                                (item.HP * 100).toFixed(0),
                                "%"))),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                            "\u66B4\u51FB:",
                            (item.bao * 100).toFixed(0),
                            "%")))))))),
            wuqi_need && wuqi_need.length > 0 && (React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u672A\u62E5\u6709\u3011"),
                    React.createElement("div", { className: "user_font wupin" }, wuqi_need.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                        React.createElement("div", { className: "item_title font_item_title", style: { height: '45px' } }, item.name),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                            "\u7C7B\u578B\uFF1A",
                            item.type),
                        item.atk > 10 || item.def > 10 || item.HP > 10 ? (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u653B\u51FB\uFF1A",
                                item.atk),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u9632\u5FA1\uFF1A",
                                item.def),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u8840\u91CF\uFF1A",
                                item.HP))) : (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u653B\u51FB:",
                                (item.atk * 100).toFixed(0),
                                "%"),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u9632\u5FA1:",
                                (item.def * 100).toFixed(0),
                                "%"),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                                "\u8840\u91CF:",
                                (item.HP * 100).toFixed(0),
                                "%"))),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '38px' } },
                            "\u66B4\u51FB:",
                            (item.bao * 100).toFixed(0),
                            "%")))))))),
            React.createElement("div", { className: "user_bottom2" }))));
};

export { WuQi as default };
