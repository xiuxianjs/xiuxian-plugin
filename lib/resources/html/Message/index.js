import React from 'react';
import HTML from '../HTML.js';
import MessageWindow from './MessageWindow.js';

const Message = ({ message, UserId }) => {
    return (React.createElement(HTML, { className: 'w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' },
        React.createElement("div", { className: 'h-full max-w-4xl mx-auto shadow-2xl' },
            React.createElement(MessageWindow, { message: message, UserId: UserId }))));
};

export { Message as default };
