import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../ningmenghome/ningmenghome.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/ningmenghome/ningmenghome.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const ZongMeng = ({ temp }) => {
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
            React.createElement("div", null,
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font use_data_head", style: { textAlign: 'center', paddingLeft: '0px' } },
                            React.createElement("div", null, "\u5B97\u95E8\u5217\u8868")),
                        React.createElement("div", { className: "use_data_body" }, temp &&
                            temp.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                                React.createElement("div", { className: "info" },
                                    "\u5B97\u95E8\u540D\u79F0\uFF1A",
                                    item.宗名),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u5B97\u95E8\u4EBA\u6570\uFF1A",
                                    item.人数,
                                    "/",
                                    item.宗门人数上限),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u5B97\u95E8\u7C7B\u578B\uFF1A",
                                    item.位置),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u5B97\u95E8\u7B49\u7EA7\uFF1A",
                                    item.等级),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u5929\u8D4B\u52A0\u6210\uFF1A",
                                    item.天赋加成,
                                    "%"),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u5EFA\u8BBE\u7B49\u7EA7\uFF1A",
                                    item.宗门建设等级),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u9547\u5B97\u795E\u517D\uFF1A",
                                    item.镇宗神兽),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u5B97\u95E8\u9A7B\u5730\uFF1A",
                                    item.宗门驻地),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u52A0\u5165\u95E8\u69DB\uFF1A",
                                    item.最低加入境界),
                                React.createElement("br", null),
                                React.createElement("div", { className: "info" },
                                    "\u5B97\u4E3BQ\u00A0\u00A0Q\uFF1A",
                                    item.宗主)))))))))));
};

export { ZongMeng as default };
