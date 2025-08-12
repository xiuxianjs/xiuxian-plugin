import React from 'react';
import fileUrl from '../img/player.jpg.js';
import HTML from './HTML.js';

const Shitu = ({ user_id, minghao, renwu, tudinum, newchengyuan, shimen, rw1, wancheng1, rw2, wancheng2, rw3, wancheng3, chengyuan }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: "min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8", style: {
                backgroundImage: `url('${fileUrl}')`,
                backgroundSize: 'cover'
            } },
            React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
                React.createElement("div", { className: "flex flex-row items-center gap-6 mb-6" },
                    React.createElement("div", { className: "flex flex-col items-center" },
                        React.createElement("img", { className: "w-28 h-28 rounded-full shadow-lg border-4 border-white/30 mb-2", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, alt: "\u5934\u50CF" }),
                        React.createElement("div", { className: "text-sm text-gray-700" },
                            "QQ:",
                            user_id)),
                    React.createElement("div", { className: "flex-1 flex flex-col gap-2" },
                        React.createElement("div", { className: "text-base text-blue-800 font-bold" },
                            "\u540D\u53F7: ",
                            minghao),
                        React.createElement("div", { className: "text-base text-gray-700" },
                            "\u4EFB\u52A1\u9636\u6BB5: ",
                            renwu),
                        React.createElement("div", { className: "text-base text-gray-700" },
                            "\u5E08\u95E8\u4EBA\u6570: ",
                            tudinum),
                        React.createElement("div", { className: "text-base text-gray-700" },
                            "\u672A\u51FA\u5E08\u5F92\u5F1F: ",
                            newchengyuan),
                        React.createElement("div", { className: "text-base text-green-700" },
                            "\u5E08\u5F92\u79EF\u5206\uFF1A",
                            shimen))),
                React.createElement("div", { className: "rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center" },
                    React.createElement("div", { className: "text-xl font-bold text-blue-700 mb-2" }, "[\u5E08\u5F92\u4EFB\u52A1]"),
                    React.createElement("div", { className: "w-full flex flex-col gap-2" },
                        React.createElement("div", { className: "text-base text-gray-700" }, "\u4EFB\u52A11\uFF1A"),
                        React.createElement("div", { className: "text-base text-gray-800" },
                            rw1,
                            " ",
                            wancheng1),
                        React.createElement("div", { className: "text-base text-gray-700" }, "\u4EFB\u52A12\uFF1A"),
                        React.createElement("div", { className: "text-base text-gray-800" },
                            rw2,
                            " ",
                            wancheng2),
                        React.createElement("div", { className: "text-base text-gray-700" }, "\u4EFB\u52A13\uFF1A"),
                        React.createElement("div", { className: "text-base text-gray-800" },
                            rw3,
                            " ",
                            wancheng3))),
                React.createElement("div", { className: "rounded-xl shadow-lg bg-white/80 p-6 mb-6 flex flex-col items-center" },
                    React.createElement("div", { className: "text-xl font-bold text-blue-700 mb-2" }, "[\u5EA7\u4E0B\u95E8\u5F92]"),
                    React.createElement("div", { className: "w-full flex flex-wrap gap-2" }, chengyuan?.map((item, index) => (React.createElement("span", { key: index, className: "inline-block bg-blue-100 text-blue-900 rounded px-3 py-1 text-sm font-semibold" }, item)))))))));
};

export { Shitu as default };
