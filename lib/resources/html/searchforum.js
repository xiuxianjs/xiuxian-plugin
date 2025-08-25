import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/fairyrealm.jpg.js';

const SearchForum = ({ Forum, nowtime }) => {
    return (React.createElement(HTML, { className: ' bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8', style: {
            backgroundImage: `url('${fileUrl}')`,
            backgroundSize: 'cover'
        } },
        React.createElement("div", { className: 'w-full max-w-2xl mx-auto' },
            React.createElement("div", { className: 'rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center' },
                React.createElement("div", { className: 'text-2xl font-bold text-blue-700 mb-2' }, "\u5192\u9669\u5BB6\u534F\u4F1A"),
                React.createElement("div", { className: 'text-base text-gray-600 mb-1' }, "\u5411\u7740\u4ED9\u5E9C\u4E0E\u795E\u754C,\u6B22\u8FCE\u6765\u5230\u5192\u9669\u5BB6\u534F\u4F1A")),
            React.createElement("div", { className: 'space-y-6' }, Forum?.map((item, index) => (React.createElement("div", { key: index, className: 'rounded-xl shadow bg-white/70 p-4 flex flex-col items-start' },
                React.createElement("div", { className: 'font-semibold text-blue-800 text-lg mb-1' },
                    "\u7269\u54C1\uFF1A",
                    item.thing.name,
                    "\u3010",
                    item.pinji,
                    "\u3011"),
                React.createElement("div", { className: 'text-sm text-gray-700 mb-1' },
                    "No.",
                    index + 1),
                React.createElement("div", { className: 'text-sm text-gray-700 mb-1' },
                    "\u7C7B\u578B\uFF1A",
                    item.thing.class),
                React.createElement("div", { className: 'text-sm text-gray-700 mb-1' },
                    "\u6570\u91CF\uFF1A",
                    item.thingNumber),
                React.createElement("div", { className: 'text-sm text-green-700 mb-1' },
                    "\u91D1\u989D\uFF1A",
                    item.thingJIAGE),
                item.end_time - nowtime > 0 && (React.createElement("div", { className: 'text-sm text-red-600' },
                    "CD\uFF1A",
                    ((item.end_time - nowtime) / 60000).toFixed(0),
                    "\u5206",
                    (((item.end_time - nowtime) % 60000) / 1000).toFixed(0),
                    "\u79D2")))))))));
};

export { SearchForum as default };
