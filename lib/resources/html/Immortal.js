import React from 'react';
import Ranking from './Ranking.js';

const Immortal = ({ allplayer = [], title = '', label = '战力' }) => {
    return (React.createElement(Ranking, { title: title, values: allplayer.map((item, index) => (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex gap-2 flex-col" },
                React.createElement("div", { className: "user_font" },
                    "[\u7B2C",
                    index,
                    "\u540D]",
                    item.name),
                React.createElement("div", { className: "user_font" },
                    label,
                    ": ",
                    item.power),
                React.createElement("div", { className: "user_font" },
                    "QQ: ",
                    item.qq))))) }));
};

export { Immortal as default };
