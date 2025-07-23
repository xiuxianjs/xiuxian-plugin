import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './player.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/player.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const PlayerCopy = ({ user_id, nickname, player_nowHP, player_maxHP, levelMax, xueqi, need_xueqi, lingshi, association, learned_gongfa }) => {
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
                React.createElement("div", { className: "user_top" },
                    React.createElement("div", { className: "user_top_left" },
                        React.createElement("div", { className: "user_top_img_bottom" },
                            React.createElement("img", { className: "user_top_img", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}` })),
                        React.createElement("div", { className: "user_top_left_qq" },
                            "QQ:",
                            user_id)),
                    React.createElement("div", { className: "user_top_right" },
                        React.createElement("div", { className: "user_font user_font", style: { paddingLeft: '15px' } },
                            "\u9053\u53F7\uFF1A",
                            nickname),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u8840\u91CF\uFF1A",
                            player_nowHP,
                            " / ",
                            player_maxHP),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u4F53\u5883\uFF1A",
                            levelMax),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u6C14\u8840\uFF1A",
                            xueqi,
                            " / ",
                            need_xueqi),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u7075\u77F3\uFF1A",
                            lingshi))),
                React.createElement("div", { className: "user_bottom0" }),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "\u3010\u6211\u7684\u5B97\u95E8\u3011"),
                            React.createElement("div", { className: "user_font" },
                                "\u5B97\u95E8\u540D\u79F0\uFF1A",
                                association?.宗门名称),
                            React.createElement("div", { className: "user_font" },
                                "\u804C\u4F4D\uFF1A",
                                association?.职位)))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "\u3010\u5DF2\u5B66\u529F\u6CD5\u3011"),
                            React.createElement("div", { className: "user_font gonfa" }, learned_gongfa?.map((item, index) => (React.createElement("div", { key: index, className: "gonfa2" },
                                "\u300A",
                                item,
                                "\u300B"))))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { PlayerCopy as default };
