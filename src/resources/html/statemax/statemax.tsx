import React from 'react'
import Ranking from '../Ranking/Ranking'

const StateMax = ({ LevelMax_list }) => {
  return (
    <Ranking
      title="#炼体境界"
      values={LevelMax_list.map(item => (
        <>
          <div className="flex gap-2 flex-col">
            <div>境界：{item.level}</div>
            <div>突破修为：{item.exp}</div>
          </div>
        </>
      ))}
    />
  )
}

export default StateMax
