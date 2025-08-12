import React from 'react'
import Ranking from './Ranking'

const Immortal = ({ allplayer = [], title = '', label = '战力' }) => {
  return (
    <Ranking
      title={title}
      values={allplayer.map((item, index) => (
        <>
          <div className="flex gap-2 flex-col">
            <div className="user_font">
              [第{index + 1}名]{item.name}
            </div>
            <div className="user_font">
              {label}: {item.power}
            </div>
            <div className="user_font">QQ: {item.qq}</div>
          </div>
        </>
      ))}
    />
  )
}

export default Immortal
