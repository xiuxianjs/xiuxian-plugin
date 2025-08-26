import React from 'react';
import Ranking from './Ranking';

const Immortal = ({ allplayer = [], title = '', label = '战力' }) => {
  return (
    <Ranking
      title={title}
      values={allplayer.map((item, index) => (
        <>
          <div className='flex gap-2 flex-col '>
            <div className='font-semibold text-[22px]  rounded-5xl'>
              [第{index + 1}名]{item.name}
            </div>
            <div className='font-semibold text-[22px] rounded-5xl'>
              {label}: {item.power}
            </div>
            {item?.sub
              ? item.sub.map((subItem, subIndex) => (
                  <div key={subIndex} className='font-semibold text-[22px]  rounded-5xl'>
                    {subItem.label}: {subItem.value}
                  </div>
                ))
              : null}
            <div className='font-semibold text-[22px]  rounded-5xl'>账号: {item.qq}</div>
          </div>
        </>
      ))}
    />
  );
};

export default Immortal;
