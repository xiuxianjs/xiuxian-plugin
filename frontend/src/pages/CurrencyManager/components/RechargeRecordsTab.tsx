import React from 'react'
import { Table, Button, Input, Select, Tag, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined, GiftOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { RechargeRecord } from '@/types/CurrencyManager'

const { Option } = Select

interface RechargeRecordsTabProps {
  records: RechargeRecord[]
  loading: boolean
}

export default function RechargeRecordsTab({
  records,
  loading
}: RechargeRecordsTabProps) {
  const [searchText, setSearchText] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('')
  const [typeFilter, setTypeFilter] = React.useState<string>('')

  const columns: ColumnsType<RechargeRecord> = [
    {
      title: '记录ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: id => (
        <div className="font-mono text-xs bg-slate-700/50 px-2 py-1 rounded">
          {id}
        </div>
      )
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 120,
      render: userId => (
        <div className="font-mono text-sm bg-slate-700/50 px-2 py-1 rounded">
          {userId}
        </div>
      )
    },
    {
      title: '充值类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type, record) => (
        <div className="space-y-1">
          <Tag color={getTypeColor(type)}>{getTypeName(type)}</Tag>
          {record.tier && (
            <div className="text-xs text-slate-400">{record.tier}</div>
          )}
        </div>
      )
    },
    {
      title: '充值金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount, record) => (
        <div className="space-y-1">
          <div className="font-bold text-green-400">¥{amount}</div>
          {record.currency_gained > 0 && (
            <div className="text-xs text-yellow-400">
              获得金币: {record.currency_gained.toLocaleString()}
            </div>
          )}
          {record.month_card_days > 0 && (
            <div className="text-xs text-blue-400">
              月卡天数: {record.month_card_days}天
            </div>
          )}
        </div>
      )
    },
    {
      title: '支付状态',
      dataIndex: 'payment_status',
      key: 'payment_status',
      width: 100,
      render: status => (
        <Tag color={getStatusColor(status)}>{getStatusName(status)}</Tag>
      )
    },
    {
      title: '支付信息',
      key: 'paymentInfo',
      width: 150,
      render: (_unused, record) => (
        <div className="space-y-1 text-xs">
          <div>
            <span className="text-slate-400">方式:</span>
            <span className="text-slate-300 ml-1">{record.payment_method}</span>
          </div>
          {record.transaction_id && (
            <div>
              <span className="text-slate-400">交易号:</span>
              <div className="text-slate-300 font-mono">
                {record.transaction_id}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: '时间信息',
      key: 'timeInfo',
      width: 180,
      render: (_, record) => (
        <div className="space-y-1 text-xs">
          <div>
            <span className="text-slate-400">创建:</span>
            <div className="text-slate-300">
              {dayjs(record.created_at).format('MM-DD HH:mm')}
            </div>
          </div>
          {record.paid_at && (
            <div>
              <span className="text-slate-400">支付:</span>
              <div className="text-slate-300">
                {dayjs(record.paid_at).format('MM-DD HH:mm')}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: '特殊标记',
      key: 'special',
      width: 100,
      render: (_, record) => (
        <div className="space-y-1">
          {record.is_first_recharge && (
            <Tag color="gold" icon={<GiftOutlined />}>
              首充
            </Tag>
          )}
          {record.first_recharge_bonus > 0 && (
            <div className="text-xs text-yellow-400">
              奖励: +{record.first_recharge_bonus}
            </div>
          )}
        </div>
      )
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              // 查看详情 - 待实现
            }}
          >
            详情
          </Button>
        </Space>
      )
    }
  ]

  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.user_id.toLowerCase().includes(searchText.toLowerCase()) ||
      record.id.toLowerCase().includes(searchText.toLowerCase())
    const matchesStatus =
      !statusFilter || record.payment_status === statusFilter
    const matchesType = !typeFilter || record.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 min-w-0">
          <Input.Search
            placeholder="搜索用户ID或记录ID"
            allowClear
            className="xiuxian-input"
            onSearch={setSearchText}
          />
        </div>
        <Select
          placeholder="支付状态"
          allowClear
          className="xiuxian-select"
          style={{ width: 120 }}
          onChange={setStatusFilter}
        >
          <Option value="pending">待支付</Option>
          <Option value="success">支付成功</Option>
          <Option value="failed">支付失败</Option>
          <Option value="refunded">已退款</Option>
        </Select>
        <Select
          placeholder="充值类型"
          allowClear
          className="xiuxian-select"
          style={{ width: 120 }}
          onChange={setTypeFilter}
        >
          <Option value="currency">金币充值</Option>
          <Option value="small_month_card">小月卡</Option>
          <Option value="big_month_card">大月卡</Option>
          <Option value="combo">组合充值</Option>
        </Select>
        <div className="text-slate-400 text-sm">
          共 {filteredRecords.length} 条记录
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredRecords}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: total => `共 ${total} 条记录`
        }}
        rowClassName={() => 'bg-slate-700 hover:bg-slate-600'}
        className="xiuxian-table"
      />
    </div>
  )
}

// 辅助函数
function getTypeColor(type: string): string {
  switch (type) {
    case 'currency':
      return 'green'
    case 'small_month_card':
      return 'blue'
    case 'big_month_card':
      return 'purple'
    case 'combo':
      return 'orange'
    default:
      return 'default'
  }
}

function getTypeName(type: string): string {
  switch (type) {
    case 'currency':
      return '金币充值'
    case 'small_month_card':
      return '小月卡'
    case 'big_month_card':
      return '大月卡'
    case 'combo':
      return '组合充值'
    default:
      return type
  }
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending':
      return 'orange'
    case 'success':
      return 'green'
    case 'failed':
      return 'red'
    case 'refunded':
      return 'gray'
    default:
      return 'default'
  }
}

function getStatusName(status: string): string {
  switch (status) {
    case 'pending':
      return '待支付'
    case 'success':
      return '支付成功'
    case 'failed':
      return '支付失败'
    case 'refunded':
      return '已退款'
    default:
      return status
  }
}
