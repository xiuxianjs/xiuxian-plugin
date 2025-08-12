import React from 'react'
import Ranking from './Ranking'

const Immortal = ({ allplayer = [], title = '' }) => {
  return (
    <Ranking
      title={title}
      values={allplayer.map(item => (
        <>
          <div className="flex gap-2 flex-col">
            <div className="user_font">
              [第{item.名次}名]{item.name}
            </div>
            <div className="user_font">道号: {item.name}</div>
            <div className="user_font">战力: {item.power}</div>
            <div className="user_font">QQ: {item.qq}</div>
          </div>
        </>
      ))}
    />
  )
}

export default Immortal
