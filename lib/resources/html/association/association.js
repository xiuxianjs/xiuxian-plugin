import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './association.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/player/player.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Association = ({ user_id, ass, mainname, mainqq, weizhi, state, xiulian, level, fuzong, zhanglao, neimen, waimen }) => {
    const whenError = img => {
        img.src = 'default-avatar.png';
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
            React.createElement("div", null,
                React.createElement("div", { className: "user_top" },
                    React.createElement("div", { className: "user_top_left" },
                        React.createElement("div", { className: "user_top_img_bottom" },
                            React.createElement("img", { className: "user_top_img", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, onError: e => whenError(e.target) })),
                        React.createElement("div", { className: "user_top_left_qq" },
                            "QQ:",
                            user_id)),
                    React.createElement("div", { className: "user_top_right" },
                        React.createElement("div", { className: "user_font user_font", style: { paddingLeft: '15px' } },
                            "\u540D\u79F0\uFF1A",
                            ass?.宗门名称),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u5B97\u4E3B\uFF1A",
                            mainname,
                            mainqq),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u7B49\u7EA7\uFF1A",
                            ass?.宗门等级),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u7075\u77F3: ",
                            ass?.灵石池),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u4EBA\u6570: \u00A0\u00A0",
                            ass?.所有成员?.length),
                        React.createElement("div", { className: "user_font", style: { paddingLeft: '15px' } },
                            "\u5B97\u95E8\u4F4D\u7F6E\uFF1A",
                            weizhi))),
                React.createElement("div", { className: "user_bottom0" }),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "[\u4FE1\u606F]"),
                            React.createElement("div", { className: "user_font" },
                                "\u95E8\u6D3E\u72B6\u6001\uFF1A",
                                state),
                            React.createElement("div", { className: "user_font" },
                                "\u5929\u8D4B\u52A0\u5F3A\uFF1A",
                                xiulian,
                                "%"),
                            React.createElement("div", { className: "user_font" },
                                "\u5927\u9635\u5F3A\u5EA6\uFF1A",
                                ass?.大阵血量),
                            React.createElement("div", { className: "user_font" },
                                "\u5165\u5B97\u95E8\u69DB\uFF1A",
                                level),
                            React.createElement("div", { className: "user_font" },
                                "\u5B97\u95E8\u5EFA\u8BBE\u7B49\u7EA7\uFF1A",
                                ass?.宗门建设等级),
                            React.createElement("div", { className: "user_font" },
                                "\u9547\u5B97\u795E\u517D\uFF1A",
                                ass?.宗门神兽)))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "[\u526F\u5B97\u4E3B]"),
                            React.createElement("div", { className: "user_font" }, fuzong?.map((item, index) => (React.createElement("div", { key: index }, item))))))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "[\u957F\u8001]"),
                            React.createElement("div", { className: "user_font" }, zhanglao?.map((item, index) => (React.createElement("div", { key: index }, item))))))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "[\u5185\u95E8\u5F1F\u5B50]"),
                            React.createElement("div", { className: "user_font" }, neimen?.map((item, index) => (React.createElement("div", { key: index }, item))))))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } }, "[\u5916\u95E8\u5F1F\u5B50]"),
                            React.createElement("div", { className: "user_font" }, waimen?.map((item, index) => (React.createElement("div", { key: index }, item))))))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font", style: { textAlign: 'center', paddingLeft: '0px' } },
                                "\u521B\u7ACB\u4E8E: ",
                                ass?.创立时间?.[0])))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Association as default };
