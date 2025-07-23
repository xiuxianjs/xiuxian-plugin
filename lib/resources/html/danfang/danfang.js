import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './danfang.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/fairyrealm.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const Danfang = ({ danfang_list }) => {
    const renderItemInfo = item => {
        switch (item.type) {
            case '血量':
                return item.HP;
            case '修为':
                return item.exp2;
            case '血气':
                return item.exp2;
            default:
                return '';
        }
    };
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
                            React.createElement("div", null, "\u4E39\u65B9"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u70BC\u5236\u6307\u4EE4\uFF1A#\u70BC\u5236+\u4E39\u836F\u540D"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u70BC\u5236\u6210\u529F\u7387 = \u4E39\u65B9\u6210\u529F\u7387 + \u73A9\u5BB6\u804C\u4E1A\u7B49\u7EA7\u6210\u529F\u7387")),
                        React.createElement("div", { className: "use_data_body" }, danfang_list?.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                            React.createElement("div", null,
                                React.createElement("div", { style: { display: 'inline-block' } },
                                    "\u3010",
                                    item.type,
                                    "\u3011",
                                    item.name),
                                React.createElement("div", { className: "rate", style: { width: '50px' } },
                                    Math.floor(item.rate * 100),
                                    "%"),
                                React.createElement("div", { className: "rate", style: { width: '50px' } },
                                    "lv.",
                                    item.level_limit)),
                            React.createElement("div", { className: "info" },
                                item.type,
                                "\uFF1A",
                                renderItemInfo(item)),
                            React.createElement("div", null,
                                React.createElement("div", { className: "info" }, "\u914D\u65B9\uFF1A"),
                                React.createElement("div", { style: { padding: '10px' } }, item.materials?.map((material, materialIndex) => (React.createElement("div", { key: materialIndex, className: "info", style: { width: '250px' } },
                                    material.name,
                                    "\u00D7",
                                    material.amount)))))))))))))));
};

export { Danfang as default };
