import React from 'react'
import Ranking from '../Ranking/Ranking'

const State = ({ Level_list = [] }) => {
  return (
    <Ranking
      title={'#练气境界'}
      values={Level_list.map(item => {
        return (
          <>
            <div className="flex gap-2 flex-col">
              <div>境界：{item.level}</div>
              <div>突破修为：{item.exp}</div>
            </div>
          </>
        )
      })}
    />
  )
}

export default State
