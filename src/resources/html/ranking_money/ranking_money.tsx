import React from 'react'
import Ranking from '../Ranking/Ranking'

const RankingMoney = ({
  user_id,
  nickname,
  lingshi,
  najie_lingshi,
  usr_paiming,
  allplayer
}) => {
  return (
    <Ranking
      user_id={user_id}
      messages={
        <>
          <div className="text-lg font-bold  tracking-wide">QQ: {user_id}</div>,
          <div className="text-xl ">道号: {nickname}</div>,
          <div className="text-xl ">灵石: {lingshi}</div>,
          <div className="text-xl ">纳戒灵石: {najie_lingshi}</div>,
          <div className="text-xl ">排名: 第{usr_paiming}名</div>
        </>
      }
      title={'#灵榜'}
      values={allplayer.map(item => {
        return (
          <div key={item.名次} className="text-base">
            [第{item.名次}名] {item.名号} - 灵石财富: {item.灵石}
          </div>
        )
      })}
    />
  )
}

export default RankingMoney
