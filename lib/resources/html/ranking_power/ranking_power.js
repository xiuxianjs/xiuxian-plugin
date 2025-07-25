import React from 'react';
import Ranking from '../Ranking/Ranking.js';

const RankingPower = ({ user_id, nickname, level, exp, usr_paiming, allplayer }) => {
    return (React.createElement(Ranking, { user_id: user_id, messages: React.createElement(React.Fragment, null,
            React.createElement("div", { className: "text-lg font-bold  tracking-wide" },
                "QQ: ",
                user_id),
            ",",
            React.createElement("div", { className: "text-xl " },
                "\u9053\u53F7: ",
                nickname),
            ",",
            React.createElement("div", { className: "text-xl " },
                "\u5883\u754C: ",
                level),
            ",",
            React.createElement("div", { className: "text-xl " },
                "\u4FEE\u4E3A: ",
                exp),
            ",",
            React.createElement("div", { className: "text-xl " },
                "\u6392\u540D: \u7B2C",
                usr_paiming,
                "\u540D")), title: '#天榜', values: allplayer.map(item => (React.createElement("div", { key: item.名次, className: "text-base" },
            "[\u7B2C",
            item.名次,
            "\u540D] ",
            item.名号,
            " (",
            item.境界,
            ") - \u4FEE\u4E3A: ",
            item.总修为))) }));
};

export { RankingPower as default };
