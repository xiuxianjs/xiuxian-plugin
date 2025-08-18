import React from 'react'
import { Modal } from 'antd'
import { Najie } from '@/types'
import { CloseOutlined } from '@ant-design/icons'

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
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">用户ID</label>
                    <p className="font-medium text-white">
                      {selectedNajie.userId}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">背包等级</label>
                    <p className="font-medium text-white">
                      {selectedNajie.等级 || 1}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">总物品数</label>
                    <p className="font-medium text-white">
                      {getTotalItems(selectedNajie)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">当前灵石</label>
                    <p className="font-medium text-green-400">
                      {selectedNajie.灵石?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* 物品统计 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  物品统计
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">装备</label>
                    <p className="text-xl font-bold text-blue-400">
                      {selectedNajie.装备?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">丹药</label>
                    <p className="text-xl font-bold text-green-400">
                      {selectedNajie.丹药?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">道具</label>
                    <p className="text-xl font-bold text-purple-400">
                      {selectedNajie.道具?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">功法</label>
                    <p className="text-xl font-bold text-yellow-400">
                      {selectedNajie.功法?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">草药</label>
                    <p className="text-xl font-bold text-red-400">
                      {selectedNajie.草药?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">材料</label>
                    <p className="text-xl font-bold text-yellow-400">
                      {selectedNajie.材料?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-xl border border-pink-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">仙宠</label>
                    <p className="text-xl font-bold text-pink-400">
                      {selectedNajie.仙宠?.length || 0}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">仙宠口粮</label>
                    <p className="text-xl font-bold text-indigo-400">
                      {selectedNajie.仙宠口粮?.length || 0}
                    </p>
                  </div>
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
