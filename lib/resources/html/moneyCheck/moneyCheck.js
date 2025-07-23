import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../ningmenghome/ningmenghome.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/fairyrealm.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const MoneyCheck = ({ qq, victory, victory_num, defeated, defeated_num }) => {
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
                            React.createElement("div", null, "\u91D1\u94F6\u574A\u8BB0\u5F55"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, qq)),
                        React.createElement("div", { className: "use_data_body" },
                            React.createElement("div", { className: "user_font" },
                                React.createElement("div", { className: "info" },
                                    "\u80DC\u573A\uFF1A",
                                    victory),
                                React.createElement("div", { className: "info" },
                                    "\u5171\u5377\u8D70\u7075\u77F3\uFF1A",
                                    victory_num),
                                React.createElement("div", { className: "info" },
                                    "\u8D25\u573A\uFF1A",
                                    defeated),
                                React.createElement("div", { className: "info" },
                                    "\u5171\u732E\u796D\u7075\u77F3\uFF1A",
                                    defeated_num)))))))));
};

export { MoneyCheck as default };
