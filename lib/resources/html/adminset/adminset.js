import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './adminset.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../img/state.jpg.js';
import fileUrl$3 from '../../img/user_state.png.js';

const SettingItem = ({ label, value, unit = '' }) => (React.createElement("div", null,
    label,
    "\uFF1A",
    value,
    unit));
const SettingSection = ({ title, children }) => (React.createElement("div", { className: "user_bottom1" },
    React.createElement("div", { className: "use_data" },
        React.createElement("div", { className: "use_data_head" },
            React.createElement("div", { className: "user_font" }, title),
            React.createElement("div", { className: "user_font" }, children)))));
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
    const styles = `
    @font-face {
      font-family: 'tttgbnumber';
      src: url('${fileUrl$1}');
      font-weight: normal;
      font-style: normal;
    }
    body {
      transform: scale(1);
      width: 100%;
      text-align: center;
      background-image: url('${fileUrl$2}');
      background-size: 100% auto;
    }
    .user_top_img_bottom {
      margin: auto;
      background-image: url('${fileUrl$3}');
      background-size: 100% auto;
      width: 280px;
      height: 280px;
    }
  `;
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("style", { dangerouslySetInnerHTML: { __html: styles } })),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u4FEE\u4ED9\u8BBE\u7F6E")))),
                settingSections.map((section, sectionIndex) => (React.createElement(SettingSection, { key: sectionIndex, title: section.title }, section.settings.map((setting, index) => (React.createElement(SettingItem, { key: index, label: setting.label, value: setting.value, unit: setting.unit })))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { XiuxianSettings as default };
