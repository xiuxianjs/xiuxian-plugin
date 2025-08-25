import React from 'react';
import fileUrl from '../styles/tw.scss.js';
import fileUrl$1 from '../font/tttgbnumber.ttf.js';
import { LinkStyleSheet } from 'jsxp';

const Sudoku = ({ sudokuData }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("meta", { httpEquiv: 'content-type', content: 'text/html;charset=utf-8' }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
              @font-face { font-family: 'tttgbnumber'; src: url('${fileUrl$1}'); font-weight: normal; font-style: normal; }
              body { font-family: 'tttgbnumber', system-ui, sans-serif; }
            `
                } })),
        React.createElement("body", null,
            React.createElement("div", { className: ' bg-gradient-to-b from-gray-100 to-blue-100 flex flex-col items-center py-8' },
                React.createElement("div", { className: 'w-full max-w-xl mx-auto' },
                    React.createElement("div", { className: 'rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center' },
                        React.createElement("div", { className: 'flex flex-row mb-2' }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (React.createElement("div", { key: n, className: 'w-12 h-8 flex items-center justify-center text-blue-700 font-bold text-lg' }, n)))),
                        React.createElement("div", { className: 'flex flex-row' },
                            React.createElement("div", { className: 'flex flex-col mr-2' }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (React.createElement("div", { key: n, className: 'w-8 h-12 flex items-center justify-center text-blue-700 font-bold text-lg' }, n)))),
                            React.createElement("div", { className: 'grid grid-cols-9 grid-rows-9 gap-1' }, sudokuData?.map((row, rowIndex) => row.map((cell, colIndex) => (React.createElement("div", { key: `${rowIndex}-${colIndex}`, className: 'w-12 h-12 flex items-center justify-center border border-gray-300 text-xl font-semibold bg-gray-50' }, cell !== 0 ? cell : ''))))))))))));
};

export { Sudoku as default };
