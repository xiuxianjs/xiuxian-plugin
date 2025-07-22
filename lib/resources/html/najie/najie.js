import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './najie.css.js';
import fileUrl$2 from '../../font/tttgbnumber.ttf.js';
import fileUrl$3 from '../../font/NZBZ.ttf.js';
import fileUrl$1 from '../../img/player_pifu/0.jpg.js';
import fileUrl$4 from '../../img/state/user_state.png.js';

const Najie = ({ user_id, player = {}, strand_hp = {}, najie = {}, strand_lingshi = {} }) => {
    const whenError = img => {
        img.src = 'default-avatar.png';
    };
    const qualities = ['劣', '普', '优', '精', '极', '绝', '顶'];
    const lockStatus = ['未锁定', '已锁定'];
    const elements = ['金', '木', '土', '水', '火'];
    const renderEquipmentStats = item => {
        const isAbsolute = item.atk > 10 || item.def > 10 || item.HP > 10;
        return {
            attribute: isAbsolute ? '无' : elements[item.id - 1],
            atk: isAbsolute ? item.atk.toFixed(0) : (item.atk * 100).toFixed(0) + '%',
            def: isAbsolute ? item.def.toFixed(0) : (item.def * 100).toFixed(0) + '%',
            HP: isAbsolute ? item.HP.toFixed(0) : (item.HP * 100).toFixed(0) + '%'
        };
    };
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
          body {
            width: 100%;
            text-align: center;
            background-image: url('${fileUrl$1}');
            background-size: 100% auto;
          }

          @font-face {
            font-family: 'tttgbnumber';
            src: url('${fileUrl$2}');
            font-weight: normal;
            font-style: normal;
          }

          @font-face {
            font-family: 'NZBZ';
            src: url('${fileUrl$3}');
            font-weight: normal;
            font-style: normal;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${fileUrl$4}');
            background-size: 100% auto;
            width: 280px;
            height: 280px;
          }
        `
                } })),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "header" }),
                React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "user_top_left" },
                        React.createElement("div", { className: "user_top_img_bottom" },
                            React.createElement("img", { className: "user_top_img", src: `https://q1.qlogo.cn/g?b=qq&s=0&nk=${user_id}`, onError: e => whenError(e.target) })),
                        React.createElement("div", { className: "user_top_font_left" }, user_id)),
                    React.createElement("div", { className: "user_top_right" },
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u9053\u53F7\uFF1A",
                            player.名号),
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u751F\u547D\uFF1A",
                            React.createElement("div", { className: "blood_box" },
                                React.createElement("div", { className: "blood_bar", style: strand_hp.style }),
                                React.createElement("div", { className: "blood_volume" },
                                    player.当前血量,
                                    "/",
                                    player.血量上限))),
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u7B49\u7EA7\uFF1A",
                            najie.等级),
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u50A8\u91CF\uFF1A",
                            React.createElement("div", { className: "blood_box" },
                                React.createElement("div", { className: "blood_bar", style: strand_lingshi.style }),
                                React.createElement("div", { className: "blood_volume" },
                                    najie.灵石,
                                    "/",
                                    najie.灵石上限)))))),
            najie.装备?.length > 0 && (React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u88C5\u5907\u3011"),
                    React.createElement("div", { className: "user_font wupin" }, najie.装备.map((item, index) => {
                        const stats = renderEquipmentStats(item);
                        return (React.createElement("div", { key: index, className: "item" },
                            React.createElement("div", { className: "item_title" },
                                "\u3010",
                                item.type,
                                "\u3011",
                                item.name,
                                "(",
                                qualities[item.pinji],
                                ")(",
                                lockStatus[item.islockd],
                                ")"),
                            React.createElement("div", { className: "item_int" },
                                "\u5C5E\u6027:",
                                stats.attribute),
                            React.createElement("div", { className: "item_int" },
                                "\u653B\u51FB\uFF1A",
                                stats.atk),
                            React.createElement("div", { className: "item_int" },
                                "\u9632\u5FA1\uFF1A",
                                stats.def),
                            React.createElement("div", { className: "item_int" },
                                "\u8840\u91CF\uFF1A",
                                stats.HP),
                            React.createElement("div", { className: "item_int" },
                                "\u66B4\u51FB\uFF1A",
                                (item.bao * 100).toFixed(0),
                                "%"),
                            React.createElement("div", { className: "item_int" },
                                "\u6570\u91CF\uFF1A",
                                item.数量),
                            React.createElement("div", { className: "item_int" },
                                "\u51FA\u552E\u4EF7\uFF1A",
                                item.出售价,
                                "\u7075\u77F3"),
                            React.createElement("div", { className: "item_int" },
                                "\u4EE3\u53F7\uFF1A",
                                index + 101)));
                    }))))),
            najie.丹药?.length > 0 && (React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u4E39\u836F\u3011"),
                    React.createElement("div", { className: "user_font wupin" }, najie.丹药.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                        React.createElement("div", { className: "item_title" },
                            item.name,
                            "(",
                            lockStatus[item.islockd],
                            ")"),
                        item.HPp > 0 && (React.createElement("div", { className: "item_int" },
                            "\u6062\u590D\u767E\u5206\u6BD4\uFF1A",
                            item.HPp * 100,
                            "%")),
                        item.exp > 0 && (React.createElement("div", { className: "item_int" },
                            "\u589E\u52A0\u4FEE\u4E3A\uFF1A",
                            item.exp)),
                        item.xingyun > 0 && (React.createElement("div", { className: "item_int" },
                            "\u5E78\u8FD0\u503C\uFF1A",
                            (item.xingyun * 100).toFixed(1),
                            "%")),
                        React.createElement("div", { className: "item_int" },
                            "\u6570\u91CF\uFF1A",
                            item.数量),
                        React.createElement("div", { className: "item_int" },
                            "\u51FA\u552E\u4EF7\uFF1A",
                            item.出售价,
                            "\u7075\u77F3"),
                        React.createElement("div", { className: "item_int" },
                            "\u4EE3\u53F7\uFF1A",
                            index + 201)))))))),
            najie.仙宠口粮?.length > 0 && (React.createElement("div", { className: "card_box" },
                React.createElement("div", { className: "use_data" },
                    React.createElement("div", { className: "user_font user_font_title" }, "\u3010\u4ED9\u5BA0\u53E3\u7CAE\u3011"),
                    React.createElement("div", { className: "user_font wupin" }, najie.仙宠口粮.map((item, index) => (React.createElement("div", { key: index, className: "item" },
                        React.createElement("div", { className: "item_title" },
                            item.name,
                            "(",
                            lockStatus[item.islockd],
                            ")"),
                        React.createElement("div", { className: "item_int" },
                            "\u6570\u91CF\uFF1A",
                            item.数量),
                        React.createElement("div", { className: "item_int" },
                            "\u51FA\u552E\u4EF7\uFF1A",
                            item.出售价,
                            "\u7075\u77F3")))))))),
            React.createElement("div", { className: "user_bottom2" }))));
};

export { Najie as default };
