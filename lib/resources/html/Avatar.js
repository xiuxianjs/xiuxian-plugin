import React from 'react';
import fileUrl from '../img/user_state.png.js';
import classNames from 'classnames';

const Avatar = ({ src, rootClassName, className, stateSrc }) => {
    return (React.createElement("div", { className: classNames(rootClassName, 'relative flex items-center justify-center w-40 h-40') },
        React.createElement("div", { className: 'absolute inset-0 w-full h-full rounded-full bg-cover bg-center z-10', style: { backgroundImage: `url(${stateSrc ?? fileUrl})` } }),
        React.createElement("div", { className: classNames(className, 'relative w-28 h-28 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card z-20'), style: { backgroundImage: `url(${src})` } })));
};

export { Avatar };
