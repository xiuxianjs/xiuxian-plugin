import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './tuzhi.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/tuzhi/tuzhi.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Tuzhi = ({ tuzhi_list }) => {
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
                            React.createElement("div", null, "\u56FE\u7EB8"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u70BC\u5236\u6307\u4EE4\uFF1A#\u6253\u9020+\u6B66\u5668\u540D"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u70BC\u5236\u6210\u529F\u7387 = \u70BC\u5236\u6210\u529F\u7387 + \u73A9\u5BB6\u804C\u4E1A\u7B49\u7EA7\u6210\u529F\u7387")),
                        React.createElement("div", { className: "use_data_body" }, tuzhi_list?.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                            React.createElement("div", null,
                                React.createElement("div", { style: { display: 'inline-block' } }, item.name),
                                React.createElement("div", { className: "rate" },
                                    "\u57FA\u7840\u6210\u529F\u7387",
                                    ~~(item.rate * 100),
                                    "%")),
                            item.materials?.map((material, idx) => (React.createElement("div", { key: idx, className: "info", style: { width: '130px' } },
                                material.name,
                                "\u00D7",
                                material.amount)))))))))))));
};

export { Tuzhi as default };
