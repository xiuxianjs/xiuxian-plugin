import React from 'react'
import { Modal } from 'antd'
import { Najie } from '@/types/types'
import { CloseOutlined } from '@ant-design/icons'

// 导入UI组件库
import { XiuxianInfoCard } from '@/components/ui'

const NajieInfo = ({
  najieDetailVisible,
  setNajieDetailVisible,
  selectedNajie,
  getTotalItems
}: {
  najieDetailVisible: boolean
  setNajieDetailVisible: (visible: boolean) => void
  selectedNajie: Najie | null
  getTotalItems: (najie: Najie) => number
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            {selectedNajie?.数据状态 === 'corrupted'
              ? '损坏数据详情'
              : '背包详情'}
          </span>
        </div>
      }
      open={najieDetailVisible}
      onCancel={() => setNajieDetailVisible(false)}
      footer={null}
      closeIcon={<CloseOutlined className="text-white" />}
      className="xiuxian-modal"
      width={selectedNajie?.数据状态 === 'corrupted' ? 1200 : 800}
    >
      {selectedNajie && (
        <div className="space-y-6">
          {/* 如果是损坏数据，显示原始JSON */}
          {selectedNajie.数据状态 === 'corrupted' ? (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                损坏数据 - 原始JSON内容
              </h3>
              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                <p className="text-sm text-red-300 mb-2">
                  错误信息: {selectedNajie.错误信息}
                </p>
                <pre className="text-xs text-slate-300 overflow-auto max-h-96 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  {selectedNajie.原始数据}
                </pre>
              </div>
            </div>
          ) : (
            <>
              {/* 基础信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  基础信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <XiuxianInfoCard
                    label="用户ID"
                    value={selectedNajie.userId}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="背包等级"
                    value={selectedNajie.等级 || 1}
                    gradient="green"
                  />
                  <XiuxianInfoCard
                    label="总物品数"
                    value={getTotalItems(selectedNajie)}
                    gradient="purple"
                  />
                  <XiuxianInfoCard
                    label="当前灵石"
                    value={`${selectedNajie.灵石?.toLocaleString() || 0}`}
                    gradient="green"
                  />
                </div>
              </div>

              {/* 物品统计 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  物品统计
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <XiuxianInfoCard
                    label="装备"
                    value={selectedNajie.装备?.length || 0}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="丹药"
                    value={selectedNajie.丹药?.length || 0}
                    gradient="green"
                  />
                  <XiuxianInfoCard
                    label="道具"
                    value={selectedNajie.道具?.length || 0}
                    gradient="purple"
                  />
                  <XiuxianInfoCard
                    label="功法"
                    value={selectedNajie.功法?.length || 0}
                    gradient="orange"
                  />
                </div>
              </div>

              {/* 其他物品 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  其他物品
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <XiuxianInfoCard
                    label="草药"
                    value={selectedNajie.草药?.length || 0}
                    gradient="green"
                  />
                  <XiuxianInfoCard
                    label="材料"
                    value={selectedNajie.材料?.length || 0}
                    gradient="yellow"
                  />
                  <XiuxianInfoCard
                    label="仙宠"
                    value={selectedNajie.仙宠?.length || 0}
                    gradient="pink"
                  />
                  <XiuxianInfoCard
                    label="灵石上限"
                    value={`${selectedNajie.灵石上限?.toLocaleString() || 0}`}
                    gradient="blue"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </Modal>
  )
}

export default NajieInfo
