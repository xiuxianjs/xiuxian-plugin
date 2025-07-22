import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './sudoku.css.js';

const Sudoku = ({ sudokuData }) => {
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement(LinkStyleSheet, { src: fileUrl })),
        React.createElement("body", null,
            React.createElement("div", { id: "sudoku_box" },
                React.createElement("div", { className: "font" }, "123456789"),
                React.createElement("div", { className: "left_font" }, "123456789"),
                React.createElement("ul", { className: "wrap" },
                    React.createElement("div", { style: {
                            left: '5px',
                            top: '165px',
                            width: '490px',
                            height: '5px',
                            position: 'absolute',
                            background: 'red'
                        } }),
                    sudokuData &&
                        sudokuData.map((row, rowIndex) => row.map((cell, colIndex) => (React.createElement("li", { key: `${rowIndex}-${colIndex}`, className: "grid", style: {
                                left: `${5 + colIndex * 54}px`,
                                top: `${5 + rowIndex * 54}px`
                            } }, cell !== 0 ? cell : '')))))))));
};

export { Sudoku as default };
