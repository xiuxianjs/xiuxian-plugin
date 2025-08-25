import React from 'react';
import classNames from 'classnames';
import fileUrl from '../img/shituhelp.jpg.js';
import fileUrl$1 from '../img/icon.png.js';
import HTML from './HTML.js';

const ShituHelp = ({ version, helpData = [] }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: ' bg-cover bg-center flex flex-col items-center py-8', style: { backgroundImage: `url('${fileUrl}')` } },
            React.createElement("div", { className: 'w-full max-w-2xl mx-auto' },
                React.createElement("div", { className: 'rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center' },
                    React.createElement("div", { className: 'text-2xl font-bold text-blue-700 mb-2 flex items-center gap-2' },
                        React.createElement("span", { className: 'flex w-10 h-10 rounded bg-blue-200 items-center justify-center' },
                            React.createElement("img", { src: fileUrl$1, alt: 'icon', className: 'w-8 h-8' })),
                        "#\u5E08\u5F92\u5E2E\u52A9",
                        React.createElement("span", { className: 'ml-2 text-base text-gray-500' }, version))),
                helpData.map((val, idx) => (React.createElement("div", { className: 'rounded-xl shadow bg-white/70 p-4 mb-6', key: idx },
                    React.createElement("div", { className: 'text-lg font-semibold text-blue-600 mb-2' }, val.group),
                    React.createElement("div", { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' }, val.list.map((item, i) => (React.createElement("div", { className: 'flex items-start gap-3 p-3 border rounded-lg bg-gray-50', key: i },
                        React.createElement("span", { className: classNames('flex w-10 h-10 rounded bg-blue-100 items-center justify-center', item.icon) },
                            React.createElement("img", { src: fileUrl$1, alt: 'icon', className: 'w-8 h-8' })),
                        React.createElement("div", null,
                            React.createElement("strong", { className: 'block text-base text-blue-800 mb-1' }, item.title),
                            React.createElement("span", { className: 'block text-sm text-gray-700' }, item.desc))))))))),
                React.createElement("div", { className: 'text-center text-gray-500 mt-8' },
                    "Created By xiuxian",
                    React.createElement("span", { className: 'ml-2 text-base text-blue-400' }, "@1.3.0"))))));
};

export { ShituHelp as default };
