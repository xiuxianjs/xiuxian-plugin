import React from 'react';
import { LinkStyleSheet } from 'jsxp';
import fileUrl from './updateRecord.css.js';

var updateRecord = ({ Record }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(LinkStyleSheet, { src: fileUrl }),
        React.createElement("div", { className: "changelog-container" },
            React.createElement("h2", null, "\u66F4\u65B0\u65E5\u5FD7"),
            React.createElement("ul", { className: "changelog-list" }, Record.map((item, index) => (React.createElement("li", { key: item.id || index, className: "changelog-item" },
                React.createElement("div", { className: "user-info" },
                    item.user.avatar ? (React.createElement("img", { src: item.user.avatar, alt: item.user.name, className: "user-avatar" })) : (React.createElement("div", { className: "user-avatar-placeholder" }, item.user.name.charAt(0))),
                    React.createElement("span", { className: "user-name" }, item.user.name)),
                React.createElement("div", { className: "changelog-content" },
                    React.createElement("p", { className: "changelog-text" }, item.text),
                    React.createElement("time", { className: "changelog-time" }, item.time)))))))));
};

export { updateRecord as default };
