import React from 'react';
import Ranking from './Ranking.js';

const Genius = ({ allplayer = [] }) => {
    return (React.createElement(Ranking, { title: '\u5C01\u795E\u699C', values: allplayer.map(item => (React.createElement(React.Fragment, null,
            React.createElement("div", { className: 'flex gap-2 flex-col' },
                React.createElement("div", { className: 'font-semibold text-[22px]  rounded-5xl' },
                    "[\u7B2C",
                    item.名次,
                    "\u540D]",
                    item.名号),
                React.createElement("div", { className: 'font-semibold text-[22px]  rounded-5xl' },
                    "\u9053\u53F7: ",
                    item.道号),
                React.createElement("div", { className: 'font-semibold text-[22px]  rounded-5xl' },
                    "\u6218\u529B: ",
                    item.灵石),
                React.createElement("div", { className: 'font-semibold text-[22px]  rounded-5xl' },
                    "\u8D26\u53F7: ",
                    item.qq))))) }));
};

export { Genius as default };
