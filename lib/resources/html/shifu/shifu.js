import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './shifu.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/player/player.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Shifu = ({ user_id, minghao, renwu, tudinum, shifu, shimen, rw1, wancheng1, rw2, wancheng2, rw3, wancheng3, chengyuan }) => {
    const whenError = img => {
        img.src = '@src/resources/img/player/default-avatar.png';
    };
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
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
            React.createElement("div", { className: "user_top" },
                React.createElement("div", { className: "user_top_left" },
                    React.createElement("div", { className: "user_top_img_bottom" },
                        React.createElement("img", { className: "user_top_img", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, onError: e => whenError(e.target) })),
                    React.createElement("div", { className: "user_top_left_qq" },
                        "QQ:",
                        user_id)),
                React.createElement("div", { className: "user_top_right" },
                    React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                        "\u540D\u53F7:",
                        minghao),
                    React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                        "\u4EFB\u52A1\u9636\u6BB5: ",
                        renwu),
                    React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                        "\u5E08\u95E8\u4EBA\u6570: ",
                        tudinum),
                    React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                        "\u5E08\u5085: ",
                        shifu),
                    React.createElement("div", { className: "user_font user_font", style: { paddingLeft: '15px' } },
                        "\u5E08\u5F92\u79EF\u5206\uFF1A",
                        shimen))),
            React.createElement("div", { className: "user_bottom0" }),
            React.createElement("div", { className: "user_bottom1" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "use_data_head" },
                        React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "[\u5E08\u5F92\u4EFB\u52A1]"),
                        React.createElement("div", { className: "user_font" }, "\u4EFB\u52A11\uFF1A"),
                        React.createElement("div", { className: "user_font" },
                            rw1,
                            wancheng1),
                        React.createElement("div", { className: "user_font" }, "\u4EFB\u52A12\uFF1A"),
                        React.createElement("div", { className: "user_font" },
                            rw2,
                            wancheng2),
                        React.createElement("div", { className: "user_font" }, "\u4EFB\u52A13\uFF1A"),
                        React.createElement("div", { className: "user_font" },
                            rw3,
                            wancheng3)))),
            React.createElement("div", { className: "user_bottom1" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "use_data_head" },
                        React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "[\u540C\u95E8\u5F1F\u5B50]"),
                        React.createElement("div", { className: "user_font" }, chengyuan?.map((item, index) => (React.createElement("div", { key: index }, item))))))))));
};

export { Shifu as default };
