import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Tabs,
  Card,
  Row,
  Col,
  message
} from 'antd'
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Najie, NajieItem } from '@/types/types'

interface NajieEditModalProps {
  visible: boolean
  onCancel: () => void
  onSave: (najie: Najie) => void
  najie: Najie | null
  loading?: boolean
}

// 物品分类配置
const ITEM_CATEGORIES = [
  { key: '装备', label: '装备', color: 'from-blue-500/10 to-cyan-500/10' },
  { key: '丹药', label: '丹药', color: 'from-red-500/10 to-pink-500/10' },
  { key: '道具', label: '道具', color: 'from-green-500/10 to-emerald-500/10' },
  { key: '功法', label: '功法', color: 'from-purple-500/10 to-pink-500/10' },
  { key: '草药', label: '草药', color: 'from-yellow-500/10 to-orange-500/10' },
  { key: '材料', label: '材料', color: 'from-indigo-500/10 to-purple-500/10' },
  { key: '仙宠', label: '仙宠', color: 'from-pink-500/10 to-rose-500/10' },
  {
    key: '仙宠口粮',
    label: '仙宠口粮',
    color: 'from-amber-500/10 to-yellow-500/10'
  }
]

export default function NajieEditModal({
  visible,
  onCancel,
  onSave,
  najie,
  loading = false
}: NajieEditModalProps) {
  const [form] = Form.useForm()
  const [editingNajie, setEditingNajie] = useState<Najie | null>(null)

  const [inputValue, setInputValue] = useState<string>('')

  useEffect(() => {
    if (visible && najie) {
      setEditingNajie({ ...najie })
      form.setFieldsValue({
        userId: najie.userId,
        灵石: najie.灵石,
        灵石上限: najie.灵石上限,
        等级: najie.等级
      })
    }
  }, [visible, najie, form])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingNajie) {
        const updatedNajie: Najie = {
          ...editingNajie,
          userId: values.userId,
          灵石: values.灵石,
          灵石上限: values.灵石上限,
          等级: values.等级
        }
        onSave(updatedNajie)
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }

  const addItem = (category: string) => {
    // 如果输入框为空，则不添加
    if (!inputValue) return

    if (!editingNajie) return

    if (
      (editingNajie[category as keyof Najie] as NajieItem[]).some(
        item => item.name === inputValue
      )
    ) {
      message.error('已存在该物品')
      return
    }

    console.log('添加物品到分类:', category)

    const newItem: NajieItem = {
      name: inputValue,
      grade: '',
      pinji: 1,
      数量: 1
    }

    setEditingNajie({
      ...editingNajie,
      [category]: [
        ...((editingNajie[category as keyof Najie] as NajieItem[]) || []),
        newItem
      ]
    })
  }

  const removeItem = (category: string, index: number) => {
    if (!editingNajie) return

    const items = (editingNajie[category as keyof Najie] as NajieItem[]) || []
    const updatedItems = items.filter((_, i) => i !== index)

    setEditingNajie({
      ...editingNajie,
      [category]: updatedItems
    })
  }

  const updateItem = (
    category: string,
    index: number,
    field: keyof NajieItem,
    value: string | number | undefined | null
  ) => {
    if (!editingNajie) return

    const items = (editingNajie[category as keyof Najie] as NajieItem[]) || []
    const updatedItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )

    setEditingNajie({
      ...editingNajie,
      [category]: updatedItems
    })
  }

  const renderItemCard = (item: NajieItem, category: string, index: number) => (
    <Card
      key={index}
      className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 mb-3"
      size="small"
    >
      <Row gutter={[8, 8]}>
        <Col span={8}>
          <Input
            placeholder="物品名称"
            value={item.name}
            onChange={e => updateItem(category, index, 'name', e.target.value)}
            className="bg-slate-600/50 border-slate-500 text-white placeholder-slate-400 hover:bg-white hover:text-gray-900 hover:placeholder-gray-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300"></div>
        </Col>
        <Col span={4}>
          <Input
            placeholder="品质"
            value={item.grade}
            onChange={e => updateItem(category, index, 'grade', e.target.value)}
            className="bg-slate-600/50 border-slate-500 text-white placeholder-slate-400 hover:bg-white hover:text-gray-900 hover:placeholder-gray-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
          />
        </Col>
        <Col span={3}>
          <InputNumber
            placeholder="品级"
            value={item.pinji}
            onChange={value => updateItem(category, index, 'pinji', value)}
            className="w-full bg-slate-600/50 border-slate-500 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
            min={1}
          />
        </Col>
        <Col span={3}>
          <InputNumber
            placeholder="数量"
            value={item.数量}
            onChange={value => updateItem(category, index, '数量', value)}
            className="w-full bg-slate-600/50 border-slate-500 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
            min={1}
          />
        </Col>
        <Col span={3}>
          <InputNumber
            placeholder="攻击"
            value={item.atk}
            onChange={value => updateItem(category, index, 'atk', value)}
            className="w-full bg-slate-600/50 border-slate-500 text-white hover:bg-white hover:text-gray-900 focus:bg-white focus:text-gray-900"
          />
        </Col>
        <Col span={3}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeItem(category, index)}
            className="text-red-400 hover:text-red-300"
          />
        </Col>
      </Row>
    </Card>
  )

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">编辑背包</span>
          <span className="text-slate-300">用户ID: {najie?.userId}</span>
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
      className="najie-edit-modal xiuxian-modal"
    >
      <div className="space-y-6">
        {/* 基本信息 */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={<span className="text-slate-200">用户ID</span>}
                  name="userId"
                  rules={[{ required: true, message: '请输入用户ID' }]}
                >
                  <Input className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-white hover:text-gray-900 hover:placeholder-gray-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={<span className="text-slate-200">灵石</span>}
                  name="灵石"
                  rules={[{ required: true, message: '请输入灵石数量' }]}
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
              <Col span={8}>
                <Form.Item
                  label={<span className="text-slate-200">灵石上限</span>}
                  name="灵石上限"
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
            </Row>
          </Form>
        </Card>

        {/* 物品分类编辑 */}
        <Tabs
          type="card"
          className="najie-tabs xiuxian-tabs"
          tabBarStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderBottom: '1px solid rgba(71, 85, 105, 0.5)'
          }}
          tabBarGutter={8}
          items={ITEM_CATEGORIES.map(category => ({
            key: category.key,
            label: (
              <span className="text-white hover:text-purple-300 transition-colors">
                {category.label} (
                {editingNajie?.[category.key as keyof Najie]?.length || 0})
              </span>
            ),
            children: (
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">
                    {category.label}
                  </h3>
                  <div className="flex gap-6">
                    <Input
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      className=" max-w-40 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 hover:bg-white hover:text-gray-900 hover:placeholder-gray-500 focus:bg-white focus:text-gray-900 focus:placeholder-gray-500"
                    />
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => addItem(category.key)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 border-0"
                    >
                      添加物品
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {(
                    (editingNajie?.[
                      category.key as keyof Najie
                    ] as NajieItem[]) || []
                  ).map((item, index) =>
                    renderItemCard(item, category.key, index)
                  )}
                </div>

                {(() => {
                  const items = editingNajie?.[category.key as keyof Najie]
                  return (
                    !items ||
                    !Array.isArray(items) ||
                    (items as NajieItem[]).length === 0
                  )
                })() && (
                  <div className="text-center py-8 text-slate-400">
                    暂无{category.label}，点击上方按钮添加
                  </div>
                )}
              </div>
            )
          }))}
        />
      </div>
    </Modal>
  )
}
