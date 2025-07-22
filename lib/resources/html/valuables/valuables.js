import { LinkStyleSheet } from 'jsxp';
import React from 'react';
import fileUrl from './valuables.css.js';
import fileUrl$1 from '../../img/valuables/valuables-top.jpg.js';
import fileUrl$2 from '../../img/valuables/valuables-danyao.jpg.js';

const Valuables = () => {
    return (React.createElement("html", null,
        React.createElement("head", null,
            React.createElement("meta", { httpEquiv: "content-type", content: "text/html;charset=utf-8" }),
            React.createElement(LinkStyleSheet, { src: fileUrl }),
            React.createElement("style", { dangerouslySetInnerHTML: {
                    __html: `
          body {
            transform: scale(1);
            width: 100%;
            text-align: center;
          }

          .user_bottom0 {
            width: 100%;
            height: 285px;
            margin: auto;
            background-image: url('${fileUrl$1}');
            background-size: 100% auto;
          }

          .user_bottom1 {
            margin: auto;
            background-image: url('${fileUrl$2}');
            background-size: 100% auto;
          }

          .user_bottom2 {
            width: 100%;
            margin: auto;
            background-image: url('${fileUrl$2}');
            background-size: 100% auto;
            padding-top: 20px;
          }
        `
                } })),
        React.createElement("body", null,
            React.createElement("div", null,
                React.createElement("div", { className: "user_float" },
                    React.createElement("div", { className: "use_data0" },
                        React.createElement("div", { className: "user_font_0" }, "#\u4E07\u5B9D\u697C"))),
                React.createElement("div", { className: "user_bottom0" }),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "\u4FEE\u4ED9\u754C\u6700\u5927\u7684\u5F53\u94FA"),
                            React.createElement("div", { className: "user_font" }, "\u6C47\u805A\u5929\u4E0B\u6240\u6709\u7269\u54C1"),
                            React.createElement("div", { className: "user_font" }, "\u5FEB\u53BB\u79D8\u5883\u5386\u7EC3\u83B7\u5F97\u795E\u5668\u5427")))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u529F\u6CD5\u697C"),
                            React.createElement("div", { className: "user_font" }, "\u7C7B\u578B: \u529F\u6CD5"),
                            React.createElement("div", { className: "user_font" }, "\u67E5\u770B\u5168\u90E8\u529F\u6CD5\u4EF7\u683C")))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u4E39\u836F\u697C"),
                            React.createElement("div", { className: "user_font" }, "\u7C7B\u578B: \u4E39\u836F"),
                            React.createElement("div", { className: "user_font" }, "\u67E5\u770B\u5168\u90E8\u4E39\u836F\u4EF7\u683C")))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u88C5\u5907\u697C"),
                            React.createElement("div", { className: "user_font" }, "\u7C7B\u578B: \u88C5\u5907"),
                            React.createElement("div", { className: "user_font" }, "\u67E5\u770B\u5168\u90E8\u88C5\u5907\u4EF7\u683C")))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u9053\u5177\u697C"),
                            React.createElement("div", { className: "user_font" }, "\u7C7B\u578B: \u9053\u5177"),
                            React.createElement("div", { className: "user_font" }, "\u67E5\u770B\u5168\u90E8\u9053\u5177\u4EF7\u683C")))),
                React.createElement("div", { className: "user_bottom1" },
                    React.createElement("div", { className: "use_data" },
                        React.createElement("div", { className: "use_data_head" },
                            React.createElement("div", { className: "user_font" }, "#\u4ED9\u5BA0\u697C"),
                            React.createElement("div", { className: "user_font" }, "\u7C7B\u578B: \u4ED9\u5BA0"),
                            React.createElement("div", { className: "user_font" }, "\u67E5\u770B\u5168\u90E8\u4ED9\u5BA0\u4EF7\u683C")))),
                React.createElement("div", { className: "user_bottom2" })))));
};

export { Valuables as default };
