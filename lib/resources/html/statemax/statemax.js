import React from 'react';
import Ranking from '../Ranking/Ranking.js';

const StateMax = ({ LevelMax_list }) => {
    return (React.createElement(Ranking, { title: "#\u70BC\u4F53\u5883\u754C", values: LevelMax_list.map(item => (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex gap-2 flex-col" },
                React.createElement("div", null,
                    "\u5883\u754C\uFF1A",
                    item.level),
                React.createElement("div", null,
                    "\u7A81\u7834\u4FEE\u4E3A\uFF1A",
                    item.exp))))) }));
};

export { StateMax as default };
