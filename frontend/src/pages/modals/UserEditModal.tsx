import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Tabs,
  Row,
  Col
} from 'antd'
import {
  SaveOutlined,
  UserOutlined,
  SafetyOutlined,
  GoldOutlined,
  CrownOutlined
} from '@ant-design/icons'
import { GameUser } from '@/types/types'
import { levelNames } from '@/config'

const { Option } = Select

interface UserEditModalProps {
  visible: boolean
  onCancel: () => void
  onSave: (user: GameUser) => void
  user: GameUser | null
  loading?: boolean
  getSexDisplay: (sex: string) => string
  getLinggenColor: (linggen: unknown) => string
}

export default function UserEditModal({
  visible,
  onCancel,
  onSave,
  user,
  loading = false
}: UserEditModalProps) {
  const [form] = Form.useForm()
  const [editingUser, setEditingUser] = useState<GameUser | null>(null)

  useEffect(() => {
    if (visible && user) {
      setEditingUser({ ...user })
      form.setFieldsValue({
        id: user.id,
        名号: user.名号,
        sex: user.sex,
        level_id: user.level_id,
        宣言: user.宣言,
        攻击: user.攻击,
        防御: user.防御,
        当前血量: user.当前血量,
        血量上限: user.血量上限,
        暴击率: user.暴击率,
        暴击伤害: user.暴击伤害,
        灵石: user.灵石,
        神石: user.神石,
        轮回点: user.轮回点,
        修为: user.修为,
        血气: user.血气,
        favorability: user.favorability,
        镇妖塔层数: user.镇妖塔层数,
        神魄段数: user.神魄段数,
        魔道值: user.魔道值,
        lunhui: user.lunhui,
        连续签到天数: user.连续签到天数,
        幸运: user.幸运
      })
    }
  }, [visible, user, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingUser) {
        const updatedUser: GameUser = {
          ...editingUser,
          ...values
        }
        onSave(updatedUser)
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">编辑用户</span>
          <span className="text-slate-300">用户ID: {user?.id}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className="bg-slate-600 border-slate-500 text-white"
        >
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={loading}
          className="bg-gradient-to-r from-purple-500 to-pink-500 border-0"
        >
          保存
        </Button>
      ]}
      className="user-edit-modal xiuxian-modal"
    >
      <div className="space-y-6">
        <Form form={form} layout="vertical">
          <Tabs
            type="card"
            className="xiuxian-tabs"
            tabBarStyle={{
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              borderBottom: '1px solid rgba(71, 85, 105, 0.5)'
            }}
            items={[
              {
                key: 'basic',
                label: (
                  <span className="text-white hover:text-purple-300 transition-colors flex items-center gap-2">
                    <UserOutlined />
                    基础信息
                  </span>
                ),
                children: (
                  <div className="p-4">
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-slate-200">用户ID</span>}
                          name="id"
                          rules={[{ required: true, message: '请输入用户ID' }]}
                        >
                          <Input
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-white hover:text-gray-900 hover:placeholder-gray-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
                            disabled
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-slate-200">名号</span>}
                          name="名号"
                          rules={[{ required: true, message: '请输入名号' }]}
                        >
                          <Input className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-white hover:text-gray-900 hover:placeholder-gray-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-slate-200">性别</span>}
                          name="sex"
                        >
                          <Select
                            className="bg-slate-700/50 border-slate-600 text-white"
                            dropdownStyle={{
                              backgroundColor: 'rgb(51, 65, 85)'
                            }}
                          >
                            <Option value="男">男</Option>
                            <Option value="女">女</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={<span className="text-slate-200">境界</span>}
                          name="level_id"
                        >
                          <Select
                            className="bg-slate-700/50 border-slate-600 text-white"
                            dropdownStyle={{
                              backgroundColor: 'rgb(51, 65, 85)'
                            }}
                          >
                            {Object.entries(levelNames).map(([id, name]) => (
                              <Option key={id} value={parseInt(id)}>
                                {name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item
                          label={<span className="text-slate-200">宣言</span>}
                          name="宣言"
                        >
                          <Input.TextArea
                            rows={2}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-white hover:text-gray-900 hover:placeholder-gray-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              },
              {
                key: 'combat',
                label: (
                  <span className="text-white hover:text-purple-300 transition-colors flex items-center gap-2">
                    <SafetyOutlined />
                    战斗属性
                  </span>
                ),
                children: (
                  <div className="p-4">
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">攻击力</span>}
                          name="攻击"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value: string | undefined) =>
                              value?.replace(/\$\s?|(,*)/g, '') || ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">防御力</span>}
                          name="防御"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value: string | undefined) =>
                              value?.replace(/\$\s?|(,*)/g, '') || ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={
                            <span className="text-slate-200">当前血量</span>
                          }
                          name="当前血量"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value: string | undefined) =>
                              value?.replace(/\$\s?|(,*)/g, '') || ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={
                            <span className="text-slate-200">血量上限</span>
                          }
                          name="血量上限"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value: string | undefined) =>
                              value?.replace(/\$\s?|(,*)/g, '') || ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">暴击率</span>}
                          name="暴击率"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            max={1}
                            step={0.01}
                            formatter={(value: number | string | undefined) =>
                              `${(Number(value) * 100).toFixed(2)}%`
                            }
                            parser={(value: string | undefined) =>
                              value?.replace('%', '')
                                ? Number(value?.replace('%', '')) / 100
                                : 0
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={
                            <span className="text-slate-200">暴击伤害</span>
                          }
                          name="暴击伤害"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}%`
                            }
                            parser={(value: string | undefined) =>
                              value?.replace('%', '') || 0
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              },
              {
                key: 'resources',
                label: (
                  <span className="text-white hover:text-purple-300 transition-colors flex items-center gap-2">
                    <GoldOutlined />
                    修仙资源
                  </span>
                ),
                children: (
                  <div className="p-4">
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">灵石</span>}
                          name="灵石"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value: string | undefined) =>
                              value?.replace(/\$\s?|(,*)/g, '') || ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">神石</span>}
                          name="神石"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value: string | undefined) =>
                              value?.replace(/\$\s?|(,*)/g, '') || ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">轮回点</span>}
                          name="轮回点"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">修为</span>}
                          name="修为"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value: string | undefined) =>
                              value?.replace(/\$\s?|(,*)/g, '') || ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">血气</span>}
                          name="血气"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                            formatter={(value: number | string | undefined) =>
                              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            }
                            parser={(value: string | undefined) =>
                              value?.replace(/\$\s?|(,*)/g, '') || ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">好感度</span>}
                          name="favorability"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              },
              {
                key: 'achievements',
                label: (
                  <span className="text-white hover:text-purple-300 transition-colors flex items-center gap-2">
                    <CrownOutlined />
                    修仙成就
                  </span>
                ),
                children: (
                  <div className="p-4">
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          label={
                            <span className="text-slate-200">镇妖塔层数</span>
                          }
                          name="镇妖塔层数"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={
                            <span className="text-slate-200">神魄段数</span>
                          }
                          name="神魄段数"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">魔道值</span>}
                          name="魔道值"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={
                            <span className="text-slate-200">轮回次数</span>
                          }
                          name="lunhui"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={
                            <span className="text-slate-200">连续签到天数</span>
                          }
                          name="连续签到天数"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label={<span className="text-slate-200">幸运值</span>}
                          name="幸运"
                        >
                          <InputNumber
                            className="w-full bg-slate-700/50 border-slate-600 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
                            min={0}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                )
              }
            ]}
          />
        </Form>
      </div>
    </Modal>
  )
}
