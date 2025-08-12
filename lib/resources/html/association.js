import React from 'react';
import fileUrl from '../img/player.jpg.js';
import fileUrl$1 from '../img/player_footer.png.js';
import HTML from './HTML.js';
import { Avatar } from './Avatar.js';

const BadgeList = ({ title, items }) => (React.createElement("section", { className: "w-full text-white rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-3" },
    React.createElement("h2", { className: "text-lg md:text-xl font-semibold  tracking-wider flex items-center gap-2" },
        React.createElement("span", { className: "w-1.5 h-6 bg-brand-accent rounded-full" }),
        title),
    React.createElement("div", { className: "flex flex-wrap gap-2" }, items?.length ? (items.map((it, i) => (React.createElement("span", { key: i, className: "px-3 py-1 rounded-full bg-brand-dark/60  text-sm font-medium shadow ring-1 ring-brand-accent/20" }, it)))) : (React.createElement("span", { className: "/60 text-sm" }, "\u6682\u65E0")))));
const InfoItem = ({ label, value }) => (React.createElement("div", { className: "flex items-center justify-between gap-4 px-4 py-2 rounded-lg bg-white/30  text-sm md:text-base" },
    React.createElement("span", { className: "font-medium tracking-wide" }, label),
    React.createElement("span", { className: "font-semibold  break-all" }, value)));
const Association = ({ user_id, ass, mainname, mainqq, weizhi, state, xiulian, level, fuzong, zhanglao, neimen, waimen }) => {
    return (React.createElement(HTML, { className: "min-h-screen w-full text-center p-4 md:p-8 bg-top bg-no-repeat bg-[length:100%]", style: {
            backgroundImage: `url(${fileUrl}), url(${fileUrl$1})`,
            backgroundRepeat: 'no-repeat, repeat',
            backgroundSize: '100%, auto'
        } },
        React.createElement("main", { className: "max-w-6xl mx-auto space-y-8" },
            React.createElement("header", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-8" },
                React.createElement("div", { className: "flex flex-col items-center gap-4" },
                    React.createElement(Avatar, { src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, rootClassName: "w-60 h-60", className: "w-40 h-40" }),
                    React.createElement("div", { className: "px-5 py-1.5 rounded-2xl bg-black/40 text-white backdrop-blur  text-lg font-semibold shadow" },
                        "QQ: ",
                        user_id)),
                React.createElement("div", { className: "flex-1 flex w-full rounded-2xl bg-white/5 p-2 pt-5 pb-5  ring-white/10 backdrop-blur-md  shadow-card" },
                    React.createElement("div", { className: "flex-1 grid gap-3 md:grid-cols-2 lg:grid-cols-3" },
                        React.createElement(InfoItem, { label: "\u540D\u79F0", value: ass?.宗门名称 || '-' }),
                        React.createElement(InfoItem, { label: "\u5B97\u4E3B", value: React.createElement("div", null,
                                mainname,
                                React.createElement("br", null),
                                mainqq) }),
                        React.createElement(InfoItem, { label: "\u7B49\u7EA7", value: ass?.宗门等级 ?? '-' }),
                        React.createElement(InfoItem, { label: "\u7075\u77F3", value: ass?.灵石池 ?? 0 }),
                        React.createElement(InfoItem, { label: "\u4EBA\u6570", value: ass?.所有成员?.length ?? 0 }),
                        React.createElement(InfoItem, { label: "\u5B97\u95E8\u4F4D\u7F6E", value: weizhi || '-' })))),
            React.createElement("section", { className: "w-full rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card space-y-4" },
                React.createElement("h2", { className: "text-xl md:text-2xl font-semibold  tracking-wider flex items-center gap-2" },
                    React.createElement("span", { className: "w-1.5 h-6 bg-brand-accent rounded-full" }),
                    "\u4FE1\u606F"),
                React.createElement("div", { className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3" },
                    React.createElement(InfoItem, { label: "\u95E8\u6D3E\u72B6\u6001", value: state }),
                    React.createElement(InfoItem, { label: "\u5929\u8D4B\u52A0\u5F3A", value: `${xiulian}%` }),
                    React.createElement(InfoItem, { label: "\u5927\u9635\u5F3A\u5EA6", value: ass?.大阵血量 ?? 0 }),
                    React.createElement(InfoItem, { label: "\u5165\u5B97\u95E8\u69DB", value: level }),
                    React.createElement(InfoItem, { label: "\u5B97\u95E8\u5EFA\u8BBE\u7B49\u7EA7", value: ass?.宗门建设等级 ?? '-' }),
                    React.createElement(InfoItem, { label: "\u9547\u5B97\u795E\u517D", value: ass?.宗门神兽 ?? '-' }))),
            React.createElement("div", { className: "grid gap-8 md:grid-cols-2" },
                React.createElement(BadgeList, { title: "\u526F\u5B97\u4E3B", items: fuzong }),
                React.createElement(BadgeList, { title: "\u957F\u8001", items: zhanglao })),
            React.createElement("div", { className: "grid gap-8 md:grid-cols-2" },
                React.createElement(BadgeList, { title: "\u5185\u95E8\u5F1F\u5B50", items: neimen }),
                React.createElement(BadgeList, { title: "\u5916\u95E8\u5F1F\u5B50", items: waimen })),
            React.createElement("section", { className: "w-full rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-4 md:p-6 shadow-card" },
                React.createElement("p", { className: "/80 text-sm md:text-base tracking-wide" },
                    "\u521B\u7ACB\u4E8E: ",
                    ass?.创立时间?.[0] || '-')))));
};

export { Association as default };
