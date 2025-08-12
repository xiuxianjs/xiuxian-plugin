import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/player.jpg.js';
import fileUrl$1 from '../img/player_footer.png.js';
import { getAvatar } from './core.js';
import { Avatar } from './Avatar.js';

const Daoju = ({ nickname, user_id, daoju_have = [], daoju_need = [] }) => {
    return (React.createElement(HTML, { className: " w-full text-center p-4 md:p-8 bg-top bg-no-repeat", style: {
            backgroundImage: `url(${fileUrl}), url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100%, auto'
        } },
        React.createElement("main", { className: "max-w-4xl mx-auto space-y-10" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement(Avatar, { src: getAvatar(user_id) }),
                React.createElement("h1", { className: "inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest shadow-lg text-white/90 drop-shadow-lg border border-white/20" },
                    nickname,
                    "\u7684\u9053\u5177")),
            daoju_have.length > 0 && (React.createElement("section", { className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-emerald-400/40 p-4 md:p-6 shadow-lg space-y-4" },
                React.createElement("h2", { className: "text-lg md:text-xl font-semibold tracking-wide text-emerald-300 drop-shadow mb-2" }, "\u3010\u5DF2\u62E5\u6709\u3011"),
                React.createElement("div", { className: "grid gap-4 sm:grid-cols-2" }, daoju_have.map((item, index) => (React.createElement("article", { key: index, className: "rounded-xl bg-gradient-to-br from-emerald-800/30 to-emerald-500/20 p-4 flex flex-col gap-2 shadow-inner hover:shadow-emerald-400/30 hover:scale-[1.02] transition-all border border-emerald-400/20" },
                    React.createElement("h3", { className: "text-base font-bold tracking-wide mb-1 text-emerald-200 drop-shadow" }, item.name),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u7C7B\u578B\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, item.name)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u63CF\u8FF0\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, item.desc)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement("span", { className: "font-semibold text-amber-300" }, item.出售价.toFixed(0))))))))),
            daoju_need.length > 0 && (React.createElement("section", { className: "rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-red-400/40 p-4 md:p-6 shadow-lg space-y-4" },
                React.createElement("h2", { className: "text-lg md:text-xl font-semibold tracking-wide text-red-300 drop-shadow mb-2" }, "\u3010\u672A\u62E5\u6709\u3011"),
                React.createElement("div", { className: "grid gap-4 sm:grid-cols-2" }, daoju_need.map((item, index) => (React.createElement("article", { key: index, className: "rounded-xl bg-gradient-to-br from-red-800/30 to-red-500/20 p-4 flex flex-col gap-2 shadow-inner hover:shadow-red-400/30 hover:scale-[1.02] transition-all border border-red-400/20" },
                    React.createElement("h3", { className: "text-base font-bold tracking-wide mb-1 text-red-200 drop-shadow" }, item.name),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u7C7B\u578B\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, item.name)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u63CF\u8FF0\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, item.desc)),
                    React.createElement("div", { className: "text-sm text-white/80" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement("span", { className: "font-semibold text-amber-300" }, item.出售价.toFixed(0))))))))))));
};

export { Daoju as default };
