import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './log.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/najie/najie.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Log = ({ log }) => {
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
        `
                } })),
        React.createElement("body", null,
            React.createElement("div", { className: "user_bottom1" },
                React.createElement("div", { className: "use_data" }, log &&
                    log.map((item, index) => (React.createElement("div", { key: index },
                        React.createElement("div", { className: "user_font", style: { paddingLeft: 0 } }, item),
                        React.createElement("div", { style: { margin: '0 0 -10px' } }, "-------------------------------------------------------------------------------------------------------------------------------")))))),
            React.createElement("div", { className: "user_bottom2" }))));
};

export { Log as default };
