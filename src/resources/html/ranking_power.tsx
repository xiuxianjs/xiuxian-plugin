import React from 'react'
import Ranking from './Ranking'
/**
 *
 * @param param0
 * @returns
 */
const RankingPower = ({
  user_id,
  nickname,
  level,
  exp,
  usr_paiming,
  allplayer
}) => {
  return (
    <Ranking
      user_id={user_id}
      messages={
        <>
          <div className="text-lg font-bold  tracking-wide">
            账号: {user_id}
          </div>
          <div className="text-xl ">道号: {nickname}</div>
          <div className="text-xl ">境界: {level}</div>
          <div className="text-xl ">修为: {exp}</div>
          <div className="text-xl ">排名: 第{usr_paiming}名</div>
        </>
      }
      title={'#天榜'}
      values={allplayer.map(item => (
        <div key={item.名次} className="text-base">
          [第{item.名次}名] {item.名号} ({item.境界}) - 修为: {item.总修为}
        </div>
      ))}
    />
  )
}

export default RankingPower
