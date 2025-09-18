import React from 'react';
import HTML from './HTML.js';

const Sudoku = ({ sudokuData }) => {
    return (React.createElement(HTML, null,
        React.createElement("div", { className: ' bg-gradient-to-b from-gray-100 to-blue-100 flex flex-col items-center py-8' },
            React.createElement("div", { className: 'w-full max-w-xl mx-auto' },
                React.createElement("div", { className: 'rounded-xl shadow-lg bg-white p-6 mb-6 flex flex-col items-center' },
                    React.createElement("div", { className: 'flex flex-row mb-2' }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (React.createElement("div", { key: n, className: 'w-12 h-8 flex items-center justify-center text-blue-700 font-bold text-lg' }, n)))),
                    React.createElement("div", { className: 'flex flex-row' },
                        React.createElement("div", { className: 'flex flex-col mr-2' }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (React.createElement("div", { key: n, className: 'w-8 h-12 flex items-center justify-center text-blue-700 font-bold text-lg' }, n)))),
                        React.createElement("div", { className: 'grid grid-cols-9 grid-rows-9 gap-1' }, sudokuData?.map((row, rowIndex) => row.map((cell, colIndex) => (React.createElement("div", { key: `${rowIndex}-${colIndex}`, className: 'w-12 h-12 flex items-center justify-center border border-gray-300 text-xl font-semibold bg-gray-50' }, cell !== 0 ? cell : '')))))))))));
};

export { Sudoku as default };
