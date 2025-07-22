import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './tujian.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/ningmenghome/ningmenghome.jpg.js';
import fileUrl$3 from '../../img/state/user_state.png.js';

const TuJian = ({ commodities_list }) => {
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
                            React.createElement("div", null, "\u65A9\u9996\u795E\u5668\u5802")),
                        React.createElement("div", { className: "use_data_body" }, commodities_list &&
                            commodities_list.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                                React.createElement("div", null,
                                    React.createElement("div", { style: { display: 'inline-block' } },
                                        "\u3010",
                                        item.desc[0],
                                        item.type,
                                        "\u3011",
                                        item.name)),
                                item.class === '装备' && (React.createElement(React.Fragment, null,
                                    React.createElement("div", { className: "info", style: { width: '600px' } },
                                        "\u5951\u5408\u5143\u7D20\uFF1A\u3010",
                                        item.desc[4],
                                        "\u3011"),
                                    React.createElement("div", { className: "info", style: { width: '600px' } },
                                        "\u950B\u5229\u5EA6\uFF1A",
                                        item.atk),
                                    React.createElement("div", { className: "info", style: { width: '600px' } },
                                        "\u5203\u4F53\u5F3A\u5EA6\uFF1A",
                                        item.def),
                                    React.createElement("div", { className: "info", style: { width: '600px' } },
                                        "\u8840\u6676\u6838\uFF1A",
                                        item.HP),
                                    React.createElement("div", { className: "info", style: { width: '600px' } },
                                        "\u5143\u7D20\u7206\u53D1\u7387\uFF1A",
                                        item.bao * 100,
                                        "%"),
                                    React.createElement("div", { className: "info", style: { width: '999px' } },
                                        "\u7279\u6027",
                                        item.desc[1]),
                                    React.createElement("div", { className: "info", style: { width: '600px' } }, item.desc[2]),
                                    React.createElement("div", { className: "info", style: { width: '600px' } }, item.desc[3]),
                                    React.createElement("div", { className: "info", style: { width: '600px' } },
                                        "\u83B7\u53D6\u9014\u5F84:",
                                        item.tujin))),
                                item.class === '丹药' && (React.createElement("div", { className: "info" },
                                    item.type,
                                    "\uFF1A",
                                    item.type === '修为'
                                        ? item.exp
                                        : item.type === '血气'
                                            ? item.xueqi
                                            : item.type === '血量'
                                                ? item.HP
                                                : '')),
                                item.class === '功法' && (React.createElement("div", { className: "info" },
                                    "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                                    item.修炼加成 * 100,
                                    "%")),
                                item.class === '道具' && (React.createElement("div", { className: "info" },
                                    "\u63CF\u8FF0\uFF1A",
                                    item.desc)),
                                item.class === '草药' && (React.createElement("div", { className: "info" },
                                    "\u63CF\u8FF0\uFF1A",
                                    item.desc))))))))))));
};

export { TuJian as default };
