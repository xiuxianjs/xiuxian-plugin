import React from 'react';
import Ranking from './Ranking.js';

const State = ({ Level_list = [] }) => {
    return (React.createElement(Ranking, { title: '#练气境界', values: Level_list.map((item, idx) => (React.createElement("div", { key: idx, className: "flex flex-col gap-2 w-full" },
            React.createElement("div", { className: "font-bold text-blue-200 text-lg" },
                "\u5883\u754C\uFF1A",
                item.level),
            React.createElement("div", { className: "text-sm " },
                "\u7A81\u7834\u4FEE\u4E3A\uFF1A",
                item.exp)))) }));
};

export { State as default };
