import React from 'react'
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
  <div
    className="mx-auto bg-cover bg-center rounded-lg shadow-md p-4"
    style={{ backgroundImage: `url(${valuablesDanyaoURL})` }}
  >
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-bold text-gray-800">{name}</div>
      <div className="text-base text-gray-600">类型: {type}</div>
      <div className="text-base text-blue-500 cursor-pointer hover:underline">
        查看全部{type}价格
      </div>
    </div>
  </div>
)

const Valuables = () => {
  const styles = ``

  return (
    <HTML dangerouslySetInnerHTML={{ __html: styles }}>
      <div className="w-full text-center">
        <div
          className="mx-auto py-20 bg-white rounded-lg shadow p-4 flex flex-col items-center"
          style={{
            backgroundImage: `url(${valuablesTopURL})`,
            backgroundSize: 'cover'
          }}
        >
          <div className="text-2xl font-extrabold text-yellow-700">#万宝楼</div>
          <div className="text-lg font-bold text-gray-800 mb-2">
            修仙界最大的当铺
          </div>
          <div className="text-base text-gray-600 mb-2">汇聚天下所有物品</div>
          <div className="text-base text-blue-500">快去秘境历练获得神器吧</div>
        </div>

        {/* 动态渲染楼层 */}
        {floors.map((floor, index) => (
          <FloorSection key={index} name={floor.name} type={floor.type} />
        ))}

        {/* 底部图片区域 */}
        <div
          className="w-full h-32 mx-auto bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${valuablesDanyaoURL})` }}
        ></div>
      </div>
    </HTML>
  )
}

export default Valuables
