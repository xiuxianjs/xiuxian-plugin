import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../supermarket/supermarket.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/supermarket/supermarket.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Forum = ({ Forum: forumData }) => {
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
            React.createElement("div", null,
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font use_data_head", style: { textAlign: 'center', paddingLeft: '0px' } },
                            React.createElement("div", null, "\u805A\u5B9D\u5802"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u53D1\u5E03\u6307\u4EE4\uFF1A#\u53D1\u5E03+\u7269\u54C1\u540D*\u4EF7\u683C*\u6570\u91CF"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u63A5\u53D6\u6307\u4EE4\uFF1A#\u63A5\u53D6+\u7F16\u53F7*\u6570\u91CF"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u53D6\u6D88\u6307\u4EE4\uFF1A#\u53D6\u6D88+\u7F16\u53F7")),
                        React.createElement("div", { className: "use_data_body" }, forumData &&
                            forumData.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                                React.createElement("div", null,
                                    React.createElement("div", { style: { display: 'inline-block' } },
                                        "\u3010",
                                        item.class,
                                        "\u3011",
                                        item.name),
                                    React.createElement("div", { className: "number" },
                                        "No.",
                                        item.num)),
                                React.createElement("div", { className: "info" },
                                    "\u5355\u4EF7\uFF1A",
                                    item.price),
                                React.createElement("div", { className: "info" },
                                    "\u6570\u91CF\uFF1A",
                                    item.aconut),
                                React.createElement("div", { className: "info" },
                                    "\u603B\u4EF7\uFF1A",
                                    item.whole),
                                React.createElement("div", { className: "info" },
                                    "QQ\uFF1A",
                                    item.qq)))))))))));
};

export { Forum as default };
