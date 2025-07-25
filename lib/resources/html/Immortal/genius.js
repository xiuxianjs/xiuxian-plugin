import React from 'react';
import Ranking from '../Ranking/Ranking.js';

const Immortal = ({ allplayer = [] }) => {
    return (React.createElement(Ranking, { title: "\u81F3\u5C0A\u699C", values: allplayer.map(item => (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex gap-2 flex-col" },
                React.createElement("div", { className: "user_font" },
                    "[\u7B2C",
                    item.名次,
                    "\u540D]",
                    item.name),
                React.createElement("div", { className: "user_font" },
                    "\u9053\u53F7: ",
                    item.name),
                React.createElement("div", { className: "user_font" },
                    "\u6218\u529B: ",
                    item.power),
                React.createElement("div", { className: "user_font" },
                    "QQ: ",
                    item.qq))))) }));
};

export { Immortal as default };
