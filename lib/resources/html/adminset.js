import React from 'react';
import fileUrl from '../img/state.jpg.js';
import fileUrl$1 from '../img/user_state.png.js';
import HTML from './HTML.js';

const SettingItem = ({ label, value, unit = '' }) => (React.createElement("div", { className: "flex items-center justify-between gap-4 px-4 py-2 rounded-lg bg-white/30 backdrop-blur-sm  text-sm md:text-base shadow-inner" },
    React.createElement("span", { className: "font-medium tracking-wide" }, label),
    React.createElement("span", { className: "font-semibold " },
        value,
        unit)));
const SettingSection = ({ title, children }) => (React.createElement("section", { className: "w-full rounded-2xl bg-gradient-to-br from-white/5 to-white/10 shadow-card ring-1 ring-white/10 p-4 md:p-6 space-y-4" },
    React.createElement("h2", { className: "text-xl md:text-2xl font-semibold  tracking-wider flex items-center gap-2" },
        React.createElement("span", { className: "inline-block w-1.5 h-6 bg-brand-accent rounded-full" }),
        title),
    React.createElement("div", { className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3" }, children)));
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
        { title: '冷却设置', settings: cooldownSettings },
        { title: '金银坊设置', settings: gamblingSettings },
        { title: '开关', settings: switchSettings },
        { title: '收益设置', settings: incomeSettings },
        { title: '出金设置', settings: goldSettings }
    ];
    return (React.createElement(HTML, { className: "min-h-screen w-full bg-cover bg-fixed bg-top text-center p-4 md:p-8 space-y-8", style: { backgroundImage: `url(${fileUrl})` } },
        React.createElement("main", { className: "max-w-6xl mx-auto space-y-8" },
            React.createElement("header", { className: "text-center space-y-4" },
                React.createElement("div", { className: "mx-auto w-56 h-56 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card", style: { backgroundImage: `url(${fileUrl$1})` } }),
                React.createElement("h1", { className: "inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur text-2xl md:text-3xl font-bold tracking-widest  shadow" }, "#\u4FEE\u4ED9\u8BBE\u7F6E")),
            React.createElement("div", { className: "flex flex-col gap-8" }, settingSections.map((section, sectionIndex) => (React.createElement(SettingSection, { key: sectionIndex, title: section.title }, section.settings.map((setting, index) => (React.createElement(SettingItem, { key: index, label: setting.label, value: setting.value, unit: setting.unit }))))))))));
};

export { XiuxianSettings as default };
