import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../styles/temp.scss.js';

const Temp = ({ temp = [] }) => {
    return (React.createElement(HTML, { linkStyleSheets: [fileUrl] },
        React.createElement("div", { className: 'min-h-screen bg-gradient-to-b from-amber-50 via-yellow-100 to-orange-200 flex flex-col items-center py-8 relative overflow-hidden' },
            React.createElement("div", { className: 'absolute inset-0 bg-gradient-overlay' }),
            React.createElement("div", { className: 'absolute top-0 left-0 w-full h-32 bg-top-fade' }),
            React.createElement("div", { className: 'absolute bottom-0 left-0 w-full h-32 bg-bottom-fade' }),
            React.createElement("div", { className: 'w-full max-w-4xl mx-auto px-4 relative z-10' },
                React.createElement("div", { className: 'space-y-4' }, temp?.map((item, index) => (React.createElement("div", { key: index, className: 'relative group' },
                    React.createElement("div", { className: 'xiuxian-message bg-gradient-to-br from-white/90 via-amber-50/95 to-orange-50/90 backdrop-blur-md rounded-2xl px-4 py-3 shadow-2xl border border-amber-300/50 overflow-hidden' },
                        React.createElement("div", { className: 'corner-decoration top-0 left-0 w-16 h-16 rounded-br-2xl' }),
                        React.createElement("div", { className: 'corner-decoration top-0 right-0 w-12 h-12 rounded-bl-2xl' }),
                        React.createElement("div", { className: 'corner-decoration bottom-0 left-0 w-10 h-10 rounded-tr-2xl' }),
                        React.createElement("div", { className: 'corner-decoration bottom-0 right-0 w-14 h-14 rounded-tl-2xl' }),
                        React.createElement("div", { className: 'flex items-start space-x-4' },
                            React.createElement("div", { className: 'message-number flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 border-amber-300/50' },
                                React.createElement("span", { className: 'text-white text-lg font-bold xiuxian-text', style: { fontFamily: 'tttgbnumber' } }, index + 1)),
                            React.createElement("div", { className: 'flex-1 min-w-0' },
                                React.createElement("div", { className: 'message-content rounded-xl px-3 py-2 border border-amber-200/50' },
                                    React.createElement("div", { className: 'text-lg text-gray-800 font-medium leading-relaxed xiuxian-text', style: { fontFamily: 'tttgbnumber' } }, item)))),
                        React.createElement("div", { className: 'absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rounded-full' })),
                    index < temp.length - 1 && (React.createElement("div", { className: 'connection-line absolute left-6 top-full w-0.5 h-6' })))))),
                React.createElement("div", { className: 'text-center mt-5' },
                    React.createElement("div", { className: 'bottom-decoration inline-block px-6 py-3 rounded-xl' },
                        React.createElement("span", { className: 'text-amber-100 text-sm font-medium xiuxian-text', style: { fontFamily: 'tttgbnumber' } }, "\uD83C\uDFAD \u4FEE\u4ED9\u4E4B\u8DEF\uFF0C\u6C38\u65E0\u6B62\u5883 \uD83C\uDFAD")))))));
};

export { Temp as default };
