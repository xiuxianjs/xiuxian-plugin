import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './state.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/state/state.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const State = ({ Level_list = [] }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("style", null, `
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
        `)),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u7EC3\u6C14\u5883\u754C")))),
                Level_list.map((item, index) => (React.createElement("div", { key: index, className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" },
                                React.createElement("div", null,
                                    "\u5883\u754C\uFF1A",
                                    item.level),
                                React.createElement("div", null,
                                    "\u7A81\u7834\u4FEE\u4E3A\uFF1A",
                                    item.exp))))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { State as default };
