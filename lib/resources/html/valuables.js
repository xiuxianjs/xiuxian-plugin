import React from 'react';
import fileUrl from '../img/valuables-top.jpg.js';
import fileUrl$1 from '../img/valuables-danyao.jpg.js';
import HTML from './HTML.js';

const floors = [
    { name: '#功法楼', type: '功法' },
    { name: '#丹药楼', type: '丹药' },
    { name: '#装备楼', type: '装备' },
    { name: '#道具楼', type: '道具' },
    { name: '#仙宠楼', type: '仙宠' }
];
const FloorSection = ({ name, type }) => (React.createElement("div", { className: "mx-auto bg-cover bg-center rounded-lg shadow-md p-4", style: { backgroundImage: `url(${fileUrl$1})` } },
    React.createElement("div", { className: "flex flex-col items-center gap-2" },
        React.createElement("div", { className: "text-lg font-bold text-gray-800" }, name),
        React.createElement("div", { className: "text-base text-gray-600" },
            "\u7C7B\u578B: ",
            type),
        React.createElement("div", { className: "text-base text-blue-500 cursor-pointer hover:underline" },
            "\u67E5\u770B\u5168\u90E8",
            type,
            "\u4EF7\u683C"))));
const Valuables = () => {
    const styles = ``;
    return (React.createElement(HTML, { dangerouslySetInnerHTML: { __html: styles } },
        React.createElement("div", { className: "w-full text-center" },
            React.createElement("div", { className: "mx-auto py-20 bg-white rounded-lg shadow p-4 flex flex-col items-center", style: {
                    backgroundImage: `url(${fileUrl})`,
                    backgroundSize: 'cover'
                } },
                React.createElement("div", { className: "text-2xl font-extrabold text-yellow-700" }, "#\u4E07\u5B9D\u697C"),
                React.createElement("div", { className: "text-lg font-bold text-gray-800 mb-2" }, "\u4FEE\u4ED9\u754C\u6700\u5927\u7684\u5F53\u94FA"),
                React.createElement("div", { className: "text-base text-gray-600 mb-2" }, "\u6C47\u805A\u5929\u4E0B\u6240\u6709\u7269\u54C1"),
                React.createElement("div", { className: "text-base text-blue-500" }, "\u5FEB\u53BB\u79D8\u5883\u5386\u7EC3\u83B7\u5F97\u795E\u5668\u5427")),
            floors.map((floor, index) => (React.createElement(FloorSection, { key: index, name: floor.name, type: floor.type }))),
            React.createElement("div", { className: "w-full h-32 mx-auto bg-cover bg-center rounded-lg", style: { backgroundImage: `url(${fileUrl$1})` } }))));
};

export { Valuables as default };
