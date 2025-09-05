import React from 'react';

function VirtualizedList({ items, render, itemKey, className }) {
    return (React.createElement("section", { className: className ?? 'overflow-auto relative' },
        React.createElement("div", null, items.map((item, index) => (React.createElement("div", { key: itemKey(item, index) }, render(item, index)))))));
}

export { VirtualizedList, VirtualizedList as default };
