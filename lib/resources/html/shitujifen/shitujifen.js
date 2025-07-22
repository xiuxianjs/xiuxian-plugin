import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from '../ningmenghome/ningmenghome.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/ningmenghome/ningmenghome.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const Shitujifen = ({ name, jifen, commodities_list }) => {
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
                            React.createElement("div", null, "\u5E08\u5F92\u5546\u5E97"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u8D2D\u4E70\u6307\u4EE4\uFF1A#\u5E08\u5F92\u5151\u6362+\u7269\u54C1\u540D"),
                            React.createElement("div", { style: { fontSize: '0.8em' } },
                                name,
                                "\u7684\u79EF\u5206\uFF1A",
                                jifen)),
                        React.createElement("div", { className: "use_data_body" }, commodities_list?.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                            React.createElement("div", null,
                                React.createElement("div", { style: { display: 'inline-block' } },
                                    "\u3010",
                                    item.type,
                                    "\u3011",
                                    item.name),
                                React.createElement("div", { className: "price" },
                                    item.积分,
                                    "\u79EF\u5206")),
                            item.class === '装备' && (React.createElement(React.Fragment, null,
                                React.createElement("div", { className: "info", style: { width: '130px' } },
                                    "\u653B\uFF1A",
                                    item.atk),
                                React.createElement("div", { className: "info", style: { width: '130px' } },
                                    "\u9632\uFF1A",
                                    item.def),
                                React.createElement("div", { className: "info", style: { width: '130px' } },
                                    "\u8840\uFF1A",
                                    item.HP),
                                React.createElement("div", { className: "info", style: { width: '130px' } },
                                    "\u66B4\uFF1A",
                                    item.bao * 100,
                                    "%"))),
                            item.class === '丹药' && (React.createElement("div", { className: "info" },
                                "\u6548\u679C\uFF1A",
                                item.exp,
                                item.xueqi)),
                            item.class === '功法' && (React.createElement("div", { className: "info" },
                                "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                                (item.修炼加成 * 100).toFixed(0),
                                "%")),
                            item.class === '道具' && (React.createElement("div", { className: "info" },
                                "\u63CF\u8FF0\uFF1A",
                                item.desc)),
                            item.class === '草药' && (React.createElement("div", { className: "info" },
                                "\u63CF\u8FF0\uFF1A",
                                item.desc))))))))))));
};

export { Shitujifen as default };
