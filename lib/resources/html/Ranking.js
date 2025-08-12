import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/state.jpg.js';
import fileUrl$1 from '../img/user_state2.png.js';

const Ranking = ({ user_id, messages = [], title, values }) => {
    return (React.createElement(HTML, { className: "min-h-screen bg-cover bg-center flex flex-col items-center justify-center", style: { backgroundImage: `url('${fileUrl}')` } },
        React.createElement("div", { className: "h-16 w-full" }),
        user_id && (React.createElement("div", { className: "flex justify-center px-5 text-white w-full max-w-3xl" },
            React.createElement("div", { className: "relative flex items-center justify-center" },
                React.createElement("div", { className: "p-6" },
                    React.createElement("img", { className: "w-40 h-40 rounded-full shadow-xl border-4 border-white/30 backdrop-blur-lg bg-white/20", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, alt: "\u5934\u50CF" })),
                React.createElement("img", { className: "w-52 h-52 rounded-full absolute", src: fileUrl$1, alt: "\u72B6\u6001" })),
            React.createElement("div", { className: "ml-6 flex-1 px-6 py-4 rounded-2xl shadow-2xl border border-white/30 bg-white/30 backdrop-blur-xl text-white" },
                React.createElement("div", { className: "flex flex-col gap-2" }, messages)))),
        React.createElement("div", { className: "w-full max-w-3xl flex flex-col items-center mt-8 px-5 gap-2 text-white" },
            React.createElement("div", { className: "border rounded-t-md w-full flex justify-center bg-white/30 backdrop-blur-xl shadow" },
                React.createElement("span", { className: "text-2xl font-extrabold text-blue-900" }, title)),
            values && values.length > 0 ? (React.createElement("div", { className: "w-full flex flex-col gap-6" }, values.map((item, index) => (React.createElement("div", { key: index, className: "backdrop-blur-xl shadow-lg border border-white/30 p-5 flex gap-2 items-start transition-transform duration-200 bg-white/40 rounded-xl" }, item))))) : null),
        React.createElement("div", { className: "h-16 w-full" })));
};

export { Ranking as default };
