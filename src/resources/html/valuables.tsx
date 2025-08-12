import React from 'react'
import valuablesCSSURL from '@src/resources/styles/valuables.scss'
import valuablesTopURL from '@src/resources/img/valuables-top.jpg'
import valuablesDanyaoURL from '@src/resources/img/valuables-danyao.jpg'
import HTML from './HTML'

// 楼层数据
const floors = [
  { name: '#功法楼', type: '功法' },
  { name: '#丹药楼', type: '丹药' },
  { name: '#装备楼', type: '装备' },
  { name: '#道具楼', type: '道具' },
  { name: '#仙宠楼', type: '仙宠' }
]

// 楼层组件
const FloorSection = ({ name, type }: { name: string; type: string }) => (
  <div className="user_bottom1">
    <div className="use_data">
      <div className="use_data_head">
        <div className="user_font">{name}</div>
        <div className="user_font">类型: {type}</div>
        <div className="user_font">查看全部{type}价格</div>
      </div>
    </div>
  </div>
)

const Valuables = () => {
  const styles = `
    body {
      transform: scale(1);
      width: 100%;
      text-align: center;
    }
    .user_bottom0 {
      width: 100%;
      height: 285px;
      margin: auto;
      background-image: url('${valuablesTopURL}');
      background-size: 100% auto;
    }
    .user_bottom1 {
      margin: auto;
      background-image: url('${valuablesDanyaoURL}');
      background-size: 100% auto;
    }
    .user_bottom2 {
      width: 100%;
      margin: auto;
      background-image: url('${valuablesDanyaoURL}');
      background-size: 100% auto;
      padding-top: 20px;
    }
  `

  return (
    <HTML
      dangerouslySetInnerHTML={{ __html: styles }}
      linkStyleSheets={[valuablesCSSURL]}
    >
      <div>
        <div className="user_float">
          <div className="use_data0">
            <div className="user_font_0">#万宝楼</div>
          </div>
        </div>

        {/* 头部 */}
        <div className="user_bottom0"></div>

        {/* 介绍区域 */}
        <div className="user_bottom1">
          <div className="use_data">
            <div className="use_data_head">
              <div className="user_font">修仙界最大的当铺</div>
              <div className="user_font">汇聚天下所有物品</div>
              <div className="user_font">快去秘境历练获得神器吧</div>
            </div>
          </div>
        </div>

        {/* 动态渲染楼层 */}
        {floors.map((floor, index) => (
          <FloorSection key={index} name={floor.name} type={floor.type} />
        ))}

        {/* 底部 */}
        <div className="user_bottom2"></div>
      </div>
    </HTML>
  )
}

export default Valuables
