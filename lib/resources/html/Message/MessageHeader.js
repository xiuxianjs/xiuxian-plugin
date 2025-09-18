import { Image } from 'jsxp';
import React from 'react';

const MessageHeader = ({ value, children }) => {
    return (React.createElement("section", { className: 'relative select-none flex flex-row justify-between items-center w-full shadow-md' },
        React.createElement("div", { className: 'flex flex-row gap-3 px-2 py-1' },
            React.createElement("div", { className: 'flex items-center' }, value.Avatar ? React.createElement(Image, { className: 'w-10 h-10 rounded-full', src: value.Avatar, alt: 'Avatar' }) : React.createElement("div", { className: 'w-10 h-10 rounded-full bg-white' })),
            React.createElement("div", { className: 'flex flex-col justify-center' },
                React.createElement("div", { className: 'font-semibold ' }, value.Name),
                React.createElement("div", { className: 'text-sm text-[var(--textPreformat-background)]' }, value.Id))),
        React.createElement("div", null, children)));
};

export { MessageHeader as default };
