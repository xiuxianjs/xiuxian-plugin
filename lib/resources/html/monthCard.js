import React from 'react';
import HTML from './HTML.js';
import { Avatar } from './Avatar.js';
import fileUrl from '../img/fairyrealm.jpg.js';
import fileUrl$1 from '../img/user_state2.png.js';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { BackgroundImage } from 'jsxp';

const monthCardConfigs = {
    small: {
        name: '小月卡',
        price: '28¥',
        icon: '💍',
        colorTheme: {
            bg: 'from-blue-50/80 to-cyan-50/80',
            border: 'border-blue-200/50',
            text: 'text-blue-800',
            price: 'text-blue-600',
            expireBg: 'bg-blue-100/50',
            expireBorder: 'border-blue-200/30',
            expireText: 'text-blue-700'
        }
    },
    big: {
        name: '大月卡',
        price: '58¥',
        icon: '💎',
        colorTheme: {
            bg: 'from-purple-50/80 to-pink-50/80',
            border: 'border-purple-200/50',
            text: 'text-purple-800',
            price: 'text-purple-600',
            expireBg: 'bg-purple-100/50',
            expireBorder: 'border-purple-200/30',
            expireText: 'text-purple-700'
        }
    }
};
const MonthCardItem = ({ type, config, isActive, days, expireInfo }) => {
    return (React.createElement("div", { className: `bg-gradient-to-br ${config.colorTheme.bg} backdrop-blur-sm p-4 min-h-[200px] flex flex-col w-48 ${type === 'small'
            ? `rounded-l-xl border-l border-t border-b ${config.colorTheme.border}`
            : `rounded-r-xl border-r border-t border-b ${config.colorTheme.border}`}` },
        React.createElement("div", { className: 'flex items-center justify-center gap-2 mb-2' },
            React.createElement("span", { className: `${config.colorTheme.price} text-xl` }, config.icon),
            React.createElement("h3", { className: `text-lg font-bold ${config.colorTheme.text}` }, config.name)),
        React.createElement("div", { className: 'text-center flex-1 flex flex-col justify-center' },
            React.createElement("div", { className: 'flex flex-row gap-2 items-center justify-center mb-2' },
                React.createElement("div", { className: `text-2xl font-bold ${config.colorTheme.price}` }, config.price),
                isActive && (React.createElement("div", { className: 'inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 rounded-full' },
                    React.createElement("div", { className: 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse' }),
                    React.createElement("span", { className: 'text-xs text-emerald-700 font-medium' }, "\u5DF2\u5F00\u901A")))),
            !isActive && (React.createElement("div", { className: 'space-y-1' },
                React.createElement("div", { className: `text-xs ${config.colorTheme.text.replace('800', '600')} font-medium` }, "30\u5929\u6709\u6548\u671F"),
                React.createElement("div", { className: `text-xs ${config.colorTheme.text.replace('800', '500')} opacity-80` }, type === 'small' ? '基础权益套餐' : '高级权益套餐'),
                React.createElement("div", { className: `text-xs ${config.colorTheme.text.replace('800', '400')} opacity-60` }, type === 'small' ? '6项基础特权' : '8项高级特权'))),
            expireInfo && (React.createElement("div", { className: `mt-2 p-2 ${config.colorTheme.expireBg} rounded-lg border ${config.colorTheme.expireBorder}` },
                React.createElement("div", { className: `text-xs ${config.colorTheme.expireText} font-medium mb-1` },
                    "\u5269\u4F59\u5929\u6570: ",
                    days,
                    "\u5929"),
                React.createElement("div", { className: `text-xs ${config.colorTheme.expireText.replace('700', '600')}` },
                    "\u8FC7\u671F\u65F6\u95F4: ",
                    expireInfo.date))))));
};
const FeatureItem = ({ feature, isMonth, data }) => {
    return (React.createElement("div", { className: classNames('relative overflow-hidden rounded-xl p-4 border shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]', {
            'bg-gradient-to-br from-yellow-50/90 via-amber-50/85 to-orange-50/90 border-amber-200/60': feature.highlight,
            'bg-gradient-to-br from-white/90 via-blue-50/85 to-cyan-50/90 border-blue-200/50': !feature.highlight
        }) },
        feature.highlight && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-xl' }),
            React.createElement("div", { className: 'absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-orange-400/8 to-amber-400/8 rounded-full blur-lg' }),
            React.createElement("div", { className: 'absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg' },
                React.createElement("span", { className: 'text-white text-xs' }, "\u2B50\uFE0F")))),
        React.createElement("div", { className: 'relative z-10 space-y-3' },
            React.createElement("div", { className: 'flex items-center gap-3' },
                React.createElement("div", { className: classNames('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', {
                        'bg-gradient-to-br from-amber-500 to-orange-500': feature.highlight,
                        'bg-gradient-to-br from-blue-500 to-cyan-500': !feature.highlight
                    }) },
                    React.createElement("span", { className: 'text-white text-xl' }, feature.icon)),
                React.createElement("div", { className: 'flex-1' },
                    React.createElement("h4", { className: classNames('text-base font-bold drop-shadow-sm', {
                            'text-amber-800': feature.highlight,
                            'text-blue-800': !feature.highlight
                        }) }, feature.title),
                    React.createElement("p", { className: classNames('text-sm mt-1', {
                            'text-amber-700': feature.highlight,
                            'text-blue-600': !feature.highlight
                        }) }, feature.desc))),
            React.createElement("div", { className: 'flex items-center justify-between' },
                React.createElement("div", { className: 'flex items-center gap-1' },
                    React.createElement("span", { className: classNames('text-xs', {
                            'text-purple-600': feature.type === 'big',
                            'text-blue-600': feature.type === 'small'
                        }) }, feature.type === 'big' ? '💎' : '💍'),
                    React.createElement("span", { className: classNames('text-xs font-medium', {
                            'text-purple-700': feature.type === 'big',
                            'text-blue-700': feature.type === 'small'
                        }) }, feature.type === 'big' ? '大月卡' : '小月卡')),
                React.createElement("div", { className: 'flex items-center gap-2' }, feature.type === 'small' ? (isMonth || data?.has_big_month_card ? (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse' }),
                    React.createElement("span", { className: 'text-xs text-emerald-600 font-medium' }, "\u5DF2\u6FC0\u6D3B"))) : (React.createElement(React.Fragment, null,
                    React.createElement("div", { className: 'w-2 h-2 bg-blue-400 rounded-full animate-pulse' }),
                    React.createElement("span", { className: 'text-xs text-blue-600 font-medium' }, "\u672A\u6FC0\u6D3B")))) :
                    data?.has_big_month_card ? (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: 'w-2 h-2 bg-emerald-400 rounded-full animate-pulse' }),
                        React.createElement("span", { className: 'text-xs text-emerald-600 font-medium' }, "\u5DF2\u6FC0\u6D3B"))) : (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: 'w-2 h-2 bg-purple-400 rounded-full animate-pulse' }),
                        React.createElement("span", { className: 'text-xs text-purple-600 font-medium' }, "\u672A\u6FC0\u6D3B"))))))));
};
const features = [
    {
        title: '自定义快捷键',
        icon: '⚡',
        type: 'small',
        desc: '个性化操作体验',
        highlight: false
    },
    {
        title: '打工本沉迷',
        icon: '💼',
        type: 'small',
        desc: '提升修炼效率',
        highlight: false
    },
    {
        title: '日签到奖励',
        icon: '💰',
        type: 'small',
        desc: '闪闪发光的石头*1，秘境之匙*10',
        highlight: false
    },
    {
        title: '周签到奖励',
        icon: '🎁',
        type: 'small',
        desc: '修为丹*N，仙府通行证*1，道具盲盒*1',
        highlight: false
    },
    {
        title: '双倍新人礼包',
        icon: '🎁',
        type: 'small',
        desc: '仅在新人且未领取新人礼包时生效',
        highlight: false
    },
    {
        title: '个性化装扮',
        icon: '📷',
        type: 'big',
        desc: '自定义背景图等',
        highlight: true
    },
    {
        title: '仙缘红包',
        icon: '🧧',
        type: 'big',
        desc: '消耗仙缘币，以发放仙缘币红包',
        highlight: true
    },
    {
        title: '一次性获得',
        icon: '🎁',
        type: 'big',
        desc: '更名卡、转世卡',
        highlight: true
    }
];
const Monthcard = ({ isMonth, avatar, isNewbie: _isNewbie, data }) => {
    const smallExpireTime = data?.small_month_card_expire_time > Date.now() ? dayjs(data?.small_month_card_expire_time) : null;
    const bigExpireTime = data?.big_month_card_expire_time > Date.now() ? dayjs(data?.big_month_card_expire_time) : null;
    const smallResidue = smallExpireTime ? smallExpireTime.diff(dayjs(), 'day') + 1 : 0;
    const bigResidue = bigExpireTime ? bigExpireTime.diff(dayjs(), 'day') + 1 : 0;
    const formatExpireTime = (expireTime) => {
        if (!expireTime) {
            return null;
        }
        return {
            date: expireTime.format('YYYY-MM-DD'),
            time: expireTime.format('HH:mm:ss')
        };
    };
    const smallExpire = formatExpireTime(smallExpireTime);
    const bigExpire = formatExpireTime(bigExpireTime);
    return (React.createElement(HTML, null,
        React.createElement(BackgroundImage, { src: fileUrl, className: 'p-0 m-0 w-full text-center' },
            React.createElement("div", { className: 'h-3' }),
            React.createElement("div", { className: 'm-3 mx-auto flex flex-nowrap rounded-3xl z-999 bg-gradient-to-br from-white/70 via-blue-50/60 to-cyan-50/65 backdrop-blur-sm border border-blue-200/40 shadow-2xl w-[780px] pb-6' },
                React.createElement("div", { className: 'm-4 w-[780px]' },
                    React.createElement("div", { className: 'text-center mb-6' },
                        React.createElement("div", { className: 'flex items-center justify-between mb-6' },
                            React.createElement("div", { className: 'flex-1 flex justify-center' },
                                React.createElement("div", { className: 'relative' },
                                    React.createElement(Avatar, { src: avatar, stateSrc: fileUrl$1, rootClassName: 'w-32 h-32', className: 'w-28 h-28' }),
                                    isMonth && (React.createElement("div", { className: 'absolute -bottom-0 -right-1 w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-lg' },
                                        React.createElement("span", { className: 'text-white text-sm' }, "\u2713"))))),
                            React.createElement("div", { className: 'flex-1 flex items-center justify-center' },
                                React.createElement("div", { className: 'flex items-center rounded-xl overflow-hidden shadow-lg' },
                                    React.createElement(MonthCardItem, { type: 'small', config: monthCardConfigs.small, isActive: data?.has_small_month_card || false, days: smallResidue || 0, expireInfo: smallExpire }),
                                    React.createElement(MonthCardItem, { type: 'big', config: monthCardConfigs.big, isActive: data?.has_big_month_card || false, days: bigResidue || 0, expireInfo: bigExpire }))))),
                    React.createElement("div", { className: 'space-y-4' },
                        React.createElement("div", { className: 'flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-blue-500/15 via-cyan-500/12 to-blue-600/15 backdrop-blur-sm rounded-lg border border-blue-200/40 shadow-lg' },
                            React.createElement("div", { className: 'flex items-center gap-3' },
                                React.createElement("div", { className: 'w-8 h-8 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-200/40' },
                                    React.createElement("span", { className: 'text-blue-600 text-lg' }, "\uD83C\uDFAF")),
                                React.createElement("h3", { className: 'text-xl font-bold text-blue-800 drop-shadow-sm' }, "\u4E13\u5C5E\u6743\u76CA")),
                            React.createElement("div", { className: 'flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-full border border-yellow-400/40 shadow-lg' },
                                React.createElement("span", { className: 'text-yellow-600 text-lg' }, "\uD83E\uDE99"),
                                React.createElement("span", { className: 'text-yellow-800 font-semibold text-sm' }, "\u4ED9\u7F18\u5E01\u4F59\u989D"),
                                React.createElement("span", { className: 'text-yellow-700 text-sm font-bold' }, data?.currency?.toLocaleString() || 0),
                                React.createElement("span", { className: 'text-yellow-700 text-sm' }, "\u00B7"),
                                React.createElement("span", { className: 'text-yellow-700 text-sm' }, "1\u00A5=10Coin")),
                            React.createElement("div", { className: 'text-sm text-blue-700 font-medium' },
                                "\u5171 ",
                                features.length,
                                " \u9879\u7279\u6743")),
                        React.createElement("div", { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' }, features.map((feature, index) => (React.createElement(FeatureItem, { key: index, feature: feature, isMonth: isMonth, data: data }))))),
                    data?.is_first_recharge === false && (React.createElement("div", { className: 'mt-4 text-center' },
                        React.createElement("div", { className: 'inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-full border border-orange-400/40 shadow-lg' },
                            React.createElement("span", { className: 'text-orange-600 text-lg' }, "\uD83C\uDF81"),
                            React.createElement("span", { className: 'text-orange-800 font-semibold' }, "\u9996\u5145\u5956\u52B1"),
                            React.createElement("span", { className: 'text-orange-700 text-sm' }, "\u00B7"),
                            React.createElement("span", { className: 'text-orange-700 text-sm' }, "\u4EFB\u4F55\u5145\u503C\u90FD\u5C06\u89E6\u53D1\u9996\u5145\u5956\u52B1(\u5C0F\u6708\u5361\u5929\u6570*7)")))))),
            React.createElement("div", { className: 'h-3' }))));
};

export { Monthcard as default };
