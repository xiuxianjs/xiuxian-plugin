import React from 'react';
import fileUrl from '../img/state.jpg.js';
import HTML from './HTML.js';

const Statezhiye = ({ Level_list }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: "min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8", style: {
                backgroundImage: `url(${fileUrl})`,
                backgroundSize: 'cover'
            } },
            React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                React.createElement("div", { className: "rounded-xl shadow-lg bg-white bg-opacity-70 p-6 mb-6 flex flex-col items-center" },
                    React.createElement("div", { className: "text-2xl font-bold text-blue-700 mb-2" }, "\u804C\u4E1A\u7B49\u7EA7"),
                    React.createElement("div", { className: "w-full" }, Level_list?.map((item, index) => (React.createElement("div", { key: index, className: "border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition mb-4" },
                        React.createElement("div", { className: "font-bold text-blue-800 text-lg mb-2" },
                            "\u7B49\u7EA7\uFF1A",
                            item.name),
                        React.createElement("div", { className: "text-sm text-gray-700" },
                            "\u719F\u7EC3\u5EA6\u8981\u6C42\uFF1A",
                            item.experience))))))))));
};

export { Statezhiye as default };
