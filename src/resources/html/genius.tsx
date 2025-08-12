import React from 'react'
import Ranking from './Ranking'

const Genius = ({ allplayer = [] }) => {
  return (
    <Ranking
      title="封神榜"
      values={allplayer.map(item => (
        <>
          <div className="flex gap-2 flex-col">
            <div className="user_font">
              [第{item.名次}名]{item.名号}
            </div>
            <div className="user_font">道号: {item.灵石}</div>
            <div className="user_font">战力: {item.灵石}</div>
            <div className="user_font">QQ: {item.灵石}</div>
          </div>
        </>
      ))}
    />
  )
}

export default Genius
