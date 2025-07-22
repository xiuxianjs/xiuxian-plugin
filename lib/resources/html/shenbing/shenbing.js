import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './shenbing.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/state/state.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Shenbing = ({ newwupin }) => {
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
        `,
                } })),
        React.createElement("body", null,
            React.createElement("div", { className: "user_bottom1" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "use_data_head" },
                        React.createElement("div", { className: "user_font" }, "\u795E\u5175\u699C")))),
            newwupin?.map((item, index) => (React.createElement("div", { key: index, className: "user_bottom1" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "use_data_head" },
                        React.createElement("div", { className: "user_font" },
                            "No.",
                            index + 1,
                            React.createElement("br", null),
                            "\u5175\u5668\u540D:",
                            item.name,
                            React.createElement("br", null),
                            "\u7C7B\u00A0\u00A0\u522B:",
                            item.type,
                            React.createElement("br", null),
                            "\u7F14\u9020\u8005:",
                            item.制作者,
                            React.createElement("br", null),
                            "\u6301\u5175\u8005:",
                            item.使用者,
                            React.createElement("br", null),
                            "\u7075\u97F5\u503C:",
                            item.评分)))))),
            React.createElement("div", { className: "user_bottom2" }))));
};

export { Shenbing as default };
