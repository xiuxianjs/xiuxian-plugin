import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../ningmenghome/ningmenghome.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/ningmenghome/ningmenghome.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const SearchForum = ({ Forum, nowtime }) => {
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
                            React.createElement("div", null, "\u5192\u9669\u5BB6\u534F\u4F1A"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u5411\u7740\u4ED9\u5E9C\u4E0E\u795E\u754C,\u6B22\u8FCE\u6765\u5230\u5192\u9669\u5BB6\u534F\u4F1A")),
                        React.createElement("div", { className: "use_data_body" }, Forum &&
                            Forum.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                                React.createElement("div", { className: "info" },
                                    "\u7269\u54C1\uFF1A",
                                    item.thing.name,
                                    "\u3010",
                                    item.pinji,
                                    "\u3011"),
                                React.createElement("br", null),
                                React.createElement("div", { className: "number" },
                                    "No.",
                                    index + 1),
                                React.createElement("div", { className: "info" },
                                    "\u7C7B\u578B\uFF1A",
                                    item.thing.class),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u6570\u91CF\uFF1A",
                                    item.thingNumber),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u91D1\u989D\uFF1A",
                                    item.thingJIAGE),
                                React.createElement("br", null),
                                item.end_time - nowtime > 0 && (React.createElement("div", { className: "info" },
                                    "CD\uFF1A",
                                    ((item.end_time - nowtime) / 60000).toFixed(0),
                                    "\u5206",
                                    (((item.end_time - nowtime) % 60000) / 1000).toFixed(0),
                                    "\u79D2"))))))))))));
};

export { SearchForum as default };
