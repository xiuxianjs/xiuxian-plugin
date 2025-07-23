import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../gongfa/gongfa.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/player.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const XianChong = ({ nickname, XianChong_have, XianChong_need, Kouliang }) => {
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
            React.createElement("div", null,
                React.createElement("div", { className: "header" }),
                React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" },
                            nickname,
                            "\u7684\u4ED9\u5BA0")))),
            XianChong_have && XianChong_have.length > 0 && (React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u5DF2\u62E5\u6709\u3011"),
                    React.createElement("div", { className: "user_font wupin" }, XianChong_have.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                        React.createElement("div", { className: "item_title font_item_title" }, item.name),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u7C7B\u578B\uFF1A",
                            item.type),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u521D\u59CB\u52A0\u6210\uFF1A",
                            item.初始加成 * 100,
                            "%"),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u6BCF\u7EA7\u589E\u52A0\uFF1A",
                            item.每级增加 * 100,
                            "%"),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u52A0\u6210\uFF1A",
                            item.加成 * 100,
                            "%"),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u7075\u9B42\u7ED1\u5B9A\uFF1A",
                            item.灵魂绑定 === 0 ? '否' : '是'),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u54C1\u7EA7\uFF1A",
                            item.品级),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u7B49\u7EA7\u4E0A\u9650\uFF1A",
                            item.等级上限),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u4EF7\u683C\uFF1A",
                            item.出售价)))))))),
            XianChong_need && XianChong_need.length > 0 && (React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u672A\u62E5\u6709\u3011"),
                    React.createElement("div", { className: "user_font wupin" }, XianChong_need.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                        React.createElement("div", { className: "item_title font_item_title" }, item.name),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u7C7B\u578B\uFF1A",
                            item.type),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u521D\u59CB\u52A0\u6210\uFF1A",
                            item.初始加成 * 100,
                            "%"),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u6BCF\u7EA7\u589E\u52A0\uFF1A",
                            item.每级增加 * 100,
                            "%"),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u52A0\u6210\uFF1A",
                            item.加成 * 100,
                            "%"),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u7075\u9B42\u7ED1\u5B9A\uFF1A",
                            item.灵魂绑定 === 0 ? '否' : '是'),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u54C1\u7EA7\uFF1A",
                            item.品级),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u7B49\u7EA7\u4E0A\u9650\uFF1A",
                            item.等级上限),
                        React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                            "\u4EF7\u683C\uFF1A",
                            item.出售价)))))))),
            React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u53E3\u7CAE\u56FE\u9274\u3011"),
                    React.createElement("div", { className: "user_font wupin" }, Kouliang &&
                        Kouliang.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                            React.createElement("div", { className: "item_title font_item_title" }, item.name),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                                "\u7B49\u7EA7\uFF1A",
                                item.level),
                            React.createElement("div", { className: "item_int", style: { paddingLeft: '26px' } },
                                "\u4EF7\u683C\uFF1A",
                                item.出售价.toFixed(0)))))))),
            React.createElement("div", { className: "user_bottom2" }))));
};

export { XianChong as default };
