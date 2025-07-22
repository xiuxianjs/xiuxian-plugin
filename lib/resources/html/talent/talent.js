import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './talent.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/talent/talent.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Talent = ({ talent_list = [] }) => {
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
                        React.createElement("div", { className: "user_font use_data_head", style: { textAlign: 'center', paddingLeft: '0px' } },
                            React.createElement("div", null, "\u7075\u6839\u5217\u8868")),
                        React.createElement("div", { className: "use_data_body" }, talent_list.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                            React.createElement("div", null,
                                React.createElement("div", { style: { display: 'inline-block' } },
                                    "\u3010",
                                    item.type,
                                    "\u3011",
                                    item.name)),
                            React.createElement("div", { className: "info", style: { width: '200px' } },
                                "\u4FEE\u70BC\u6548\u7387\uFF1A",
                                item.eff * 100,
                                "%"),
                            React.createElement("div", { className: "info", style: { width: '200px' } },
                                "\u989D\u5916\u589E\u4F24\uFF1A",
                                item.法球倍率 * 100,
                                "%")))))))))));
};

export { Talent as default };
