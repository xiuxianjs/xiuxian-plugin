import React from 'react';
import Ranking from './Ranking';

const Genius = ({ allplayer = [] }) => {
  return (
    <Ranking
      title='封神榜'
      values={allplayer.map(item => (
        <>
          <div className='flex gap-2 flex-col'>
            <div className='font-semibold text-[22px]  rounded-5xl'>
              [第{item.名次}名]{item.名号}
            </div>
            <div className='font-semibold text-[22px]  rounded-5xl'>道号: {item.道号}</div>
            <div className='font-semibold text-[22px]  rounded-5xl'>战力: {item.灵石}</div>
            <div className='font-semibold text-[22px]  rounded-5xl'>账号: {item.qq}</div>
          </div>
        </>
      ))}
    />
  );
};

export default Genius;
