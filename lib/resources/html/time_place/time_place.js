import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './time_place.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/fairyrealm.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const TimePlace = ({ didian_list }) => {
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
                        React.createElement("div", { className: "user_font head", style: { textAlign: 'center', paddingLeft: '0px' } },
                            React.createElement("div", null, "\u4ED9\u5E9C"),
                            React.createElement("span", { style: { fontSize: '0.8em' } }, "\u6307\u4EE4\uFF1A#\u63A2\u7D22\u4ED9\u5E9C"))),
                    didian_list?.map((item, index) => (React.createElement("div", { key: index, className: "use_data" },
                        React.createElement("div", { className: "card" },
                            React.createElement("div", { className: "use_data_head" },
                                React.createElement("div", { className: "user_font" },
                                    React.createElement("div", null,
                                        React.createElement("div", { style: { display: 'inline-block' } },
                                            "\u3010",
                                            item.Grade,
                                            "\u3011",
                                            item.name),
                                        React.createElement("div", { className: "price" },
                                            item.Price,
                                            "\u7075\u77F3")))),
                            React.createElement("div", { className: "use_data_body" },
                                React.createElement("div", { className: "user_font" },
                                    React.createElement("div", null,
                                        React.createElement("div", null,
                                            React.createElement("div", { className: "info" }, "\u4F4E\u7EA7\u5956\u52B1\uFF1A"),
                                            React.createElement("div", { style: { paddingLeft: '20px' } }, item.one?.map((thing, idx) => (React.createElement("div", { key: idx, className: "info2" }, thing.name))))),
                                        React.createElement("div", null,
                                            React.createElement("div", { className: "info" }, "\u4E2D\u7EA7\u5956\u52B1\uFF1A"),
                                            React.createElement("div", { style: { paddingLeft: '20px' } }, item.two?.map((thing, idx) => (React.createElement("div", { key: idx, className: "info2" }, thing.name))))),
                                        React.createElement("div", null,
                                            React.createElement("div", { className: "info" }, "\u9AD8\u7EA7\u5956\u52B1\uFF1A"),
                                            React.createElement("div", { style: { paddingLeft: '20px' } }, item.three?.map((thing, idx) => (React.createElement("div", { key: idx, className: "info2" }, thing.name)))))))))))))))));
};

export { TimePlace as default };
