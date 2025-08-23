import React from 'react';
import Ranking from './Ranking.js';

const Immortal = ({ allplayer = [], title = '', label = '战力' }) => {
    return (React.createElement(Ranking, { title: title, values: allplayer.map((item, index) => (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex gap-2 flex-col" },
                React.createElement("div", { className: "font-semibold text-[22px] text-black rounded-5xl" },
                    "[\u7B2C",
                    index + 1,
                    "\u540D]",
                    item.name),
                React.createElement("div", { className: "font-semibold text-[22px] text-black rounded-5xl" },
                    label,
                    ": ",
                    item.power),
                item?.sub
                    ? item.sub.map((subItem, subIndex) => (React.createElement("div", { key: subIndex, className: "font-semibold text-[22px] text-black rounded-5xl" },
                        subItem.label,
                        ": ",
                        subItem.value)))
                    : null,
                React.createElement("div", { className: "font-semibold text-[22px] text-black rounded-5xl" },
                    "\u8D26\u53F7: ",
                    item.qq))))) }));
};

export { Immortal as default };
