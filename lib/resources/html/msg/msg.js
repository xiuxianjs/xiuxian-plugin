import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../supermarket/supermarket.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/supermarket/supermarket.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Msg = ({ type, msg }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
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
                        React.createElement("div", { className: "user_font use_data_head", style: { textAlign: 'center', paddingLeft: '0px' } },
                            type === 0 && (React.createElement(React.Fragment, null,
                                React.createElement("div", null, "\u60AC\u8D4F\u76EE\u6807"),
                                React.createElement("div", { style: { fontSize: '0.8em' } }, "\u6307\u4EE4\uFF1A#\u8BA8\u4F10\u76EE\u6807+\u6570\u5B57"))),
                            type === 1 && (React.createElement(React.Fragment, null,
                                React.createElement("div", null, "\u60AC\u8D4F\u699C"),
                                React.createElement("div", { style: { fontSize: '0.8em' } }, "\u6307\u4EE4\uFF1A#\u523A\u6740\u76EE\u6807+\u6570\u5B57")))),
                        React.createElement("div", { className: "use_data_body" }, msg &&
                            msg.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                                React.createElement("div", { className: "info" },
                                    "\u540D\u53F7\uFF1A",
                                    item.名号),
                                React.createElement("div", { className: "number" },
                                    "No.",
                                    index + 1),
                                React.createElement("div", { className: "info" },
                                    "\u8D4F\u91D1\uFF1A",
                                    item.赏金)))))))))));
};

export { Msg as default };
