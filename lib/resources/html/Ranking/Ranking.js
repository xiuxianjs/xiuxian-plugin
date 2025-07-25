import { LinkStyleSheet, BackgroundImage } from 'jsxp';
import React from 'react';
import fileUrl from './tailwindcss.css.js';
import fileUrl$1 from '../../img/state.jpg.js';
import fileUrl$2 from '../../img/user_state2.png.js';

const Ranking = ({ user_id, messages = [], title, values }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
            .liquid-glass {
      position: relative;
      background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(200,220,255,0.3) 100%);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37), 0 1.5px 8px 0 rgba(0, 255, 255, 0.15);
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px) saturate(180%);
      overflow: hidden;
    }
          }
          `
                } })),
        React.createElement("body", { className: "p-0 m-0" },
            React.createElement(BackgroundImage, { src: fileUrl$1 },
                React.createElement("div", { className: "h-16 w-full" }),
                user_id && (React.createElement("div", { className: "flex justify-center px-5 text-white " },
                    React.createElement("div", { className: "relative flex items-center justify-center" },
                        React.createElement("div", { className: "p-6" },
                            React.createElement("img", { className: "size-40 rounded-full shadow-xl border-4 border-white/30 backdrop-blur-lg bg-white/20", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, alt: "\u5934\u50CF" })),
                        React.createElement("img", { className: "size-52 rounded-full absolute", src: fileUrl$2, alt: "\u72B6\u6001" })),
                    React.createElement("div", { className: "liquid-glass text-white ml-6 flex-1 px-6 py-4 rounded-2xl shadow-2xl border border-white/30 bg-white/30 backdrop-blur-xl" },
                        React.createElement("div", { className: "flex flex-col gap-2" }, messages)))),
                React.createElement("div", { className: "w-full flex flex-col items-center mt-8 px-5 gap-2 text-white " },
                    React.createElement("div", { className: "liquid-glass border rounded-t-md w-full flex justify-center" },
                        React.createElement("span", { className: "text-2xl  font-extrabold " }, title)),
                    values && values.length > 0 ? (React.createElement("div", { className: "w-full flex flex-col gap-6" }, values.map((item, index) => (React.createElement("div", { key: index, className: "liquid-glass backdrop-blur-xl shadow-lg border border-white/30 p-5 flex gap-2 items-start transition-transform duration-200" }, item))))) : null),
                React.createElement("div", { className: "h-16 w-full" })))));
};

export { Ranking as default };
