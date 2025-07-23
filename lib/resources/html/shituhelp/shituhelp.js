import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './common.css.js';
import fileUrl$1 from './shituhelp.css.js';
import fileUrl$2 from '../../font/tttgbnumber.ttf.js';
import fileUrl$3 from '../../img/help/shituhelp.jpg.js';
import fileUrl$4 from '../../img/help/icon.png.js';

const ShituHelp = ({ version, helpData = [] }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement(LinkStyleSheet, { src: fileUrl$1 }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
          @font-face {
            font-family: 'Number';
            src: url('${fileUrl$2}');
            font-weight: normal;
            font-style: normal;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-user-select: none;
            user-select: none;
          }
          body {
            font-size: 18px;
            color: #47ada8;
            font-family: Number, YS2, PingFangSC-Medium, PingFang SC, sans-serif;
            transform: scale(1.4);
            transform-origin: 0 0;
            width: 600px;
          }
          body {
            transform: scale(1);
            width: 100%;
            background: url('${fileUrl$3}') top left no-repeat;
            background-size: 100% 100%;
          }
          .help-icon {
            width: 40px;
            height: 40px;
            display: block;
            position: absolute;
            background: url('${fileUrl$4}') 0 0 no-repeat;
            background-size: 500px auto;
            border-radius: 5px;
            left: 6px;
            top: 12px;
            transform: scale(0.85);
          }
        `
                } })),
        React.createElement("body", { className: "elem-default default-mode" },
            React.createElement("div", { className: "container", id: "container" },
                React.createElement("div", { className: "info_box" },
                    React.createElement("div", { className: "head-box type" },
                        React.createElement("div", { className: "title" },
                            "#\u5E08\u5F92\u5E2E\u52A9",
                            React.createElement("span", { className: "version" }, version)))),
                helpData.map((val, idx) => (React.createElement("div", { className: "cont-box", key: idx },
                    React.createElement("div", { className: "help-group" }, val.group),
                    React.createElement("div", { className: "help-table" },
                        React.createElement("div", { className: "tr" }, val.list.map((item, i) => (React.createElement("div", { className: "td", key: i },
                            React.createElement("span", { className: `help-icon ${item.icon}` }),
                            React.createElement("strong", { className: "help-title" }, item.title),
                            React.createElement("span", { className: "help-desc" }, item.desc))))))))),
                React.createElement("div", { className: "copyright" },
                    "Created By xiuxian",
                    React.createElement("span", { className: "version" }, "@1.3.0"))))));
};

export { ShituHelp as default };
