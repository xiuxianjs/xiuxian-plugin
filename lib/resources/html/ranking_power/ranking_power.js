import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../state/state.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/state/state.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const RankingPower = ({ user_id, nickname, level, exp, usr_paiming, allplayer }) => {
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
                React.createElement("div", { className: "user_top" },
                    React.createElement("div", { className: "user_top_left" },
                        React.createElement("div", { className: "user_top_img_bottom" },
                            React.createElement("img", { className: "user_top_img", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, onError: e => {
                                    e.target.src = '@src/resources/img/default_avatar.png';
                                } })),
                        React.createElement("div", { className: "user_top_left_qq" },
                            "QQ:",
                            user_id)),
                    React.createElement("div", { className: "user_top_right" },
                        React.createElement("div", { className: "user_font user_font", style: { textAlign: 'left' } },
                            "\u9053\u53F7:",
                            nickname),
                        React.createElement("div", { className: "user_font", style: { textAlign: 'left' } },
                            "\u5883\u754C:",
                            level),
                        React.createElement("div", { className: "user_font", style: { textAlign: 'left' } },
                            "\u4FEE\u4E3A:",
                            exp),
                        React.createElement("div", { className: "user_font", style: { textAlign: 'left' } },
                            "\u6392\u540D:\u7B2C",
                            usr_paiming,
                            "\u540D"))),
                React.createElement("div", { className: "user_bottom0" }),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u5929\u699C")))),
                allplayer &&
                    allplayer.map((item, index) => (React.createElement("div", { key: index, className: "user_bottom1" },
                        React.createElement("div", { className: "use_data" },
                            React.createElement("div", { className: "use_data_head" },
                                React.createElement("div", { className: "user_font" },
                                    "[\u7B2C",
                                    item.名次,
                                    "\u540D] ",
                                    item.名号),
                                React.createElement("div", { className: "user_font" },
                                    ">>\u5883\u754C: ",
                                    item.境界),
                                React.createElement("div", { className: "user_font" },
                                    "\u00A0\u00A0\u4FEE\u4E3A:",
                                    item.总修为)))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { RankingPower as default };
