import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/player.jpg.js';
import { Avatar } from './Avatar.js';

const Shifu = ({ user_id, minghao, renwu, tudinum, shifu, shimen, rw1, wancheng1, rw2, wancheng2, rw3, wancheng3, chengyuan }) => {
    return (React.createElement(HTML, { className: "min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center py-8", style: {
            backgroundImage: `url('${fileUrl}')`,
            backgroundSize: 'cover'
        } },
        React.createElement("div", { className: "w-full max-w-2xl mx-auto" },
            React.createElement("div", { className: "flex flex-row items-center gap-6 mb-6" },
                React.createElement("div", { className: "flex flex-col items-center" },
                    React.createElement(Avatar, { src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, rootClassName: "w-60 h-60", className: "w-40 h-40" }),
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
                        "\u5E08\u5085: ",
                        shifu),
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
                React.createElement("div", { className: "text-xl font-bold text-blue-700 mb-2" }, "[\u540C\u95E8\u5F1F\u5B50]"),
                React.createElement("div", { className: "w-full flex flex-wrap gap-2" }, chengyuan?.map((item, index) => (React.createElement("span", { key: index, className: "inline-block bg-blue-100 text-blue-900 rounded px-3 py-1 text-sm font-semibold" }, item))))))));
};

export { Shifu as default };
