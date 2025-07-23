import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './common.css.js';
import fileUrl$1 from './help.css.js';
import fileUrl$2 from '../../img/xiuxian.jpg.js';
import fileUrl$3 from '../../img/icon.png.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../../../../package.json');
const Help = ({ helpData = [] }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement(LinkStyleSheet, { src: fileUrl$1 }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
          body {
            font-size: 18px;
            color: #47ada8;
            font-family: PingFangSC-Medium, PingFang SC, sans-serif;
            transform: scale(1);
            width: 100%;
            background: url('${fileUrl$2}') top left no-repeat;
            background-size: 100% 100%;
          }

          .help-icon {
            width: 40px;
            height: 40px;
            display: block;
            position: absolute;
            background: url('${fileUrl$3}') 0 0 no-repeat;
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
                        React.createElement("div", { className: "title" }, pkg.name))),
                helpData.map((val, index) => (React.createElement("div", { key: index, className: "cont-box" },
                    React.createElement("div", { className: "help-group" }, val.group),
                    React.createElement("div", { className: "help-table" },
                        React.createElement("div", { className: "tr" }, val.list?.map((item, itemIndex) => (React.createElement("div", { key: itemIndex, className: "td" },
                            React.createElement("span", { className: `help-icon ${item.icon}` }),
                            React.createElement("strong", { className: "help-title" }, item.title),
                            React.createElement("span", { className: "help-desc" }, item.desc))))))))),
                React.createElement("div", { className: "copyright" },
                    pkg.name,
                    React.createElement("span", { className: "version" },
                        "v",
                        pkg.version))))));
};

export { Help as default };
