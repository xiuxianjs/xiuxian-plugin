import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './valuables.css.js';
import fileUrl$1 from '../../img/valuables-top.jpg.js';
import fileUrl$2 from '../../img/valuables-danyao.jpg.js';

const floors = [
    { name: '#功法楼', type: '功法' },
    { name: '#丹药楼', type: '丹药' },
    { name: '#装备楼', type: '装备' },
    { name: '#道具楼', type: '道具' },
    { name: '#仙宠楼', type: '仙宠' }
];
const FloorSection = ({ name, type }) => (React.createElement("div", { className: "user_bottom1" },
    React.createElement("div", { className: "use_data" },
        React.createElement("div", { className: "use_data_head" },
            React.createElement("div", { className: "user_font" }, name),
            React.createElement("div", { className: "user_font" },
                "\u7C7B\u578B: ",
                type),
            React.createElement("div", { className: "user_font" },
                "\u67E5\u770B\u5168\u90E8",
                type,
                "\u4EF7\u683C")))));
const Valuables = () => {
    const styles = `
    body {
      transform: scale(1);
      width: 100%;
      text-align: center;
    }
    .user_bottom0 {
      width: 100%;
      height: 285px;
      margin: auto;
      background-image: url('${fileUrl$1}');
      background-size: 100% auto;
    }
    .user_bottom1 {
      margin: auto;
      background-image: url('${fileUrl$2}');
      background-size: 100% auto;
    }
    .user_bottom2 {
      width: 100%;
      margin: auto;
      background-image: url('${fileUrl$2}');
      background-size: 100% auto;
      padding-top: 20px;
    }
  `;
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("style", { dangerouslySetInnerHTML: { __html: styles } })),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "user_float" },
                    React.createElement("div", { className: "use_data0" },
                        React.createElement("div", { className: "user_font_0" }, "#\u4E07\u5B9D\u697C"))),
                React.createElement("div", { className: "user_bottom0" }),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "\u4FEE\u4ED9\u754C\u6700\u5927\u7684\u5F53\u94FA"),
                            React.createElement("div", { className: "user_font" }, "\u6C47\u805A\u5929\u4E0B\u6240\u6709\u7269\u54C1"),
                            React.createElement("div", { className: "user_font" }, "\u5FEB\u53BB\u79D8\u5883\u5386\u7EC3\u83B7\u5F97\u795E\u5668\u5427")))),
                floors.map((floor, index) => (React.createElement(FloorSection, { key: index, name: floor.name, type: floor.type }))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Valuables as default };
