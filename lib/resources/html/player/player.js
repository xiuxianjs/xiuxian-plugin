import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './player.css.js';
import fileUrl$1 from '../../font/tttgbnumber.ttf.js';
import fileUrl$2 from '../../font/NZBZ.ttf.js';
import fileUrl$3 from '../../img/player_pifu/0.jpg.js';
import fileUrl$4 from '../../img/player/user_state.png.js';

const Player = ({ avatar, PowerMini, player = {}, user_id, strand_hp = {}, lingshi, this_association = {}, player_atk, player_atk2, player_def, player_def2, bao, 攻击加成, 攻击加成_t, 防御加成, 防御加成_t, 生命加成, 生命加成_t, talent, occupation, 婚姻状况, rank_lianqi, expmax_lianqi, strand_lianqi = {}, rank_llianti, expmax_llianti, strand_llianti = {}, rank_liandan, expmax_liandan, strand_liandan = {}, neidan, player_action }) => {
    const whenError = img => {
        img.src = 'default-avatar.png';
    };
    const genders = ['未知', '女', '男', '扶她'];
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("style", null, `
          @font-face {
            font-family: 'tttgbnumber';
            src: url('${fileUrl$1}');
            font-weight: normal;
            font-style: normal;
          }

          @font-face {
            font-family: 'NZBZ';
            src: url('${fileUrl$2}');
            font-weight: normal;
            font-style: normal;
          }

          body {
            width: 100%;
            text-align: center;
            background-image: url('${fileUrl$3}');
            background-size: 100% 100%;
          }

          .user_top_img_bottom {
            margin: auto;
            background-image: url('${fileUrl$4}');
            background-size: 100% auto;
            width: 280px;
            height: 280px;
          }
        `)),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "header" }),
                React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "user_top_left" },
                        React.createElement("div", { className: "user_top_img_bottom" },
                            React.createElement("img", { className: "user_top_img", src: avatar, onError: e => whenError(e.target) })),
                        React.createElement("div", { className: "user_top_font_left" },
                            "\u6218\u529B ",
                            PowerMini)),
                    React.createElement("div", { className: "user_top_right" },
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u9053\u53F7\uFF1A",
                            player.名号),
                        React.createElement("div", { className: "user_top_font_right" },
                            "QQ\uFF1A",
                            user_id),
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u6027\u522B\uFF1A(",
                            genders[player.sex],
                            ")"),
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u751F\u547D\uFF1A",
                            React.createElement("div", { className: "blood_box" },
                                React.createElement("div", { className: "blood_bar", style: strand_hp.style }),
                                React.createElement("div", { className: "blood_volume" },
                                    player.当前血量.toFixed(0),
                                    "/",
                                    player.血量上限.toFixed(0)))),
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u7075\u77F3\uFF1A",
                            lingshi),
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u5B97\u95E8\uFF1A\u3010",
                            this_association.宗门名称,
                            "\u3011",
                            this_association.宗门名称 !== '无' &&
                                `[${this_association.职位}]`),
                        React.createElement("div", { className: "user_top_font_right" },
                            "\u9053\u5BA3\uFF1A",
                            player.宣言))),
                React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" }, "[\u57FA\u7840\u4FE1\u606F]"),
                        React.createElement("div", { className: "user_font wupin" },
                            React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u653B\u51FB\uFF1A",
                                    player_atk,
                                    React.createElement("sup", null, player_atk2)),
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u9632\u5FA1\uFF1A",
                                    player_def,
                                    React.createElement("sup", null, player_def2)),
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u66B4\u51FB\uFF1A",
                                    bao),
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u66B4\u4F24\uFF1A",
                                    (player.暴击伤害 * 100).toFixed(0),
                                    "%")),
                            React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u653B\u51FB\uFF1A",
                                    攻击加成,
                                    React.createElement("sup", null, 攻击加成_t)),
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u9632\u5FA1\uFF1A",
                                    防御加成,
                                    React.createElement("sup", null, 防御加成_t)),
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u751F\u547D\uFF1A",
                                    生命加成,
                                    React.createElement("sup", null, 生命加成_t))),
                            React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u4FEE\u70BC\u52A0\u6210\uFF1A",
                                    talent,
                                    "%"),
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u804C\u4E1A\uFF1A[",
                                    occupation,
                                    "]"),
                                React.createElement("div", { className: "item_title font_left" },
                                    "\u9053\u4FA3[",
                                    婚姻状况,
                                    "]"))),
                        React.createElement("div", { className: "user_font wupin" },
                            React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item_title font_left" },
                                    rank_lianqi,
                                    player.修为 >= expmax_lianqi && '[UP]'),
                                React.createElement("div", { className: "item_int" },
                                    React.createElement("div", { className: "xuetiao" },
                                        React.createElement("div", { className: "xueliang font_volume", style: strand_lianqi.style },
                                            strand_lianqi.num,
                                            "%"))),
                                React.createElement("div", { className: "item_int" },
                                    player.修为,
                                    "/",
                                    expmax_lianqi)),
                            React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item_title font_left" },
                                    rank_llianti,
                                    player.血气 >= expmax_llianti && '[UP]'),
                                React.createElement("div", { className: "item_int" },
                                    React.createElement("div", { className: "xuetiao" },
                                        React.createElement("div", { className: "xueliang font_volume", style: strand_llianti.style },
                                            strand_llianti.num,
                                            "%"))),
                                React.createElement("div", { className: "item_int" },
                                    player.血气,
                                    "/",
                                    expmax_llianti)),
                            player.occupation === '' ? (React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item_title font_left" }, "\u804C\u4E1A\uFF1A"),
                                React.createElement("div", { className: "item_title font_left" }, "\u65E0\u4E1A\u6E38\u6C11"))) : (React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item_title font_left" },
                                    rank_liandan,
                                    player.occupation_exp >= expmax_liandan && '[UP]'),
                                React.createElement("div", { className: "item_int" },
                                    React.createElement("div", { className: "xuetiao" },
                                        React.createElement("div", { className: "xueliang font_volume", style: strand_liandan.style },
                                            strand_liandan.num,
                                            "%"))),
                                React.createElement("div", { className: "item_int" },
                                    player.occupation_exp,
                                    "/",
                                    expmax_liandan)))),
                        React.createElement("div", { className: "user_font wupin" },
                            React.createElement("div", { className: "item" },
                                React.createElement("div", { className: "item_title font_left" },
                                    React.createElement("div", null),
                                    "\u7075\u6839\uFF1A\u3010",
                                    player.灵根?.type,
                                    "\u3011",
                                    player.灵根?.type !== '无' && (React.createElement(React.Fragment, null,
                                        player.灵根?.name,
                                        React.createElement("br", null),
                                        "\u88AB\u52A8\uFF1A\u3010\u989D\u5916\u589E\u4F24\u3011\u653B\u51FB+",
                                        (player.灵根?.法球倍率 * 100).toFixed(1),
                                        "%")),
                                    "\u9547\u5996\uFF1A\u3010",
                                    player.镇妖塔层数,
                                    "\u5C42\u3011",
                                    React.createElement("br", null),
                                    "\u795E\u9B42\uFF1A\u3010",
                                    player.神魄段数,
                                    "\u5C42\u3011",
                                    React.createElement("br", null),
                                    "\u5E78\u8FD0:\u3010",
                                    (player.幸运 * 100).toFixed(1),
                                    "%\u3011",
                                    React.createElement("br", null),
                                    "\u9B54\u9053\u503C:\u3010",
                                    player.魔道值,
                                    "\u3011",
                                    React.createElement("br", null),
                                    "\u5185\u4E39:\u3010",
                                    neidan,
                                    "\u3011",
                                    React.createElement("br", null),
                                    "\u72B6\u6001\uFF1A\u3010",
                                    player_action,
                                    "\u3011"))))),
                React.createElement("div", { className: "card_box" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "user_font user_font_title" }, "[\u4ED9\u5BA0]"),
                        React.createElement("div", { className: "user_font wupin" }, !player.仙宠 || player.仙宠 === '' ? (React.createElement("div", { className: "item_title3" }, "\u3010\u4ED9\u5BA0\u6682\u65E0\u3011")) : (React.createElement(React.Fragment, null,
                            React.createElement("div", { className: "item_title2" },
                                "\u3010",
                                player.仙宠.品级,
                                "\u3011",
                                player.仙宠.name),
                            React.createElement("div", { className: "item_int2" },
                                "\u7B49\u7EA7\uFF1A",
                                player.仙宠.等级),
                            player.仙宠.type === '战斗' ? (React.createElement("div", { className: "item_int2" },
                                "\u4E09\u7EF4\u52A0\u6210",
                                player.仙宠.atk)) : (React.createElement("div", { className: "item_int2" },
                                player.仙宠.type,
                                "\u52A0\u6210:",
                                (player.仙宠.加成 * 100).toFixed(1),
                                "%")),
                            React.createElement("div", { className: "item_int2" },
                                "\u7ED1\u5B9A\uFF1A",
                                player.仙宠.灵魂绑定 === 1 ? '有' : '无')))))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Player as default };
