import React from 'react';
import HTML from './HTML.js';
import fileUrl from '../img/player.jpg.js';
import fileUrl$1 from '../img/player_footer.png.js';
import { getAvatar } from './core.js';
import { Avatar } from './Avatar.js';

const Danyao = ({ nickname, user_id, danyao_have = [], danyao2_have = [], danyao_need = [] }) => {
    const renderEffect = (item) => {
        const effects = [];
        if (item.HP)
            effects.push(item.HP);
        if (item.exp)
            effects.push(item.exp);
        if (item.xueqi)
            effects.push(item.xueqi);
        if (item.xingyun > 0)
            effects.push(`${(item.xingyun * 100).toFixed(1)}%`);
        return effects.join('');
    };
    return (React.createElement(HTML, { className: " w-full text-center p-4 md:p-8 bg-top bg-no-repeat relative", style: {
            backgroundImage: `url(${fileUrl}), url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100%, auto'
        } },
        React.createElement("div", { className: "absolute  bg-gradient-to-b from-emerald-900/50 via-emerald-700/30 to-red-900/50 pointer-events-none" }),
        React.createElement("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)] pointer-events-none" }),
        React.createElement("main", { className: "relative max-w-4xl mx-auto space-y-8 z-10" },
            React.createElement("header", { className: "space-y-4 flex flex-col items-center" },
                React.createElement("div", { className: "p-1 rounded-full bg-gradient-to-tr from-emerald-400 via-green-300 to-red-300 shadow-lg shadow-green-500/30" },
                    React.createElement(Avatar, { src: getAvatar(user_id) })),
                React.createElement("h1", { className: "inline-block px-8 py-3 rounded-3xl bg-white/20 backdrop-blur-md border border-emerald-300/40 \n            text-2xl md:text-3xl font-bold tracking-widest \n            shadow-lg text-emerald-100 drop-shadow-[0_0_8px_rgba(0,255,180,0.6)]" },
                    nickname,
                    "\u7684\u4E39\u836F")),
            (danyao_have.length > 0 || danyao2_have.length > 0) && (React.createElement("section", { className: "rounded-2xl bg-emerald-600/20 backdrop-blur-md border border-emerald-300/30 p-4 md:p-6 shadow-xl shadow-emerald-900/20 space-y-4" },
                React.createElement("h2", { className: "text-lg md:text-xl font-semibold tracking-wide mb-2 text-emerald-100 drop-shadow-[0_0_6px_rgba(0,255,200,0.5)]" }, "\u3010\u5DF2\u62E5\u6709\u3011"),
                React.createElement("div", { className: "grid gap-4 sm:grid-cols-2" }, [...danyao_have, ...danyao2_have].map((item, index) => (React.createElement("article", { key: index, className: "rounded-xl bg-white/15 backdrop-blur-sm border border-emerald-300/30 p-4 flex flex-col gap-2 shadow-md \n                             hover:scale-[1.03] hover:shadow-lg hover:bg-white/25 hover:border-emerald-200/50 transition-all duration-300" },
                    React.createElement("h3", { className: "text-base font-bold tracking-wide mb-1 text-emerald-50 drop-shadow" }, item.name),
                    React.createElement("div", { className: "text-sm text-emerald-100/90" },
                        "\u7C7B\u578B\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, item.type)),
                    React.createElement("div", { className: "text-sm text-emerald-100/90" },
                        "\u6548\u679C\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, renderEffect(item))),
                    React.createElement("div", { className: "text-sm text-emerald-100/90" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, item.出售价.toFixed(0))))))))),
            danyao_need.length > 0 && (React.createElement("section", { className: "rounded-2xl bg-red-600/20 backdrop-blur-md border border-red-300/30 p-4 md:p-6 shadow-xl shadow-red-900/20 space-y-4" },
                React.createElement("h2", { className: "text-lg md:text-xl font-semibold tracking-wide mb-2 text-red-100 drop-shadow-[0_0_6px_rgba(255,100,100,0.6)]" }, "\u3010\u672A\u62E5\u6709\u3011"),
                React.createElement("div", { className: "grid gap-4 sm:grid-cols-2" }, danyao_need.map((item, index) => (React.createElement("article", { key: index, className: "rounded-xl bg-white/15 backdrop-blur-sm border border-red-300/30 p-4 flex flex-col gap-2 shadow-md \n                             hover:scale-[1.03] hover:shadow-lg hover:bg-white/25 hover:border-red-200/50 transition-all duration-300" },
                    React.createElement("h3", { className: "text-base font-bold tracking-wide mb-1 text-red-50 drop-shadow" }, item.name),
                    React.createElement("div", { className: "text-sm text-red-100/90" },
                        "\u7C7B\u578B\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, item.type)),
                    React.createElement("div", { className: "text-sm text-red-100/90" },
                        "\u6548\u679C\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, renderEffect(item))),
                    React.createElement("div", { className: "text-sm text-red-100/90" },
                        "\u4EF7\u683C\uFF1A",
                        React.createElement("span", { className: "font-semibold" }, item.出售价.toFixed(0))))))))))));
};

export { Danyao as default };
