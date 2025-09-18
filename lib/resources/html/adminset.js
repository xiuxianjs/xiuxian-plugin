import React from 'react';
import fileUrl from '../img/state.jpg.js';
import HTML from './HTML.js';
import { BackgroundImage } from 'jsxp';

const XiuxianIcon = ({ type }) => {
    const iconMap = {
        宗门维护: '🏛️',
        退宗: '🚪',
        宗门大战: '⚔️',
        打劫: '🗡️',
        金银坊: '💰',
        双修: '💕',
        药园: '🌿',
        突破: '⚡',
        秘境: '🏔️',
        仙府: '🏯',
        禁地: '☠️',
        重生: '🔄',
        转账: '💸',
        抢红包: '🧧',
        手续费: '💎',
        金银坊收益: '🏆',
        出千收益: '🎲',
        出千控制: '🎯',
        怡红院: '🏮',
        怡红院卡图: '🖼️',
        闭关倍率: '🧘',
        闭关最低时间: '⏰',
        闭关周期: '📅',
        除妖倍率: '👹',
        除妖最低时间: '⏱️',
        除妖周期: '🗓️',
        第一概率: '🥇',
        第二概率: '🥈',
        第三概率: '🥉'
    };
    return React.createElement("span", { className: 'text-lg mr-2 opacity-80' }, iconMap[type] || '⚙️');
};
const SettingItem = ({ label, value, unit = '' }) => (React.createElement("div", { className: 'relative group' },
    React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 rounded-xl blur-sm' }),
    React.createElement("div", { className: 'relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl' },
        React.createElement("div", { className: 'absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent' }),
        React.createElement("div", { className: 'flex items-center justify-between' },
            React.createElement("div", { className: 'flex items-center' },
                React.createElement(XiuxianIcon, { type: label }),
                React.createElement("span", { className: 'font-medium tracking-wide text-white/90 text-sm' }, label)),
            React.createElement("div", { className: 'flex items-center' },
                React.createElement("span", { className: 'font-bold text-amber-300 text-lg tracking-wider' }, value),
                unit && React.createElement("span", { className: 'ml-1 text-amber-200/80 text-sm font-medium' }, unit))),
        React.createElement("div", { className: 'absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent' }))));
const SettingSection = ({ title, children }) => (React.createElement("section", { className: 'relative' },
    React.createElement("div", { className: 'absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 rounded-3xl blur-sm' }),
    React.createElement("div", { className: 'relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/20 rounded-3xl p-6 shadow-2xl' },
        React.createElement("div", { className: 'absolute top-4 left-4 w-3 h-3 border-l-2 border-t-2 border-amber-400 rounded-tl-lg' }),
        React.createElement("div", { className: 'absolute top-4 right-4 w-3 h-3 border-r-2 border-t-2 border-amber-400 rounded-tr-lg' }),
        React.createElement("div", { className: 'absolute bottom-4 left-4 w-3 h-3 border-l-2 border-b-2 border-amber-400 rounded-bl-lg' }),
        React.createElement("div", { className: 'absolute bottom-4 right-4 w-3 h-3 border-r-2 border-b-2 border-amber-400 rounded-br-lg' }),
        React.createElement("div", { className: 'mb-6' },
            React.createElement("h2", { className: 'text-2xl font-bold tracking-widest text-center text-white/95 flex items-center justify-center gap-3' },
                React.createElement("div", { className: 'w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent' }),
                React.createElement("span", { className: 'bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent' }, title),
                React.createElement("div", { className: 'w-8 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent' }))),
        React.createElement("div", { className: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }, children))));
const XiuxianSettings = props => {
    const cooldownSettings = [
        { label: '宗门维护', value: props.CDassociation, unit: '分' },
        { label: '退宗', value: props.CDjoinassociation, unit: '分' },
        { label: '宗门大战', value: props.CDassociationbattle, unit: '分' },
        { label: '打劫', value: props.CDrob, unit: '分' },
        { label: '金银坊', value: props.CDgambling, unit: '分' },
        { label: '双修', value: props.CDcouple, unit: '分' },
        { label: '药园', value: props.CDgarden, unit: '分' },
        { label: '突破', value: props.CDlevel_up, unit: '分' },
        { label: '秘境', value: props.CDsecretplace, unit: '分' },
        { label: '仙府', value: props.CDtimeplace, unit: '分' },
        { label: '禁地', value: props.CDforbiddenarea, unit: '分' },
        { label: '重生', value: props.CDreborn, unit: '分' },
        { label: '转账', value: props.CDtransfer, unit: '分' },
        { label: '抢红包', value: props.CDhonbao, unit: '分' }
    ];
    const gamblingSettings = [
        { label: '手续费', value: props.percentagecost },
        { label: '金银坊收益', value: props.percentageMoneynumber },
        { label: '出千收益', value: props.percentagepunishment },
        { label: '出千控制', value: props.sizeMoney, unit: '万' }
    ];
    const switchSettings = [
        { label: '怡红院', value: props.switchplay },
        { label: '金银坊', value: props.switchMoneynumber },
        { label: '双修', value: props.switchcouple },
        { label: '怡红院卡图', value: props.switchXiuianplay_key }
    ];
    const incomeSettings = [
        { label: '闭关倍率', value: props.biguansize },
        { label: '闭关最低时间', value: props.biguantime, unit: '分' },
        { label: '闭关周期', value: props.biguancycle },
        { label: '除妖倍率', value: props.worksize },
        { label: '除妖最低时间', value: props.worktime, unit: '分' },
        { label: '除妖周期', value: props.workcycle }
    ];
    const goldSettings = [
        { label: '第一概率', value: props.SecretPlaceone },
        { label: '第二概率', value: props.SecretPlacetwo },
        { label: '第三概率', value: props.SecretPlacethree }
    ];
    const settingSections = [
        { title: '⚡ 冷却设置', settings: cooldownSettings },
        { title: '💰 金银坊设置', settings: gamblingSettings },
        { title: '🎛️ 开关控制', settings: switchSettings },
        { title: '📈 收益设置', settings: incomeSettings },
        { title: '🏆 出金设置', settings: goldSettings }
    ];
    return (React.createElement(HTML, null,
        React.createElement(BackgroundImage, { src: [fileUrl], className: ' w-full bg-cover bg-center text-center p-4 md:p-8 space-y-8' },
            React.createElement("header", { className: 'relative text-center space-y-6' },
                React.createElement("div", { className: 'relative' },
                    React.createElement("h1", { className: 'relative inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-md border border-amber-400/30 text-3xl md:text-4xl font-bold tracking-widest text-white shadow-2xl' }, "\uD83C\uDFEE \u4FEE\u4ED9\u8BBE\u7F6E \uD83C\uDFEE"))),
            React.createElement("main", { className: 'max-w-7xl mx-auto space-y-10' },
                React.createElement("div", { className: 'flex flex-col gap-10' }, settingSections.map((section, sectionIndex) => (React.createElement(SettingSection, { key: sectionIndex, title: section.title }, section.settings.map((setting, index) => (React.createElement(SettingItem, { key: index, label: setting.label, value: setting.value, unit: setting.unit })))))))),
            React.createElement("footer", { className: 'text-center py-8' },
                React.createElement("div", { className: 'inline-block px-6 py-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 backdrop-blur-sm border border-amber-400/20 rounded-xl' },
                    React.createElement("span", { className: 'text-amber-300/80 text-sm tracking-wide' }, "\u2728 \u4FEE\u4ED9\u4E4B\u8DEF\uFF0C\u9053\u6CD5\u81EA\u7136 \u2728"))))));
};

export { XiuxianSettings as default };
