import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './adminset.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/state.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const XiuxianSettings = ({ CDassociation, CDjoinassociation, CDassociationbattle, CDrob, CDgambling, CDcouple, CDgarden, CDlevel_up, CDsecretplace, CDtimeplace, CDforbiddenarea, CDreborn, CDtransfer, CDhonbao, percentagecost, percentageMoneynumber, percentagepunishment, sizeMoney, switchplay, switchMoneynumber, switchcouple, switchXiuianplay_key, biguansize, biguantime, biguancycle, worksize, worktime, workcycle, SecretPlaceone, SecretPlacetwo, SecretPlacethree }) => {
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
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u4FEE\u4ED9\u8BBE\u7F6E")))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "\u51B7\u5374\u8BBE\u7F6E"),
                            React.createElement("div", { className: "user_font" },
                                React.createElement("div", null,
                                    "\u5B97\u95E8\u7EF4\u62A4\uFF1A",
                                    CDassociation,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u9000\u5B97\uFF1A",
                                    CDjoinassociation,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u5B97\u95E8\u5927\u6218\uFF1A",
                                    CDassociationbattle,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u6253\u52AB\uFF1A",
                                    CDrob,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u91D1\u94F6\u574A\uFF1A",
                                    CDgambling,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u53CC\u4FEE\uFF1A",
                                    CDcouple,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u836F\u56ED\uFF1A",
                                    CDgarden,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u7A81\u7834\uFF1A",
                                    CDlevel_up,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u79D8\u5883\uFF1A",
                                    CDsecretplace,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u4ED9\u5E9C\uFF1A",
                                    CDtimeplace,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u7981\u5730\uFF1A",
                                    CDforbiddenarea,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u91CD\u751F\uFF1A",
                                    CDreborn,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u8F6C\u8D26\uFF1A",
                                    CDtransfer,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u62A2\u7EA2\u5305\uFF1A",
                                    CDhonbao,
                                    "\u5206"))))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "\u91D1\u94F6\u574A\u8BBE\u7F6E"),
                            React.createElement("div", { className: "user_font" },
                                React.createElement("div", null,
                                    "\u624B\u7EED\u8D39\uFF1A",
                                    percentagecost),
                                React.createElement("div", null,
                                    "\u91D1\u94F6\u574A\u6536\u76CA\uFF1A",
                                    percentageMoneynumber),
                                React.createElement("div", null,
                                    "\u51FA\u5343\u6536\u76CA\uFF1A",
                                    percentagepunishment),
                                React.createElement("div", null,
                                    "\u51FA\u5343\u63A7\u5236\uFF1A",
                                    sizeMoney,
                                    "\u4E07"))))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "\u5F00\u5173"),
                            React.createElement("div", { className: "user_font" },
                                React.createElement("div", null,
                                    "\u6021\u7EA2\u9662\uFF1A",
                                    switchplay),
                                React.createElement("div", null,
                                    "\u91D1\u94F6\u574A\uFF1A",
                                    switchMoneynumber),
                                React.createElement("div", null,
                                    "\u53CC\u4FEE\uFF1A",
                                    switchcouple),
                                React.createElement("div", null,
                                    "\u6021\u7EA2\u9662\u5361\u56FE\uFF1A",
                                    switchXiuianplay_key))))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "\u6536\u76CA\u8BBE\u7F6E"),
                            React.createElement("div", { className: "user_font" },
                                React.createElement("div", null,
                                    "\u95ED\u5173\u500D\u7387\uFF1A",
                                    biguansize),
                                React.createElement("div", null,
                                    "\u95ED\u5173\u6700\u4F4E\u65F6\u95F4\uFF1A",
                                    biguantime,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u95ED\u5173\u5468\u671F\uFF1A",
                                    biguancycle),
                                React.createElement("div", null,
                                    "\u9664\u5996\u500D\u7387\uFF1A",
                                    worksize),
                                React.createElement("div", null,
                                    "\u9664\u5996\u6700\u4F4E\u65F6\u95F4\uFF1A",
                                    worktime,
                                    "\u5206"),
                                React.createElement("div", null,
                                    "\u9664\u5996\u5468\u671F\uFF1A",
                                    workcycle))))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "\u51FA\u91D1\u8BBE\u7F6E"),
                            React.createElement("div", { className: "user_font" },
                                React.createElement("div", null,
                                    "\u7B2C\u4E00\u6982\u7387\uFF1A",
                                    SecretPlaceone),
                                React.createElement("div", null,
                                    "\u7B2C\u4E8C\u6982\u7387\uFF1A",
                                    SecretPlacetwo),
                                React.createElement("div", null,
                                    "\u7B2C\u4E09\u6982\u7387\uFF1A",
                                    SecretPlacethree))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { XiuxianSettings as default };
