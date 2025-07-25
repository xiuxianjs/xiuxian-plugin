import React from 'react';
import Ranking from '../Ranking/Ranking.js';

const RankingMoney = ({ user_id, nickname, lingshi, najie_lingshi, usr_paiming, allplayer }) => {
    return (React.createElement(Ranking, { user_id: user_id, messages: React.createElement(React.Fragment, null,
            React.createElement("div", { className: "text-lg font-bold  tracking-wide" },
                "QQ: ",
                user_id),
            React.createElement("div", { className: "text-xl " },
                "\u9053\u53F7: ",
                nickname),
            React.createElement("div", { className: "text-xl " },
                "\u7075\u77F3: ",
                lingshi),
            React.createElement("div", { className: "text-xl " },
                "\u7EB3\u6212\u7075\u77F3: ",
                najie_lingshi),
            React.createElement("div", { className: "text-xl " },
                "\u6392\u540D: \u7B2C",
                usr_paiming,
                "\u540D")), title: '#灵榜', values: allplayer.map(item => {
            return (React.createElement("div", { key: item.名次, className: "text-base" },
                "[\u7B2C",
                item.名次,
                "\u540D] ",
                item.名号,
                " - \u7075\u77F3\u8D22\u5BCC: ",
                item.灵石));
        }) }));
};

export { RankingMoney as default };
