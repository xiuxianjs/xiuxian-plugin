import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../state/state.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/state.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const Immortal = ({ allplayer = [] }) => {
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
          `
                } })),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" })))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u81F3\u5C0A\u699C")))),
                allplayer.map((item, index) => (React.createElement("div", { key: index, className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" },
                                "[\u7B2C",
                                index + 1,
                                "\u540D]",
                                item.name),
                            React.createElement("div", { className: "user_font" },
                                "\u9053\u53F7: ",
                                item.name),
                            React.createElement("div", { className: "user_font" },
                                "\u6218\u529B: ",
                                item.power),
                            React.createElement("div", { className: "user_font" },
                                "QQ: ",
                                item.qq)))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Immortal as default };
