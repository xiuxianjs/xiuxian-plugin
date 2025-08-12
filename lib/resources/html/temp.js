import React from 'react';
import fileUrl from '../img/najie.jpg.js';
import HTML from './HTML.js';

const Temp = ({ temp }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: "min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col items-center py-8", style: {
                backgroundImage: `url('${fileUrl}')`,
                backgroundSize: 'cover'
            } },
            React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                React.createElement("div", { className: "rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center" }, temp &&
                    temp.map((item, index) => (React.createElement("div", { key: index, className: "w-full mb-4" },
                        React.createElement("div", { className: "text-base text-gray-800 font-medium mb-2" }, item),
                        React.createElement("div", { className: "w-full border-b border-dashed border-gray-400" })))))))));
};

export { Temp as default };
