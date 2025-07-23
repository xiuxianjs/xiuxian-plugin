import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './shop.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/najie.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const Shop = ({ name, level, state, thing = [] }) => {
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
            React.createElement("div", { className: "user_bottom1" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "use_data_head" },
                        React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } },
                            "[",
                            name,
                            "]"),
                        React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } },
                            "\u96BE\u5EA6:",
                            level),
                        React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } },
                            "\u72B6\u6001:",
                            state),
                        React.createElement("div", { className: "user_font2" }, thing.map((item, index) => (React.createElement("div", { key: index, className: "user_font3", style: { position: 'relative' } },
                            React.createElement("div", { style: { paddingLeft: '10px' } }, item.name),
                            React.createElement("div", { style: {
                                    position: 'absolute',
                                    right: '0',
                                    paddingRight: '10px'
                                } },
                                "\u6570\u91CF:",
                                item.数量)))))))),
            React.createElement("div", { className: "user_bottom2" }))));
};

export { Shop as default };
