import React from 'react';
import { LinkStyleSheet } from 'jsxp';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import classNames from 'classnames';

const HTML = (props) => {
    const { linkStyleSheets = [], dangerouslySetInnerHTML, children, className, ...reSet } = props;
    return (React.createElement("html", { className: 'p-0 m-0' },
        React.createElement("head", null,
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            linkStyleSheets.map((src, index) => (React.createElement(LinkStyleSheet, { key: index, src: src }))),
            React.createElement("meta", { httpEquiv: 'content-type', content: 'text/html;charset=utf-8' }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
              @font-face {
                font-family: 'tttgbnumber';
                src: url('${fileUrl$1}'); 
                font-weight: normal; 
                font-style: normal; 
              }
              body { 
                font-family: 'tttgbnumber', 
                system-ui, sans-serif; 
              }
            `
                } }),
            dangerouslySetInnerHTML && React.createElement("style", { dangerouslySetInnerHTML: dangerouslySetInnerHTML })),
        React.createElement("body", { className: classNames('p-0 m-0 w-full text-center', className), ...reSet }, children)));
};

export { HTML as default };
