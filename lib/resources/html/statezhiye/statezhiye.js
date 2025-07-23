import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './statezhiye.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/state.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const Statezhiye = ({ Level_list }) => {
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
                            React.createElement("div", { className: "user_font" }, "#\u804C\u4E1A\u7B49\u7EA7")))),
                Level_list?.map((item, index) => (React.createElement("div", { key: index, className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" },
                                React.createElement("div", null,
                                    "\u7B49\u7EA7\uFF1A",
                                    item.name),
                                React.createElement("div", null,
                                    "\u719F\u7EC3\u5EA6\u8981\u6C42\uFF1A",
                                    item.experience))))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Statezhiye as default };
