import React from 'react'
import { Modal, Tag } from 'antd'
import { GameUser } from '@/types'
import { CloseOutlined } from '@ant-design/icons'

const UserInfo = ({
  userDetailVisible,
  setUserDetailVisible,
  selectedUser,
  getSexDisplay,
  getLevelName,
  getLinggenColor
}: {
  userDetailVisible: boolean
  setUserDetailVisible: (visible: boolean) => void
  selectedUser: GameUser | null
  getSexDisplay: (sex: string) => string
  getLevelName: (levelId: number) => string
  getLinggenColor: (linggen: unknown) => string
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">
            {selectedUser?.数据状态 === 'corrupted'
              ? '损坏数据详情'
              : '用户详情'}
          </span>
        </div>
      }
      open={userDetailVisible}
      onCancel={() => setUserDetailVisible(false)}
      footer={null}
      className="xiuxian-model"
      closeIcon={<CloseOutlined className="text-white" />}
      width={selectedUser?.数据状态 === 'corrupted' ? 1200 : 800}
    >
      {selectedUser && (
        <div className="space-y-6">
          {/* 如果是损坏数据，显示原始JSON */}
          {selectedUser.数据状态 === 'corrupted' ? (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                损坏数据 - 原始JSON内容
              </h3>
              <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                <p className="text-sm text-red-300 mb-2">
                  错误信息: {selectedUser.错误信息}
                </p>
                <pre className="text-xs text-slate-300 overflow-auto max-h-96 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                  {selectedUser.原始数据}
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
                    <p className="font-medium text-white">{selectedUser.id}</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">名号</label>
                    <p className="font-medium text-white">
                      {selectedUser.名号}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">性别</label>
                    <p className="font-medium text-white">
                      {getSexDisplay(selectedUser.sex)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">境界</label>
                    <p className="font-medium text-white">
                      {getLevelName(selectedUser.level_id)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">灵根</label>
                    <Tag
                      color={getLinggenColor(selectedUser.灵根)}
                      className="border-0"
                      style={{
                        background: `linear-gradient(135deg, ${getLinggenColor(selectedUser.灵根)}20, ${getLinggenColor(selectedUser.灵根)}40)`,
                        color: getLinggenColor(selectedUser.灵根),
                        border: `1px solid ${getLinggenColor(selectedUser.灵根)}30`
                      }}
                    >
                      {selectedUser.灵根?.name || '未知'}
                    </Tag>
                  </div>
                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">修炼效率</label>
                    <p className="font-medium text-white">
                      {((selectedUser.修炼效率提升 || 0) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
                    <label className="text-sm text-slate-400">宣言</label>
                    <p className="font-medium text-white">
                      {selectedUser.宣言 || '这个人很懒还没有写'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 战斗属性 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  战斗属性
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">攻击力</label>
                    <p className="text-xl font-bold text-blue-400">
                      {(selectedUser.攻击 || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">防御力</label>
                    <p className="text-xl font-bold text-green-400">
                      {(selectedUser.防御 || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">当前血量</label>
                    <p className="text-xl font-bold text-red-400">
                      {(selectedUser.当前血量 || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">血量上限</label>
                    <p className="text-xl font-bold text-red-400">
                      {(selectedUser.血量上限 || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">暴击率</label>
                    <p className="text-xl font-bold text-purple-400">
                      {((selectedUser.暴击率 || 0) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">暴击伤害</label>
                    <p className="text-xl font-bold text-purple-400">
                      {selectedUser.暴击伤害}%
                    </p>
                  </div>
                </div>
              </div>

              {/* 资源信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  资源信息
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">灵石</label>
                    <p className="text-xl font-bold text-green-400">
                      {(selectedUser.灵石 || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">神石</label>
                    <p className="text-xl font-bold text-yellow-400">
                      {(selectedUser.神石 || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">轮回点</label>
                    <p className="text-xl font-bold text-purple-400">
                      {selectedUser.轮回点}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">修为</label>
                    <p className="text-xl font-bold text-blue-400">
                      {(selectedUser.修为 || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">血气</label>
                    <p className="text-xl font-bold text-red-400">
                      {(selectedUser.血气 || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-xl border border-pink-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">好感度</label>
                    <p className="text-xl font-bold text-pink-400">
                      {selectedUser.favorability}
                    </p>
                  </div>
                </div>
              </div>

              {/* 成就信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  成就信息
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-xl border border-orange-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">镇妖塔层数</label>
                    <p className="text-xl font-bold text-orange-400">
                      {selectedUser.镇妖塔层数}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">神魄段数</label>
                    <p className="text-xl font-bold text-indigo-400">
                      {selectedUser.神魄段数}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">魔道值</label>
                    <p className="text-xl font-bold text-red-400">
                      {selectedUser.魔道值}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">轮回次数</label>
                    <p className="text-xl font-bold text-purple-400">
                      {selectedUser.lunhui}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">连续签到</label>
                    <p className="text-xl font-bold text-green-400">
                      {selectedUser.连续签到天数}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4">
                    <label className="text-sm text-slate-400">幸运值</label>
                    <p className="text-xl font-bold text-yellow-400">
                      {selectedUser.幸运}
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

export default UserInfo
