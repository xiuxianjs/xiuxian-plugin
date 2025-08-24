import React from 'react'
import { Modal, Tag } from 'antd'
import { GameUser } from '@/types/types'
import { CloseOutlined } from '@ant-design/icons'

// 导入UI组件库
import { XiuxianInfoCard } from '@/components/ui'

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
      className="xiuxian-modal"
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
                  <XiuxianInfoCard
                    label="用户ID"
                    value={selectedUser.id}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="名号"
                    value={selectedUser.名号}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="性别"
                    value={getSexDisplay(selectedUser.sex)}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="境界"
                    value={getLevelName(selectedUser.level_id)}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="灵根"
                    value={
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
                    }
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="修炼效率"
                    value={`${((selectedUser.修炼效率提升 || 0) * 100).toFixed(2)}%`}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="宣言"
                    value={selectedUser.宣言 || '这个人很懒还没有写'}
                    gradient="blue"
                    fullWidth
                  />
                </div>
              </div>

              {/* 战斗属性 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  战斗属性
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <XiuxianInfoCard
                    label="攻击力"
                    value={(selectedUser.攻击 || 0).toLocaleString()}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="防御力"
                    value={(selectedUser.防御 || 0).toLocaleString()}
                    gradient="green"
                  />
                  <XiuxianInfoCard
                    label="当前血量"
                    value={(selectedUser.当前血量 || 0).toLocaleString()}
                    gradient="red"
                  />
                  <XiuxianInfoCard
                    label="血量上限"
                    value={(selectedUser.血量上限 || 0).toLocaleString()}
                    gradient="orange"
                  />
                  <XiuxianInfoCard
                    label="暴击率"
                    value={`${((selectedUser.暴击率 || 0) * 100).toFixed(2)}%`}
                    gradient="purple"
                  />
                  <XiuxianInfoCard
                    label="暴击伤害"
                    value={`${selectedUser.暴击伤害}%`}
                    gradient="indigo"
                  />
                </div>
              </div>

              {/* 资源信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  资源信息
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <XiuxianInfoCard
                    label="灵石"
                    value={(selectedUser.灵石 || 0).toLocaleString()}
                    gradient="green"
                  />
                  <XiuxianInfoCard
                    label="神石"
                    value={(selectedUser.神石 || 0).toLocaleString()}
                    gradient="yellow"
                  />
                  <XiuxianInfoCard
                    label="轮回点"
                    value={selectedUser.轮回点}
                    gradient="purple"
                  />
                  <XiuxianInfoCard
                    label="修为"
                    value={(selectedUser.修为 || 0).toLocaleString()}
                    gradient="blue"
                  />
                  <XiuxianInfoCard
                    label="血气"
                    value={(selectedUser.血气 || 0).toLocaleString()}
                    gradient="red"
                  />
                  <XiuxianInfoCard
                    label="好感度"
                    value={selectedUser.favorability}
                    gradient="pink"
                  />
                </div>
              </div>

              {/* 成就信息 */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  成就信息
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <XiuxianInfoCard
                    label="镇妖塔层数"
                    value={selectedUser.镇妖塔层数}
                    gradient="orange"
                  />
                  <XiuxianInfoCard
                    label="神魄段数"
                    value={selectedUser.神魄段数}
                    gradient="indigo"
                  />
                  <XiuxianInfoCard
                    label="魔道值"
                    value={selectedUser.魔道值}
                    gradient="red"
                  />
                  <XiuxianInfoCard
                    label="轮回次数"
                    value={selectedUser.lunhui}
                    gradient="purple"
                  />
                  <XiuxianInfoCard
                    label="连续签到"
                    value={selectedUser.连续签到天数}
                    gradient="green"
                  />
                  <XiuxianInfoCard
                    label="幸运值"
                    value={selectedUser.幸运}
                    gradient="yellow"
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

export default UserInfo
