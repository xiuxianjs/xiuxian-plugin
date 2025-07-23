import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './supermarket.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/fairyrealm.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const Supermarket = ({ Exchange_list }) => {
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
                            React.createElement("div", null, "\u51B2\u6C34\u5802"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u4E0A\u67B6\u6307\u4EE4\uFF1A#\u4E0A\u67B6+\u7269\u54C1\u540D*\u4EF7\u683C*\u6570\u91CF"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u9009\u8D2D\u6307\u4EE4\uFF1A#\u9009\u8D2D+\u7F16\u53F7*\u6570\u91CF"),
                            React.createElement("div", { style: { fontSize: '0.8em' } }, "\u4E0B\u67B6\u6307\u4EE4\uFF1A#\u4E0B\u67B6+\u7F16\u53F7")),
                        React.createElement("div", { className: "use_data_body" }, Exchange_list &&
                            Exchange_list.map((item, index) => (React.createElement("div", { key: index, className: "user_font" },
                                React.createElement("div", null,
                                    item.name.class === '装备' ? (React.createElement("div", { style: { display: 'inline-block' } },
                                        "\u3010",
                                        item.name.class,
                                        "\u3011",
                                        item.name.name,
                                        "\u3010",
                                        item.pinji,
                                        "\u3011")) : (React.createElement("div", { style: { display: 'inline-block' } },
                                        "\u3010",
                                        item.name.class,
                                        "\u3011",
                                        item.name.name)),
                                    React.createElement("div", { className: "number" },
                                        "No.",
                                        item.num)),
                                item.name.class === '装备' && (React.createElement(React.Fragment, null,
                                    item.name.atk > 10 ||
                                        item.name.def > 10 ||
                                        item.name.HP > 10 ? (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "info" }, "\u5C5E\u6027:\u65E0"),
                                        React.createElement("div", { className: "info" },
                                            "\u653B\u51FB\uFF1A",
                                            item.name.atk.toFixed(0)),
                                        React.createElement("div", { className: "info" },
                                            "\u9632\u5FA1\uFF1A",
                                            item.name.def.toFixed(0)),
                                        React.createElement("div", { className: "info" },
                                            "\u8840\u91CF\uFF1A",
                                            item.name.HP.toFixed(0)))) : (React.createElement(React.Fragment, null,
                                        React.createElement("div", { className: "info" },
                                            "\u5C5E\u6027:",
                                            ['金', '木', '土', '水', '火'][item.name.id - 1]),
                                        React.createElement("div", { className: "info" },
                                            "\u653B\u51FB\uFF1A",
                                            (item.name.atk * 100).toFixed(0),
                                            "%"),
                                        React.createElement("div", { className: "info" },
                                            "\u9632\u5FA1\uFF1A",
                                            (item.name.def * 100).toFixed(0),
                                            "%"),
                                        React.createElement("div", { className: "info" },
                                            "\u8840\u91CF\uFF1A",
                                            (item.name.HP * 100).toFixed(0),
                                            "%"))),
                                    React.createElement("div", { className: "info" },
                                        "\u66B4\uFF1A",
                                        (item.name.bao * 100).toFixed(0),
                                        "%"))),
                                item.name.class === '仙宠' && (React.createElement("div", { className: "info" },
                                    "\u7B49\u7EA7\uFF1A",
                                    item.name.等级.toFixed(0))),
                                React.createElement("div", { className: "info" },
                                    "\u5355\u4EF7\uFF1A",
                                    item.price),
                                React.createElement("div", { className: "info" },
                                    "\u6570\u91CF\uFF1A",
                                    item.aconut),
                                React.createElement("div", { className: "info" },
                                    "\u603B\u4EF7\uFF1A",
                                    item.whole),
                                React.createElement("div", { className: "info" },
                                    "QQ\uFF1A",
                                    item.qq)))))))))));
};

export { Supermarket as default };
