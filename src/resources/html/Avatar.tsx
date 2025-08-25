import React from 'react';
import user_stateURL from '@src/resources/img/user_state.png';
import classnames from 'classnames';
/**
 *
 * @param param0
 * @returns
 */
export const Avatar = ({
  src,
  rootClassName,
  className
}: {
  src: string;
  rootClassName?: string;
  className?: string;
}) => {
  return (
    <div
      className={classnames(rootClassName, 'relative flex items-center justify-center w-40 h-40')}
    >
      {/* 头饰图层 */}
      <div
        className='absolute inset-0 w-full h-full rounded-full bg-cover bg-center z-10'
        style={{ backgroundImage: `url(${user_stateURL})` }}
      />
      {/* 头像图层（更小） */}
      <div
        className={classnames(
          className,
          'relative w-28 h-28 rounded-full bg-cover bg-center ring-4 ring-white/30 shadow-card z-20'
        )}
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
};
