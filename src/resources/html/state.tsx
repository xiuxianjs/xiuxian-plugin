import React from 'react'
import Ranking from './Ranking'

const State = ({ Level_list = [] }) => {
  return (
    <Ranking
      title={'#练气境界'}
      values={Level_list.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-2 w-full">
          <div className="font-bold text-blue-200 text-lg">
            境界：{item.level}
          </div>
          <div className="text-sm ">突破修为：{item.exp}</div>
        </div>
      ))}
    />
  )
}

export default State
