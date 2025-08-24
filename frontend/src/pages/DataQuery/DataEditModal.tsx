import React, { useState, useEffect } from 'react'
import {
  Modal,
  Input,
  InputNumber,
  Switch,
  Button,
  message,
  Space,
  Card,
  Typography,
  Select
} from 'antd'

// 导入UI组件库
import { XiuxianPagination } from '@/components/ui'
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { updateDataListAPI } from '@/api/auth'

const { TextArea } = Input
const { Text } = Typography
const { Option } = Select

interface DataEditModalProps {
  visible: boolean
  onCancel: () => void
  onSuccess: () => void
  dataType: string
  dataTypeName: string
  originalData: Record<string, unknown>[]
}

interface FieldConfig {
  key: string
  label: string
  type: 'string' | 'number' | 'boolean' | 'textarea' | 'json'
  required?: boolean
}

interface DataItem {
  [key: string]: unknown
}

export default function DataEditModal({
  visible,
  onCancel,
  onSuccess,
  dataType,
  dataTypeName,
  originalData
}: DataEditModalProps) {
  const [loading, setLoading] = useState(false)
  const [editingData, setEditingData] = useState<DataItem[]>([])
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>([])

  // 分块处理相关状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [batchMode, setBatchMode] = useState(false)
  const [batchField, setBatchField] = useState<string>('')
  const [batchValue, setBatchValue] = useState<string>('')

  // 初始化字段配置
  useEffect(() => {
    if (originalData.length > 0) {
      const sampleItem = originalData[0]
      const configs: FieldConfig[] = Object.keys(sampleItem).map(key => {
        const value = sampleItem[key]
        let type: FieldConfig['type'] = 'string'

        if (typeof value === 'number') {
          type = 'number'
        } else if (typeof value === 'boolean') {
          type = 'boolean'
        } else if (typeof value === 'object') {
          type = 'json'
        } else if (typeof value === 'string' && value.length > 100) {
          type = 'textarea'
        }

        return {
          key,
          label: key,
          type,
          required: false
        }
      })
      setFieldConfigs(configs)
      setEditingData([...originalData] as DataItem[])
      setBatchField(configs[0]?.key || '')
    }
  }, [originalData])

  // 计算当前页数据
  const currentPageData = editingData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )

  // 处理数据更新
  const handleUpdateData = (index: number, field: string, value: unknown) => {
    const newData = [...editingData]
    const globalIndex = (currentPage - 1) * pageSize + index
    newData[globalIndex] = { ...newData[globalIndex], [field]: value }
    setEditingData(newData)
  }

  // 处理删除行
  const handleDeleteRow = (index: number) => {
    const globalIndex = (currentPage - 1) * pageSize + index
    const newData = editingData.filter((_, i) => i !== globalIndex)
    setEditingData(newData)

    // 调整当前页
    const totalPages = Math.ceil(newData.length / pageSize)
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }

  // 处理添加行
  const handleAddRow = () => {
    if (originalData.length > 0) {
      const newRow = Object.keys(originalData[0]).reduce((acc, key) => {
        acc[key] = ''
        return acc
      }, {} as DataItem)
      setEditingData([...editingData, newRow])

      // 跳转到最后一页
      const newTotalPages = Math.ceil((editingData.length + 1) / pageSize)
      setCurrentPage(newTotalPages)
    }
  }

  // 批量更新选中行
  const handleBatchUpdate = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要更新的行')
      return
    }

    if (!batchField) {
      message.warning('请选择要更新的字段')
      return
    }

    const newData = [...editingData]
    selectedRows.forEach(globalIndex => {
      if (newData[globalIndex]) {
        newData[globalIndex] = {
          ...newData[globalIndex],
          [batchField]: batchValue
        }
      }
    })

    setEditingData(newData)
    setSelectedRows([])
    setBatchMode(false)
    message.success(`已批量更新 ${selectedRows.length} 行数据`)
  }

  // 选择/取消选择行
  const handleSelectRow = (index: number) => {
    const globalIndex = (currentPage - 1) * pageSize + index
    const newSelected = selectedRows.includes(globalIndex)
      ? selectedRows.filter(i => i !== globalIndex)
      : [...selectedRows, globalIndex]
    setSelectedRows(newSelected)
  }

  // 渲染字段输入组件
  const renderFieldInput = (
    field: FieldConfig,
    value: unknown,
    index: number
  ) => {
    const handleChange = (val: unknown) => {
      handleUpdateData(index, field.key, val)
    }

    switch (field.type) {
      case 'number':
        return (
          <InputNumber
            value={value as number}
            onChange={handleChange}
            className="w-full"
            placeholder={`请输入${field.label}`}
          />
        )
      case 'boolean':
        return (
          <Switch
            checked={value as boolean}
            onChange={handleChange}
            checkedChildren="是"
            unCheckedChildren="否"
          />
        )
      case 'textarea':
        return (
          <TextArea
            value={value as string}
            onChange={e => handleChange(e.target.value)}
            rows={3}
            placeholder={`请输入${field.label}`}
          />
        )
      case 'json':
        return (
          <TextArea
            value={
              typeof value === 'object'
                ? JSON.stringify(value, null, 2)
                : String(value)
            }
            onChange={e => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleChange(parsed)
              } catch {
                handleChange(e.target.value)
              }
            }}
            rows={4}
            placeholder={`请输入${field.label} (JSON格式)`}
          />
        )
      default:
        return (
          <Input
            value={String(value)}
            onChange={e => handleChange(e.target.value)}
            placeholder={`请输入${field.label}`}
          />
        )
    }
  }

  // 保存数据
  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        message.error('未找到登录令牌')
        return
      }

      const result = await updateDataListAPI(token, dataType, editingData)

      if (result.success) {
        message.success('数据保存成功')
        onSuccess()
        onCancel()
      } else {
        message.error(result.message || '保存失败')
      }
    } catch (error) {
      console.error('保存数据失败:', error)
      message.error('保存数据失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <EditOutlined className="text-purple-400" />
          <span>编辑 {dataTypeName}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      width="95%"
      style={{ top: 20 }}
      className="xiuxian-modal"
      footer={[
        <Button key="cancel" onClick={onCancel} icon={<CloseOutlined />}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          loading={loading}
          onClick={handleSave}
          icon={<SaveOutlined />}
          className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 hover:from-purple-600 hover:to-pink-600"
        >
          保存
        </Button>
      ]}
    >
      <div className="max-h-[70vh] overflow-y-auto">
        {/* 操作按钮 */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Text className="text-slate-600">
              共 {editingData.length} 条数据，当前页 {currentPageData.length} 条
            </Text>
            <Text className="text-slate-600">
              已选择 {selectedRows.length} 行
            </Text>
          </div>
          <Space>
            <Button
              type="primary"
              onClick={handleAddRow}
              icon={<PlusOutlined />}
              className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 hover:from-green-600 hover:to-emerald-600"
            >
              添加行
            </Button>
            <Button
              onClick={() => setBatchMode(!batchMode)}
              className={batchMode ? 'bg-blue-500 text-white' : ''}
            >
              批量操作
            </Button>
          </Space>
        </div>

        {/* 批量操作区域 */}
        {batchMode && (
          <Card className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
            <div className="flex items-center gap-4">
              <Text strong>批量更新：</Text>
              <Select
                value={batchField}
                onChange={setBatchField}
                style={{ width: 150 }}
                placeholder="选择字段"
              >
                {fieldConfigs.map(field => (
                  <Option key={field.key} value={field.key}>
                    {field.label}
                  </Option>
                ))}
              </Select>
              <Input
                value={batchValue}
                onChange={e => setBatchValue(e.target.value)}
                placeholder="输入新值"
                style={{ width: 200 }}
              />
              <Button
                type="primary"
                onClick={handleBatchUpdate}
                disabled={selectedRows.length === 0}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 border-0"
              >
                批量更新 ({selectedRows.length})
              </Button>
            </div>
          </Card>
        )}

        {/* 分页控制 */}
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Text>每页显示：</Text>
            <Select
              value={pageSize}
              onChange={value => {
                setPageSize(value)
                setCurrentPage(1)
              }}
              style={{ width: 80 }}
            >
              <Option value={5}>5条</Option>
              <Option value={10}>10条</Option>
              <Option value={20}>20条</Option>
              <Option value={50}>50条</Option>
            </Select>
          </div>
          <XiuxianPagination
            current={currentPage}
            pageSize={pageSize}
            total={editingData.length}
            showSizeChanger={false}
            showQuickJumper={true}
            showTotal={(total: number, range: [number, number]) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
            onChange={page => setCurrentPage(page)}
          />
        </div>

        {/* 数据编辑表格 */}
        <div className="space-y-4">
          {currentPageData.map((item, index) => {
            const globalIndex = (currentPage - 1) * pageSize + index
            const isSelected = selectedRows.includes(globalIndex)

            return (
              <Card
                key={globalIndex}
                title={
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectRow(index)}
                      className="mr-2"
                    />
                    <span>第 {globalIndex + 1} 条数据</span>
                  </div>
                }
                size="small"
                className={`border-2 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300'
                    : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
                }`}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRow(index)}
                  >
                    删除
                  </Button>
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fieldConfigs.map(field => (
                    <div key={field.key} className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {renderFieldInput(field, item[field.key], index)}
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>

        {currentPageData.length === 0 && (
          <div className="text-center py-8 text-slate-500">当前页暂无数据</div>
        )}

        {/* 底部分页 */}
        <div className="mt-4 flex justify-center">
          <XiuxianPagination
            current={currentPage}
            pageSize={pageSize}
            total={editingData.length}
            showSizeChanger={false}
            showQuickJumper={true}
            showTotal={(total: number, range: [number, number]) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
            onChange={page => setCurrentPage(page)}
          />
        </div>
      </div>
    </Modal>
  )
}
