import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './BlessPlace.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/fairyrealm.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';
import fileUrl$4 from '../../img/road.jpg.js';

const SecretPlace = ({ didian_list }) => {
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

          .card {
            border-radius: 20px;
            background-size: cover;
            background-image: url('${fileUrl$4}');
          }
        `
                } })),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font head", style: { textAlign: 'center', paddingLeft: '0px' } },
                            React.createElement("div", null, "\u6D1E\u5929\u798F\u5730"))),
                    didian_list?.map((item, index) => (React.createElement("div", { key: index, className: "use_data" },
                        React.createElement("div", { className: "card" },
                            React.createElement("div", { className: "use_data_head" },
                                React.createElement("div", { className: "user_font" },
                                    React.createElement("div", null,
                                        React.createElement("div", { style: { display: 'inline-block' } },
                                            "\u3010\u5165\u9A7B\u5B97\u95E8:",
                                            item.ass,
                                            "\u3011",
                                            item.name)))),
                            React.createElement("div", { className: "use_data_body" },
                                React.createElement("div", { className: "user_font" },
                                    "\u798F\u5730\u7B49\u7EA7: ",
                                    item.level,
                                    React.createElement("br", null),
                                    "\u4FEE\u70BC\u6548\u7387: ",
                                    item.efficiency,
                                    React.createElement("br", null),
                                    React.createElement("div", null))))))))))));
};

export { SecretPlace as default };
